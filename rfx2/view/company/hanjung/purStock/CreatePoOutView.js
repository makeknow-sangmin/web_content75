/**
 * 외주주문작성(좌측에 ASSY 리스트 출력, 우측에 그에 해당하는 BOM 리스트 출력)
 * 
 */
Ext.define('Rfx2.view.company.hanjung.purStock.CreatePoOutView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'create-po-out-view',
    initComponent: function() {


        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        //this.addSearchField('maker_name');
        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        console_logs('this.fields', this.fields);

        this.createStoreSimple({
            modelClass: 'Rfx2.model.company.kbtech.AssyModel',
            pageSize: 100,
            sorters: [{
                property: 'parent_code',
                direction: 'asc'
            }],
            byReplacer: {

            },
            deleteClass: ['cartmap']

        }, {
            //groupField: 'parent_code'
        });

        if (this.changeSupplier == false) {
            this.setRowClass(function(record, index) {

                // console_logs('record', record);
                var contract_supplier = record.get('contract_supplier');
                var supplier_name = record.get('supplier_name');

                if (contract_supplier == supplier_name) {
                    return 'green-row';
                }
            });
        }

        this.poCartListStore = Ext.create('Rfx2.store.AssyStockAllStore', {});

        this.whouseStore = Ext.create('Ext.data.Store', {
            fields: ['whouse_uid', 'dept_code'],
            data : [
                // {"whouse_uid":"103", "name":"KB테크"},
                // {"whouse_uid":"104", "name":"와이제이"},
                {"whouse_uid":"105", "name":"정민테크", "dept_code":"D205"},
                {"whouse_uid":"106", "name":"용현테크", "dept_code":"D204"},
                {"whouse_uid":"107", "name":"SMT사업부(KB텍)", "dept_code":"D207"},
                {"whouse_uid":"108", "name":"씨에스테크원", "dept_code":"D208"},
                {"whouse_uid":"109", "name":"제이와이테크", "dept_code":"D209"}
            ]
        });

        this.createPoOutAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '외주주문요청',
            tooltip: '외주주문요청',
            disabled: true,
            handler: function() {

                var isExceedQuan = false;

                var store = gm.me().poCartListStore;
                var store_count = gm.me().poCartListStore.getCount();

                // for(var i = 0; i < store_count; i++) {
                //     var record = store.getAt(i);
                //     var pr_quan_val = record.get('pr_quan');
                //     var quan00_val = record.get('quan_00');
                //
                //     if(pr_quan_val > quan00_val) {
                //         isExceedQuan = true;
                //         break;
                //     }
                // }

                //if(!isExceedQuan) {

                    Ext.MessageBox.show({
                        title:'확인',
                        msg: '해당 업체로 외주주문작성을 하시겠습니까?',
                        buttons: Ext.MessageBox.YESNO,
                        fn:  function(result) {
                            if(result=='yes') {

                                var bomArr = [];
                                var bomQtyArr = [];
                                //자재 정보이기 때문에 Assy_uid는 프로시저에서 따로 갖고 옴
                                var assy_child = gm.me().grid.getSelectionModel().getSelection()[0].get('unique_id_long');
                                var pr_quan = gu.getCmp('pr_quan').getValue();
                                var whouse_uid = gu.getCmp('whouse_uid').getValue();
                                var dept_code = '';

                                // var store = gm.me().poCartListStore;
                                // var store_count = gm.me().poCartListStore.getCount();

                                for (var i = 0; i < store_count; i++) {
                                    var record = store.getAt(i);
                                    bomQtyArr.push(record.get('pr_quan'));
                                    bomArr.push(record.get('unique_id_long'));
                                }

                                for (var i = 0; i < gm.me().whouseStore.getCount(); i++) {
                                    var record = gm.me().whouseStore.getAt(i);
                                    if(whouse_uid == record.get('whouse_uid')) {
                                        dept_code = record.get('dept_code');
                                    }
                                }

                                if(dept_code.length > 0) {
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/purchase/request.do?method=requestPoOutAndPr',
                                        //url: CONTEXT_PATH + '/purchase/request.do?method=requestPoOutAndGo',
                                        params:{
                                            bomArr:bomArr,
                                            bomQtyArr:bomQtyArr,
                                            assy_child:assy_child,
                                            pr_quan:pr_quan,
                                            whouse_uid:whouse_uid,
                                            dept_code:dept_code
                                        },
                                        success: function(){
                                            gm.me().poCartListStore.load();
                                        },
                                        failure: function(){
                                            gm.me().poCartListStore.load();
                                        }
                                    });
                                }

                                /*
                                 1. RTGAST 외주가공(OU) 생성
                                 2. CARTMAP, XPOAST 생성(ASSY만)
                                 - 필요한 변수 : whouse_uid, assymap_uid, quan / creator, creator_uid
                                 3. RTGAST 불출요청(GO) 생성
                                 4. CARTMAP 생성(BOM만)
                                 - 필요한 변수 : assymap_uids, pr_quan
                                 5. 하위 자재 할당
                                 6. XPOAST를 통한 입고처리(불출이 다 끝나야 입고처리가 가능하다.)
                                 7. 입고처리 하면 자재 털고, 제품 재고 증가
                                 */
                            }
                        },
                        //animateTarget: 'mb4',
                        icon: Ext.MessageBox.QUESTION
                    });
                //} else {
                //    Ext.Msg.alert('', '불출 예정 수량이 본사 창고 수량보다 더 많은 자재가 있습니다.');
                //}

            }
        });


        this.gridPoList = Ext.create('Ext.grid.Panel', {
            store: this.poCartListStore,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            flex: 1,
            frame: true,
            //bbar: getPageToolbar(this.poCartListStore),
            border: true,
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            /*selModel: Ext.create("Ext.selection.CheckboxModel", {}),*/
            margin: '0 0 0 0',
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [
                        {
                            fieldLabel: '외주사',
                            xtype: 'combo',
                            id: gu.id('whouse_uid'),
                            labelWidth: 60,
                            width: 200,
                            store: this.whouseStore,
                            name: 'whouse_uid',
                            valueField: 'whouse_uid',
                            displayField: 'name',
                            emptyText: '선택해주세요.',
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{}">{name}</div>';
                                }
                            },
                            listeners: {
                                select: function (combo, record) {
                                    gu.getCmp('pr_quan').setReadOnly(false)

                                }
                            }
                        },
                        {
                            id: gu.id('pr_quan'),
                            fieldLabel: '요청수량',
                            labelWidth: 60,
                            allowBlank: true,
                            xtype: 'numberfield',
                            enableKeyEvents: true,
                            readOnly: true,
                            value: 0,
                            width: 200,
                            listeners : {
                                keyup : function (txt, newValue, oldValue) {

                                    gm.me().createPoOutAction.enable();

                                    var count = gm.me().poCartListStore.getCount();
                                    var whouse_uid = gu.getCmp('whouse_uid').getValue();
                                    var quan_name = 0;

                                    switch(whouse_uid) {
                                        case '105':
                                            quan_name = 1;
                                            break;
                                        case '106':
                                            quan_name = 2;
                                            break;
                                        case '107':
                                            quan_name = 3;
                                            break;
                                        case '108':
                                            quan_name = 4;
                                            break;
                                        case '109':
                                            quan_name = 4;
                                            break;
                                        default:
                                            quan_name = 0;
                                    }

                                    for(var i = 0; i < count; i++) {
                                        var record =  gm.me().poCartListStore.getAt(i);
                                        var bm_quan = record.get('bm_quan');
                                        var unit_mass = record.get('unit_mass');
                                        var quan = record.get('quan_0'+quan_name);

                                        var pr_quan = (bm_quan * txt.value) - quan;
                                        var pr_quan_with_unit_mass = 0;

                                        if(pr_quan < 0) {
                                            pr_quan = 0;
                                        }

                                        if(unit_mass > 0 && pr_quan != 0) {
                                            do {
                                                pr_quan_with_unit_mass += unit_mass;
                                            } while(pr_quan_with_unit_mass < pr_quan);

                                            pr_quan = pr_quan_with_unit_mass;
                                        }

                                        record.set("pr_quan", pr_quan);
                                    }
                                }
                            }
                        },
                        this.createPoOutAction
                    ]
                }
            ],
            columns: [
                {text: '품번', width: 100, dataIndex: 'item_code'},
                {text: '품명', width: 180, dataIndex: 'item_name'},
                {text: '규격', width: 230, dataIndex: 'specification'},
                {text: '자재요청수량', width: 100, dataIndex: 'pr_quan'},
                {text: '묶음수량', width: 60, dataIndex: 'unit_mass'},
                {text: '소요량', width: 60, dataIndex: 'bm_quan'},
                {text: '본사', width: 80, dataIndex: 'quan_00'},
                {text: '정민테크', width: 80, dataIndex: 'quan_01'},
                {text: '용현테크', width: 80, dataIndex: 'quan_02'},
                {text: 'SMT사업부(KB텍)', width: 80, dataIndex: 'quan_03'},
                {text: '씨에스테크원', width: 80, dataIndex: 'quan_04'},
                {text: '제이와이테크', width: 80, dataIndex: 'quan_05'}
            ],
            title: '하위 자재 리스트',
            name: 'po',
            autoScroll: true,
            listeners: {
                edit: function (editor, e, eOpts) {

                    var columnName = e.field;
                    var tableName = 'cartmap';
                    var unique_id = e.record.getId();
                    var value = e.value;

                    switch(columnName) {
                        case 'static_sales_price':
                            columnName = 'sales_price';
                            break;
                        default:
                            break;
                    }

                    gm.editAjax(tableName, columnName, value, 'unique_id', unique_id, {type:''});
                }
            }
        });


        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
            /*groupHeaderTpl: '<div><font color=#003471>{name} :: <b>{[values.rows[0].data.pcs_name]} </b></font> ({rows.length} 공정)</div>'*/
            groupHeaderTpl: '<div><font color=#003471>{name} :: </font> 구매 ({rows.length})</div>'
        });

        var option = {
            features: [groupingFeature]
        };

        //grid 생성.
        this.createGridCore(arr, option);
        this.createCrudTab();

        this.grid.forceFit = true;

        Ext.apply(this, {
            layout: 'border',
            defaults: {
                collapsible: true,
                split: true
            },
            items: [
                {
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
                    width: '100%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '30%',
                        items: [this.grid]
                    }, this.gridPoList]
                }
            ]
        });


        //this.editAction.setText('주문작성');
        this.removeAction.setText('반려');


        // remove the items
        (buttonToolbar.items).each(function(item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });


        if (vCompanyReserved4 == 'DABP01KR') {

            this.setRawPoView = Ext.create('Ext.Action', {
                xtype: 'button',
                text: '원지',
                tooltip: '원지',
                //ctCls: 'x-toolbar-grey-btn',
                toggleGroup: 'poViewType',
                handler: function() {
                    gm.me().createAddPoAction.disable();
                    gm.me().createPoAction.enable();
                    gm.me().createInPoAction.enable();
                    gm.me().updateCartmapContract.enable();
                    gm.me().vSELECTED_UNIQUE_ID = '';
                    gm.me().poviewType = 'RAW';
                    gm.me().store.getProxy().setExtraParams({});
                    gm.me().store.getProxy().setExtraParam('sp_code', 'R');
                    gm.me().store.getProxy().setExtraParam('srch_filter', null);
                    gm.me().suplier_type = 'R';
                    gm.me().store.load(function() {});

                }
            });
            this.setMroPoView = Ext.create('Ext.Action', {
                xtype: 'button',
                text: '재공',
                tooltip: '재공',
                //ctCls: 'x-toolbar-grey-btn',
                toggleGroup: 'poViewType',
                handler: function() {
                    gm.me().createAddPoAction.disable();
                    gm.me().createPoAction.enable();
                    gm.me().updateCartmapContract.enable();
                    gm.me().vSELECTED_UNIQUE_ID = '';
                    gm.me().poviewType = 'PAPER';
                    gm.me().store.getProxy().setExtraParams({});
                    gm.me().store.getProxy().setExtraParam('standard_flag', 'B');
                    gm.me().store.getProxy().setExtraParam('srch_filter', null);
                    gm.me().suplier_type = 'Z';
                    gm.me().store.load(function() {});


                }
            });
        } else {

            this.setRawPoView = Ext.create('Ext.Action', {
                xtype: 'button',
                text: '원자재',
                tooltip: '원자재',
                //ctCls: 'x-toolbar-grey-btn',
                toggleGroup: 'poViewType',
                handler: function() {
                    gm.me().createAddPoAction.disable();
                    gm.me().createPoAction.enable();
                    gm.me().createInPoAction.enable();
                    gm.me().updateCartmapContract.enable();
                    gm.me().vSELECTED_UNIQUE_ID = '';
                    gm.me().poviewType = 'RAW';
                    gm.me().store.getProxy().setExtraParam('standard_flag', 'R');
                    gm.me().store.getProxy().setExtraParam('sp_code', '');
                    gm.me().store.getProxy().setExtraParam('storeType', '');
                    gm.me().store.load(function() {});

                }
            });
            this.setSubPoView = Ext.create('Ext.Action', {
                xtype: 'button',
                text: '공구류',
                tooltip: '공구류 주문',
                //ctCls: 'x-toolbar-grey-btn',
                toggleGroup: 'poViewType',
                handler: function() {
                    gm.me().createAddPoAction.disable();
                    gm.me().createPoAction.enable();
                    gm.me().updateCartmapContract.disable();
                    gm.me().vSELECTED_UNIQUE_ID = '';
                    gm.me().poviewType = 'SUB';
                    gm.me().store.getProxy().setExtraParam('standard_flag', 'K');
                    gm.me().store.getProxy().setExtraParam('storeType', '');
                    gm.me().store.getProxy().setExtraParam('sp_code', 'K1');
                    gm.me().store.load(function() {});

                }
            });
            this.setMroPoView = Ext.create('Ext.Action', {
                xtype: 'button',
                text: '기타 소모품',
                tooltip: '기타 소모품',
                //ctCls: 'x-toolbar-grey-btn',
                toggleGroup: 'poViewType',
                handler: function() {
                    gm.me().createAddPoAction.disable();
                    gm.me().createPoAction.enable();
                    gm.me().updateCartmapContract.enable();
                    gm.me().vSELECTED_UNIQUE_ID = '';
                    gm.me().poviewType = 'PAPER';
                    gm.me().store.getProxy().setExtraParam('standard_flag', 'K');
                    gm.me().store.getProxy().setExtraParam('storeType', '');
                    gm.me().store.getProxy().setExtraParam('sp_code', 'K3');
                    gm.me().store.load(function() {});


                }
            });

        }



        this.setAddPoView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '주문이력',
            tooltip: '주문 이력',
            multiSelect: false,
            //ctCls: 'x-toolbar-grey-btn',
            toggleGroup: 'poViewType',
            handler: function() {
                gm.me().poviewType = 'ADDPO';
                gm.me().vSELECTED_UNIQUE_ID = '';
                gm.me().store.getProxy().setExtraParam('standard_flag', '');
                gm.me().store.getProxy().setExtraParam('storeType', 'Y');
                gm.me().store.load(function() {});

            }
        });

        //주문작성 Action 생성
        this.createPoAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '주문 작성',
            tooltip: '주문 작성',
            disabled: true,
            handler: function() {

                //OR17060001
                var fullYear = gUtil.getFullYear() + '';
                var month = gUtil.getMonth() + '';
                if (month.length == 1) {
                    month = '0' + month;
                }

                var first = "OR" + fullYear.substring(2, 4) + month;
                console_logs('first', first);

                // 마지막 수주번호 가져오기
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastPono',
                    params: {
                        first: first,
                        codeLength: 4
                    },
                    success: function(result, request) {
                        var po_no = result.responseText;

                        gm.me().treatPo(po_no);

                    }, // endofsuccess
                    failure: extjsUtil.failureMessage
                }); // endofajax


            } //handler end...

        });

        //계약 갱신/
        this.updateCartmapContract = Ext.create('Ext.Action', {
            iconCls: 'fa-retweet_14_0_5395c4_none',
            text: '계약 갱신',
            tooltip: '계약 갱신',
            disabled: true,
            handler: function() {
                gm.me().treatCartmapContract();

            } //handler end...

        });

        //추가 주문작성 Action 생성
        this.createAddPoAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '복사 하기',
            tooltip: '복사 하기',
            disabled: true,
            handler: function() {

                var sp_code = gm.me().vSELECTED_SP_CODE;
                switch (sp_code) {
                    case 'R':
                        gm.me().purCopyAction();
                        break;
                    case 'O':
                        gm.me().purCopyAction();
                        break;
                    case 'K':
                        gm.me().purCopyAction();
                        break;
                    default:

                }

            } //handler end...

        });


		//buttonToolbar.insert(3, this.createPoAction);

        switch (vCompanyReserved4) {
            case 'KYNL01KR':
                break;
            case 'SKNH01KR':
             buttonToolbar.insert(3, this.createInPoAction);
                buttonToolbar.insert(6, this.updateCartmapContract);
                break;
            case 'DABP01KR':
                buttonToolbar.insert(3, this.createInPoAction);
                buttonToolbar.insert(6, this.setMisPoView);
                buttonToolbar.insert(6, this.setMroPoView);
                buttonToolbar.insert(6, this.setSubPoView);
                buttonToolbar.insert(6, this.setRawPoView);
                buttonToolbar.insert(6, this.setAllPoView);
                break;
            default:
           // buttonToolbar.insert(3, this.createInPoAction);
        }

        //결재사용인 경우 결재 경로 store 생성
        if(this.useRouting==true) {

            this.rtgapp_store = Ext.create('Mplm.store.RtgappStore', {});

        }

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
                gm.me().poCartListStore.getProxy().setExtraParam('srcahd_uid', selections[0].get('unique_id_long'));
                gm.me().poCartListStore.load();
            }
        })

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function(records) {
            console_logs('디폴트 데이터', records);

        });
    },
    items: [],
    poviewType: 'ALL',
    cartmap_uids: [],
    deleteClass: ['cartmap'],

    purCopyAction: function() {
        var uniqueId = gm.me().vSELECTED_PJ_UID;

        if (uniqueId.length < 0) {
            alert('선택된 데이터가 없습니다.');
        } else {

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/purchase/request.do?method=purcopycartmap',
                params: {
                    cartmapUids: this.cartmap_uids
                },

                success: function(result, request) {
                    gm.me().store.load();
                    Ext.Msg.alert('안내', '복사가 완료 되었습니다.', function() {});

                }, //endofsuccess
                failure: extjsUtil.failureMessage
            }); //endofajax
        } // end of if uniqueid
    },


    //사내발주 폼
    treatPaperAddInPoRoll: function() {
        var next = gUtil.getNextday(0);
        var arrExist = [];
        var arrCurrency = [];
        var arrTotalPrice = [];
        var selections = gm.me().grid.getSelectionModel().getSelection();

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
                        anchor: '100%',
                        /*id: 'stcok_pur_supplier_info',
                        name: 'stcok_pur_supplier_info',*/
                        id: 'in_supplier',
                        name: 'in_supplier',
                        value: '스카나코리아',
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
                        xtype: 'textfield',
                        rows: 4,
                        anchor: '100%',
                        id: 'reserved_varchar1',
                        name: 'reserved_varchar1',
                        value: '사내'
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

                    }
                ]
            }]
        })
        myHeight = 500;
        myWidth = 420;

        prwin = this.Inprwinopen(form);
    },

    treatCartmapContract: function() {
        var selections = gm.me().grid.getSelectionModel().getSelection();
        var uniqueId = gm.me().vSELECTED_UNIQUE_ID;
        if (uniqueId == undefined || uniqueId < 0) {
            Ext.Msg.alert("알림", "선택된 자재가 없습니다.");
        } else {

            var cartmapUids = [];
            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                cartmapUids.push(rec.get('id'));
            }

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/purchase/request.do?method=updateCartmapContract',
                params: {
                    unique_ids: cartmapUids
                },
                success: function(result, request) {

                    var result = result.responseText;
                    console_logs("success", result);
                    gm.me().store.load(function() {});

                },
                failure: extjsUtil.failureMessage
            });
        }

    },
    treatPo: function(po_no) {

        var selections = gm.me().grid.getSelectionModel().getSelection();
        var uniqueId = gm.me().vSELECTED_UNIQUE_ID;
        var next = gUtil.getNextday(0);
        var request_date = gm.me().request_date;


        if (uniqueId == undefined || uniqueId < 0) {
            Ext.Msg.alert("알림", "선택된 자재가 없습니다.");
        } else {

            var form = null;
            var pjArr = [];
            var supArr = [];
            var cartmapUids = [];
            var notDefinedSup = false;

            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                console_logs('rec', rec);
                var coord_key1 = rec.get('coord_key1');
                if (coord_key1 == undefined || coord_key1 == null || coord_key1 == '' || coord_key1 < 0) {
                    notDefinedSup = true;
                }
                pjArr.push(rec.get('pj_code'));
                supArr.push(coord_key1);
                cartmapUids.push(rec.get('id'));
            }

            //중복제거
            pjArr = gu.removeDupArray(pjArr);
            supArr = gu.removeDupArray(supArr);
            console_logs('pjArr', pjArr);
            console_logs('supArr', supArr);
            console_logs('cartmapUids', cartmapUids);

            if (pjArr.length > 1 && gm.me().canDupProject == false) {
                Ext.Msg.alert('알림', '같은 프로젝트를  선택해주세요.', function() {});
            } else if (supArr.length > 1 && gm.me().changeSupplier == false) {
                Ext.Msg.alert('알림', '같은 공급사를 지정해 주세요.', function() {});
            } else if (notDefinedSup == true && gm.me().changeSupplier == false) {
                Ext.Msg.alert('알림', '공급사를 지정하지 않은 항목이 있습니다. 먼저 계약 갱신을 실행하세요.', function() {});
            } else {
                var next = gUtil.getNextday(0);

                var total = 0;
                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];
                    var total_price = rec.get('total_price');
                    total = total + total_price;

                }
                
                //var route_type = selections[0].get('route_type');
                //
            	//if(route_type == null || route_type.length < 1) {
            	//	route_type = 'P';
            	//}

                var supplierStore = Ext.create('Mplm.store.SupastStore', {
                    supplierType: gm.me().suplier_type
                });

                var formItems = [{
                    xtype: 'fieldset',
                    title: '주문 내역',
                    collapsible: false,
                    width: '100%',
                    style: 'padding:10px',
                    //bodyStyle: 'padding:15px',
                    defaults: {
                        width: '100%',
                        //labelWidth: 89,
                        //anchor: '100%',
                        layout: {
                            type: 'hbox'//,
                            // defaultMargins: {
                            //     top: 10,
                            //     right: 10,
                            //     bottom: 10,
                            //     left: 10
                            // }
                        }
                    },
                    items: [{
                            fieldLabel: '프로젝트',
                            name:'pj_name',
                            xtype: 'textfield',
                            value: selections[0].get('pj_name'),
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            readOnly: true
                        },
                        {
                            fieldLabel: '합계금액',
                            name:'total_price',
                            xtype: 'textfield',
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            value: Ext.util.Format.number(total, '0,00/i') + ' ' + selections[0].get('cart_currency'),
                            readOnly: true
                        },
                        {
                            fieldLabel: '요약',
                            xtype: 'textfield',
                            name: 'item_abst',
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            value: selections[0].get('item_name') + '외 ' + Ext.util.Format.number(selections.length - 1, '0,00/i') + '건',
                            readOnly: true
                        },{
                            fieldLabel: '주문처',
                            xtype: 'combo',
                            id: gu.id('target_supplier'),
                            anchor: '100%',
                            name: 'coord_key1',
                            store: supplierStore,
                            displayField: 'supplier_name',
                            valueField: 'unique_id',
                            emptyText: '선택',
                            allowBlank: false,
                            sortInfo: {
                                field: 'create_date',
                                direction: 'DESC'
                            },
                            typeAhead: false,
                            readOnly : !(this.changeSupplier),
                            fieldStyle: (this.changeSupplier) ?
                                    'background-color: #fff; background-image: none;':
                                    'background-color: #ddd; background-image: none;'
                            ,
                            //hideLabel: true,
                            minChars: 1,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function() {
                                    return '<div data-qtip="{unique_id}">{supplier_name}|{supplier_code}</div>';
                                }
                            },
                            listeners: {
                                select: function(combo, record) {
                                    //    			            	        	   var reccode = record.get('area_code');
                                    coord_key1 = record.get('unique_id');
                                    //    			            	        	   Ext.getCmp('maker_code').setValue(reccode);
                                }
                            }
                        }, 
                        {
                            fieldLabel: '주문번호',
                            xtype: 'textfield',
                            rows: 4,
                            anchor: '100%',
                            name: 'po_no',
                            value: po_no
                        },
                        {
                            fieldLabel: '납품장소',
                            xtype: 'textfield',
                            rows: 4,
                            anchor: '100%',
                            name: 'reserved_varchar1',
                            value: '사내'
                        },
                        {
                            fieldLabel: '요청사항',
                            xtype: 'textarea',
                            rows: 4,
                            anchor: '100%',
                            name: 'reserved_varchar2'
                        }, {
                            fieldLabel: '결제 조건',
                            xtype: 'combo',
                            anchor: '100%',
                            name: 'pay_condition',
                            store: gm.me().payConditionStore,
                            displayField: 'codeName',
                            valueField: 'codeName',
                            emptyText: '선택',
                            allowBlank: true,
                            typeAhead: false,
                            minChars: 1,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function() {
                                    return '<div data-qtip="{systemCode}">{codeName}</div>';
                                }
                            },
                            listeners: {
                                select: function(combo, record) {}
                            }
                        },
                        new Ext.form.Hidden({
                            name: 'unique_uids',
                            value: cartmapUids
                        }),, new Ext.form.Hidden({
                            name: 'coord_key3',
                            value: selections[0].get('coord_key3')
                        }), new Ext.form.Hidden({
                            name: 'ac_uid',
                            value: selections[0].get('ac_uid')
                        }), new Ext.form.Hidden({
                            name: 'req_date',
                            value: selections[0].get('req_date')
                        }), new Ext.form.Hidden({
                            name: 'sales_price',
                            value: total
                        }), new Ext.form.Hidden({
                            name: 'route_type',
                            value: 'U'// selections[0].get('route_type')
                        })
                    ]
                }];

                var form = Ext.create('Ext.form.Panel', {
                    id: gu.id('formPanel'),
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
                    // defaults: {
                    //     layout: 'form',
                    //     xtype: 'container',
                    //     defaultType: 'textfield',
                    //     style: 'width: 100%'
                    // },
                    items: formItems
                })
                var myHeight = (this.useRouting==true) ? 630: 410;
                var myWidth = 600;

                var items = [form];
                if(this.useRouting==true) {
                    
                    this.rtgapp_store.load();
                    var userStore = Ext.create('Mplm.store.UserStore', {hasNull: false} );
                    var removeRtgapp = Ext.create('Ext.Action', {
                        itemId: 'removeRtgapp',
                        glyph: 'xf00d@FontAwesome',
                        text: CMD_DELETE,
                        disabled: true,
                        handler: function(widget, event) {
                            Ext.MessageBox.show({
                                title:delete_msg_title,
                                msg: delete_msg_content,
                                buttons: Ext.MessageBox.YESNO,
                                fn: gm.me().deleteRtgappConfirm,
                                // animateTarget: 'mb4',
                                icon: Ext.MessageBox.QUESTION
                            });
                        }
                    });

                    var updown =
                    {
                        text: '이동',
                        menuDisabled: true,
                        sortable: false,
                        xtype: 'actioncolumn',
                        width: 70,
                        align: 'center',
                        items: [{
                            icon   : 'http://hosu.io/web_content75' +  '/resources/follower/demo/resources/images/up.png',
                            tooltip: 'Up',
                            handler: function(agridV, rowIndex, colIndex) {
                                var record = gm.me().agrid.getStore().getAt(rowIndex);
                                console_log(record);
                                var unique_id = record.get('unique_id');
                                console_log(unique_id);
                                var direcition = -15;
                                Ext.Ajax.request({
                                     url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
                                     params:{
                                         direcition:direcition,
                                         unique_id:unique_id
                                     },
                                     success : function(result, request) {   
                                        gm.me().rtgapp_store.load(function() {});
                                     }
                                   });
                                    
                                }
                
                
                        },'-',
                        {
                            icon   : 'http://hosu.io/web_content75' +  '/resources/follower/demo/resources/images/down.png',
                            tooltip: 'Down',
                            handler: function(agridV, rowIndex, colIndex) {
                
                                var record = gm.me().agrid.getStore().getAt(rowIndex);
                                console_log(record);
                                var unique_id = record.get('unique_id');
                                console_log(unique_id);
                                var direcition = 15;
                                Ext.Ajax.request({
                                     url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
                                     params:{
                                         direcition:direcition,
                                         unique_id:unique_id
                                     },
                                     success : function(result, request) {   
                                         gm.me().rtgapp_store.load(function() {});
                                     }
                                   });
                            }
                
                        }]
                    };

                    var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );

                    this.agrid = Ext.create('Ext.grid.Panel', {
                        //title: '결재경로',
                        store: this.rtgapp_store,
                        border: true,
                        frame: true,
                        style: 'padding-left:10px;padding-right:10px;',
                        width: '100%',
                        //layout: 'fit',
                        scroll: true,                        
                        selModel: selModel,
                        columns : [
                            { dataIndex : 'seq_no', text : '순서', width:70,  sortable : false	}
                            ,{ dataIndex : 'user_id', text : '아이디',  sortable : false	}
                            ,{ dataIndex : 'user_name', text : '이름', flex : 1,  sortable : false	}
                            //,{ dataIndex : 'emp_no', text : '사번',  sortable : false	}
                            //,{ dataIndex : 'company_code', text : '회사 코드',  sortable : false	}
                            ,{ dataIndex : 'dept_name', text : '부서 명', width:90	,  sortable : false}
                           // ,{ dataIndex : 'dept_code', text : '부서 코드',  sortable : false	}
                            //,{ dataIndex : 'app_type', text : 'app_type',  sortable : false	}
                            ,{ dataIndex : 'gubun', text : '구분', width:50	,  sortable : false}
                            // ,{ dataIndex : 'unique_id', text : 'unique_id',  sortable : false	}
                            //,{ dataIndex : 'create_date', text : '생성일자',  sortable : false	}
                            ,updown
                        ],
                        border: false,
                        multiSelect: true,
                        frame: false ,
                        dockedItems: [{
                            xtype: 'toolbar',
                            cls: 'my-x-toolbar-default2',
                            items: [
                               {
                                    xtype:'label',
                                    labelWidth: 20,
                                    text: '결재 권한자 추가'//,
                                    //style: 'color:white;'
                    
                            },{
                                id :'user_name',
                                name : 'user_name',
                                xtype: 'combo',
                                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                                store: userStore,
                                labelSeparator: ':',
                                emptyText:   dbm1_name_input,
                                displayField:   'user_name',
                                valueField:   'unique_id',
                                sortInfo: { field: 'user_name', direction: 'ASC' },
                                typeAhead: false,
                                hideLabel: true,
                                minChars: 2,
                                width: 200,
                                listConfig:{
                                    loadingText: 'Searching...',
                                    emptyText: 'No matching posts found.',
                                    getInnerTpl: function() {
                                        return '<div data-qtip="{unique_id}">{user_name} {position} ({dept_name})</div>';
                                    }			                	
                                },
                                listeners: {
                                    select: function (combo, record) {
                                        console_logs('Selected combo : ', combo);
                                        console_logs('Selected record : ', record);
                                        console_logs('Selected Value : ', record.get('unique_id'));
                                        
                                        var unique_id = record.get('unique_id');
                                        var user_id = record.get('user_id');
                                        Ext.Ajax.request({
                                             url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=createRtgappDyna',
                                             params:{
                                                 useruid : unique_id,
                                                 userid : user_id
                                                 ,gubun    : 'D'
                                             },
                                             success : function(result, request) {   
                                                 var result = result.responseText;
                                                console_log('result:' + result);
                                                if(result == 'false'){
                                                    Ext.MessageBox.alert(error_msg_prompt, 'Dupliced User');
                                                }else{
                                                    gm.me().rtgapp_store.load(function() {});
                                                }
                                             },
                                             failure: extjsUtil.failureMessage
                                         });
                                    }// endofselect
                                }
                            },
                            '->',removeRtgapp
                            
                            ]// endofitems
                        }] // endofdockeditems 
                        
                    }); // endof Ext.create('Ext.grid.Panel',

                    this.agrid.getSelectionModel().on({
                        selectionchange: function(sm, selections) {
                            if (selections.length) {
                                removeRtgapp.enable();
                            } else {
                                removeRtgapp.disable();
                            }
                        }
                    });

                    items.push(this.agrid);
                }

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '주문 작성',
                    width: myWidth,
                    height: myHeight,
                    plain: true,
                    items: items,
                    buttons: [{
                        text: CMD_OK,
                        handler: function(btn) {

                            if (btn == "no") {
                                prWin.close();
                            } else {
                                if (form.isValid()) {
                                    var val = form.getValues(false);

                                    //결재사용인 경우 결재 경로 확인
                                    if(gm.me().useRouting==true) {

                                        var items = gm.me().rtgapp_store.data.items;
                                        console_logs('items.length', items.length);
                                        if(items.length < 2) {
                                            Ext.Msg.alert("알림", "결재자가 본인이외에 1인 이상 지정되야 합니다.");
                                            return;
                                        }
                                        
                                        var ahid_userlist = new Array();
                                        var ahid_userlist_role = new Array();

                                        for(var i=0; i<items.length; i++) {
                                            var rec = items[i];
                                            console_logs('items rec', rec);
                                            ahid_userlist.push(rec.get('usrast_unique_id'));
                                            ahid_userlist_role.push(rec.get('gubun'));
                                        }
                                        val['hid_userlist'] =  ahid_userlist;
                                        val['hid_userlist_role'] =  ahid_userlist_role;
                                    }
                                    console_logs('val', val);                                    
                                    form.submit({
                                        url: CONTEXT_PATH + '/purchase/request.do?method=createheavycontract&outPo=true',
                                        params: val,
                                        success: function(val, action) {
                                            prWin.close();
                                            gm.me().store.load(function() {});
                                        },
                                        failure: function(val, action) {

                                            prWin.close();
                                            gm.me().store.load(function() {});

                                        }
                                    });

                                } // end of formvalid 
                            } //else
                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function(btn) {
                            prWin.close();
                        }
                    }]
                });
                prWin.show(undefined, function(){
                    var combo = gu.getCmp('target_supplier');
                    console_logs('combo', combo);
                    var selections = gm.me().grid.getSelectionModel().getSelection();
                    if(selections==null || selections.length==0) {
                        return;
                    }
                    var rec = selections[0];
                    console_logs('rec', rec);
                    var supplier_uid = rec.get('coord_key1');
                    var supplier_name = rec.get('supplier_name');


                    if(combo!=null) { //공급사 자동선택
                        // combo.setValue(supplier_uid);
                        // var record = combo.findRecordByValue(val);
                        // if(record!=null) {
                        //     combo.select(record);
                        // }
                        combo.store.load(function(records) {
                            console_logs('combo.store.load records', records);

                            if(records!=null) {
                                  for (var i=0; i<records.length; i++){
                                    console_logs('obj', records[i]);

                                         var obj = records[i];
                                         try {
                                              if(obj.get(combo.valueField)==supplier_uid ) {
                                                  combo.select(obj);
                                              }
                                         } catch(e){}
                                  }
                            }//endofif

                          });


                    }//endof if(combo!=null) {
                });
            }

        }

    },
    treatInPo: function() {

        var uniqueId = gm.me().vSELECTED_UNIQUE_ID;

        var next = gUtil.getNextday(0);

        var request_date = gm.me().request_date;
        var pj_name = gm.me().vSELECTED_pj_name;
        var stock_qty_useful = gm.me().vSELECTED_STOCK_USEFUL;

        var form = null;

        if (uniqueId == undefined || uniqueId < 0) {
            Ext.Msg.alert("알림", "선택된 자재가 없습니다.");
        } else {
            if (stock_qty_useful == undefined || stock_qty_useful == "" || stock_qty_useful == null) {
                Ext.Msg.alert("알림", "가용재고가 없습니다. 확인해주세요.");
            } else {
                this.treatPaperAddInPoRoll();
            }
        }

    },

    editRedord: function(field, rec) {
        console_logs('====> edited field', field);
        console_logs('====> edited record', rec);

        switch (field) {
            case 'quan':
            case 'static_sales_price':
            case 'req_date':
            case 'cart_currency':
                this.updateDesinComment(rec);
                break;
        }
    },
    updateDesinComment: function(rec) {

        var child = rec.get('child');
        console_logs('child>>>', child);
        var quan = rec.get('quan');
        var static_sales_price = rec.get('static_sales_price');
        var req_date = rec.get('req_date');
        var cart_currency = rec.get('cart_currency');
        var unique_id = rec.get('unique_uid');
        console_logs('====> unique_id', unique_id);

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/request.do?method=updateCreatePo',
            params: {
                quan: quan,
                child: child,
                static_sales_price: static_sales_price,
                cart_currency: cart_currency,
                req_date: req_date,
                unique_id: unique_id
            },
            success: function(result, request) {

                var result = result.responseText;
                //console_logs("", result);

            },
            failure: extjsUtil.failureMessage
        });
    },


    calcAge: function(quan, sales_price) {
        return quan * sales_price;


    },
    getPrice: function(total_price) {
        console_logs('total_price++++++++', total_price);
        var uniqueId = gm.me().vSELECTED_PJ_UID;
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/request.do?method=updatePrice',
            params: {
                cartmapUids: this.cartmap_uids,
                total_price: total_price
            },

            success: function(result, request) {
                gm.me().store.load();
                //				Ext.Msg.alert('안내', '복사가 완료 되었습니다.', function() {});

            }, //endofsuccess
            failure: extjsUtil.failureMessage
        }); //endofajax
    },

    getTableName: function(field_name) {
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

    checkEqualPjNames: function(rec) {
        console_logs('rec+++++++++++++in check' + rec);
    },
    // 사내발주 submit
    Inprwinopen: function(form) {
        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '사내 발주',
            width: myWidth,

            height: myHeight,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function(btn) {
                    var msg = '사내 발주하시겠습니까?';
                    var myTitle = '주문 작성 확인';
                    Ext.MessageBox.show({
                        title: myTitle,
                        msg: msg,

                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function(btn) {

                            if (btn == "no") {
                                prWin.close();
                            } else {
                                var po_user_uid = gm.me().vSELECTED_po_user_uid;
                                var srcahdArr = [];
                                var cartmapArr = [];
                                var nameArr = [];
                                var priceArr = [];
                                var curArr = [];
                                var quanArr = [];
                                var coordArr = [];
                                var selections = gm.me().grid.getSelectionModel().getSelection();
                                for (var i = 0; i < selections.length; i++) {
                                    var rec = selections[i];

                                    var uid = rec.get('id');
                                    var srcahd_uid = rec.get('unique_id');
                                    var coord_key3 = rec.get('coord_key3');
                                    var currency = rec.get('cart_currency');
                                    var item_name = rec.get('item_name');
                                    var static_sales_price = rec.get('static_sales_price');
                                    var request_info = rec.get('request_info');
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
                                var static_sales_price = rec.get('static_sales_price'); //cartmap.sales_price

                                if (form.isValid()) {
                                    var val = form.getValues(false);

                                    console_logs('val', val);

                                    form.submit({
                                        url: CONTEXT_PATH + '/purchase/request.do?method=createGo',
                                        params: {
                                            sancType: 'YES',
                                            reserved_varchar2: reserved_varchar2,
                                            reserved_varchar1: reserved_varchar1,
                                            item_name: item_name,
                                            cartmaparr: cartmapArr,
                                            srcahdarr: srcahdArr,
                                            quans: quanArr,
                                            currencies: curArr,
                                            names: nameArr,
                                            coord_key3s: coordArr,
                                            sales_prices: priceArr,
                                            pj_name: pj_name,
                                            mp_status: 'GR'
                                        },
                                        success: function(val, action) {
                                            prWin.close();
                                            Ext.Msg.alert('안내', '발주 완료 되었습니다.', function() {});
                                            gm.me().store.load(function() {});

                                            //this.store.load();
                                            //gm.me().store.load();
                                        },
                                        failure: function(val, action) {

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
                handler: function() {
                    if (prWin) {

                        prWin.close();

                    }
                }
            }]
        });
        prWin.show();
    },

    rtgapp_store: null,
    //결재조건
    payConditionStore: Ext.create('Mplm.store.PayConditionStore', {
        hasNull: false
    }),

    deleteRtgappConfirm: function (result){
        console_logs('result', result)
        var selections = gm.me().agrid.getSelectionModel().getSelection();
        if (selections) {
            //var result = MessageBox.msg('{0}', btn);
            if(result=='yes') {

                for(var i=0; i< selections.length; i++) {
                    var rec = selections[i];
                    var user_id = rec.get('user_id');
                    
                    if(user_id==vCUR_USER_ID) {
                        Ext.Msg.alert('안내', '본인은 결재경로에서 삭제할 수 없습니다.', function() {});
                        return;
                    }
                }

                for(var i=0; i< selections.length; i++) {
                    var rec = selections[i];
                    var unique_id = rec.get('unique_id');
                    
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=destroyRtgapp',
                            params: {
                                unique_id: unique_id
                            },
                            success: function(result, request) {
                                gm.me().agrid.store.load();
                            }, // endofsuccess
                            failure: extjsUtil.failureMessage
                        }); // endofajax
                }
                gm.me().agrid.store.remove(selections);
            }
        }
    },

    // 공급사 유형 필터
    suplier_type: (vCompanyReserved4 == 'KWLM01KR') ? null : 'R',

    //프로젝트 중복 혀용 여부
    canDupProject: (vCompanyReserved4 == 'DABP01KR') ? true : false,

    //주문시 공급사 지정
    changeSupplier:  (vCompanyReserved4 == 'SKNH01KR') ? false : true,

    //결재 기능 사용
    useRouting:  (vCompanyReserved4 == 'DABP01KR') ? true : false

});