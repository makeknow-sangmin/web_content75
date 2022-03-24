/**
 * --------- flag
 * 1 : 입고작업을 수입검사 이후에 작업함
 * 2 : none
 * 3 : none
 * 4 : none
 * 5 : none
 */

Ext.require([
    'Ext.ux.CustomSpinner'
]);
Ext.define('Rfx2.view.purStock.WearingWaitView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'wearing-wait-view',
    initComponent: function () {

        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;

        //검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField('po_group_uid');
        this.addSearchField('po_no');
        this.addSearchField('item_code');
        this.addSearchField('seller_name');
        this.addSearchField('item_name');

        Ext.each(this.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            console_logs('===>>>>>dataIndex', dataIndex);
            // console_logs('===columnObj', columnObj);
            var qty = 0;
            switch (dataIndex) {
                case 'sales_price':
                    columnObj["css"] = 'edit-cell';
                    columnObj["editor"] = {
                        xtype: 'customspinner',
                        step: 1
                    };
                    columnObj["renderer"] = function (value, meta) {
                        meta.css = 'custom-column';

                        return Ext.util.Format.number(value, '0,00.#####');
                    }
                    break;
                case 'curGr_qty':
                case 'sales_amount':
                    columnObj["css"] = 'edit-cell';
                    columnObj["editor"] = {
                        xtype: 'numberfield'
                    };
                    columnObj["renderer"] = function (value, meta) {
                        meta.css = 'custom-column';

                        return Ext.util.Format.number(value, '0,00.#####');
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

        var buttonToolbar3 = Ext.create('widget.toolbar', {
            // style: 'background-color: #000069;',
            items: [{
                xtype: 'tbfill'
            }, {
                xtype: 'label',
                id: gu.id('total_price'),
                style: 'color: #FFFFFF; font-weight: bold; font-size: 15px; margin: 5px;',
                //style: 'color: yellow; font-size: 15px; margin: 5px;',
                text: '총 입고금액 : '
            }]
        });

        Ext.each(this.columns, function (columnObj, index) {
            var o = columnObj;
            var dataIndex = o['dataIndex'];
            switch (dataIndex) {
                case 'stock_qty_safe':
                case 'totalPrice':
                    o['summaryRenderer'] = function (value, summaryData, dataIndex) {
                        if (gm.me().store.data.items.length > 0) {
                            var summary = gm.me().store.data.items[0].get('summary');
                            if (summary.length > 0) {
                                var objSummary = Ext.decode(summary);
                                return Ext.util.Format.number(objSummary[dataIndex], '0,00/i');
                            } else {
                                return 0;
                            }
                        } else {
                            return 0;
                        }
                    };
                    break;
                default:
                    break;
            }
        });

        this.createStoreSimple({
            modelClass: 'Rfx.model.Heavy4WearingWait',
            sorters: [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            pageSize: gm.pageSize, /*pageSize*/
        }, {
            groupField: 'po_no',
            groupDir: 'DESC'
        });

        for (var i = 0; i < this.columns.length; i++) {
            var o = this.columns[i];
            //console_logs('this.columns' + i, o);
            var dataIndex = o['dataIndex'];
            switch (dataIndex) {
                case 'gr_qty':
                case 'notGr_qty':
                case 'curGr_qty':
                case 'sales_price':
                case 'total_price':
                    o['summaryType'] = 'sum';
                    o['summaryRenderer'] = function (value, summaryData, dataIndex) {
                        value = Ext.util.Format.number(value, '0,00.##/i');
                        value = '<font style="font-weight: bold; font-size:10pt; color:#000000;">' + value + '</font>'
                        return value;
                    };
                    break;
                default:
                    break;
            }

        }

        //그리드 생성
        var arr = [];
        arr.push(buttonToolbar);


        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        arr.push(searchToolbar);
        arr.push(buttonToolbar3);


        var option = {
            // features: {
            //     ftype: 'groupingsummary',
            //     groupHeaderTpl: '<div>주문번호 :: <font color=#003471><b>{[values.rows[0].data.po_no]}</b></font> ({rows.length})</div>'
            // }
        };


        console_logs('=>push', arr);

        //grid 생성.
        this.createGridCore(arr, option);

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
        this.setMROView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: 'MRO',
            tooltip: 'MRO',
            toggleGroup: 'matType',
            handler: function () {
                this.matType = 'SUB';
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'M');
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
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5
            ) {
                buttonToolbar.items.remove(item);
            }
        });

        buttonToolbar.insert(5, '-');

        //버튼 추가.
        buttonToolbar.insert(5, this.setUsedMatView);
        buttonToolbar.insert(5, this.setMROView);
        buttonToolbar.insert(5, this.setSubMatView);
        buttonToolbar.insert(5, this.setSaMatView);
        buttonToolbar.insert(5, this.setAllMatView)
        buttonToolbar.insert(5, this.setAllGrView);

        //입고 확인 Action 생성
        this.createGoAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '입고 확인',
            tooltip: '입고 확인',
            disabled: true,
            handler: function () {
                gm.me().treatGr();
            }
        });

        //입고 마감 Action 생성
        this.closeGoAction = Ext.create('Ext.Action', {
            iconCls: 'dabp-close',
            text: '입고 마감',
            tooltip: '입고 마감',
            disabled: true,
            handler: function () {
                gm.me().treatCloseGr();
            }
        });

        buttonToolbar.insert(1, '-');
        buttonToolbar.insert(1, this.closeGoAction);
        buttonToolbar.insert(1, this.createGoAction);

        this.callParent(arguments);

        this.grid.getSelectionModel().on({
            selectionchange: function (sm, selections) {

            }
        });

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {

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
                gm.me().cartmapuids = this.cartmap_uids;
                gm.me().gr_qtys = this.gr_qtys;
                console_logs('gm.me().cartmapuids>>>>>>>>>>>', gm.me().cartmapuids);
                gm.me().cartmapuid = rec.get('id');
                gm.me().gr_qty = rec.get('curGr_qty');
                gm.me().item_name = rec.get('item_name');
                gm.me().vSELECTED_description = rec.get('description');   // 평량
                gm.me().vSELECTED_remark = rec.get('remark');    // 장
                gm.me().vSELECTED_comment = rec.get('comment1');   // 폭
                gm.me().vSELECTED_quan = rec.get('po_qty');
                gm.me().vSELECTED_spcode = rec.get('sp_code');

                console_logs('그리드 데이터', rec);
                gm.me().closeGoAction.enable();
                gm.me().createGoAction.enable();
            } else {
                gm.me().vSELECTED_UNIQUE_ID = -1;
                gm.me().closeGoAction.disable();
                gm.me().createGoAction.disable();
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
                    //gm.me().buttonToolbar3.items.items[1].update('총 금액 : ' + gu.renderNumber(rec.get(field) * selection[0].get('sales_price')) + ' / 총 수량 : ' + rec.get(field));
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

                    //gm.me().buttonToolbar3.items.items[1].update('총 금액 : ' + gu.renderNumber(rec.get(field) * selection[0].get('curGr_qty')) + ' / 총 수량 : ' + rec.get('curGr_qty'));
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
        gm.setCenterLoading(false);

        this.store.getProxy().setExtraParam('po_types', 'MN,P,OU');

        if (this.flag1 === 'Y') {
            this.store.getProxy().setExtraParam('is_test', 'Y');
        }

        this.store.load(function (records) {
            console_logs('>>>>>>>>>********records', records);

            var total_price_sum = 0;
            var total_qty = 0;

            for (var i = 0; i < gm.me().store.data.items.length; i++) {
                var t_rec = gm.me().store.data.items[i];
                total_price_sum += t_rec.get('sales_amount');
                total_qty += t_rec.get('curGr_qty');
            }

            buttonToolbar3.items.items[1].update('총 입고금액 : ' + gu.renderNumber(total_price_sum));
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

    treatCloseGr: function () {
        Ext.MessageBox.show({
            title: '마감',
            msg: '해당 주문의 입고를 마감하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn: function (btn) {
                if (btn == 'yes') {

                    var xpoastUids = [];

                    var selections = gm.me().grid.getSelectionModel().getSelection();

                    for (var i = 0; i < selections.length; i++) {
                        xpoastUids.push(selections[i].get('unique_id_long'));
                    }

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/quality/wgrast.do?method=closeGr',
                        params: {
                            xpoastUids: xpoastUids
                        },
                        success: function () {
                            Ext.Msg.alert('알림', '입고 마감이 완료 되었습니다.');
                            gm.me().store.load();
                        },
                        failure: function () {
                            Ext.Msg.alert('알림', '입고 마감이 실패 되었습니다.');
                        }
                    });
                }
            },
            icon: Ext.MessageBox.QUESTION
        });
    },

    treatGr: function () {

        var whouseStore = Ext.create('Rfx2.store.company.bioprotech.WarehouseStore', {});

        //셀렉션붙임 시작
        var selections = gm.me().grid.getSelectionModel().getSelection();

        if(vCompanyReserved4 !== 'CHMR01KR') {
            if (selections.length > 1) {
                Ext.Msg.alert('경고', '한개의 자재를 선택하시기 바랍니다.');
                return;
            }
        }

        var rec = selections[0];
        var cartmapUid = rec.get('unique_id_long');
        var item_name = rec.get('item_name');
        var grQuan = rec.get('curGr_qty');
        var finance_rate = rec.get('finance_rate');

        //var countPlus = 0;

        //셀렉션 붙임 끝

        var boxPacking = null;

        var printQuan = null;
        var whouse_uid = -1;
        if (vCompanyReserved4 == 'CHMR01KR') {
            whouse_uid = 101;
        }

        if (vCompanyReserved4 === 'CHMR01KR') {
            var form = Ext.create('Ext.form.Panel', {
                xtype: 'form',
                frame: false,
                border: false,
                bodyPadding: 10,
                region: 'center',
                layout: 'column',
                autoScroll: true,
                fieldDefaults: {
                    margin: '3 3 3 3',
                    width: 350,
                    labelAlign: 'right',
                    msgTarget: 'side'
                },
                items: [
                    {
                        fieldLabel: '입고 날짜',
                        xtype: 'datefield',
                        name: 'gr_date',
                        id: gu.id('grDate'),
                        format: 'Y-m-d',
                        value: new Date()
                    },
                    {
                        fieldLabel: '창고명',
                        name: 'whouse_code',
                        xtype: 'combo',
                        displayField: 'wh_name',
                        valueField: 'unique_id_long',
                        editable: false,
                        allowBlank: true,
                        autoWidth: true,
                        id: gu.id('whouseUid'),
                        store: whouseStore,
                        value: whouse_uid,
                        listConfig: {
                            loadingText: 'Searching...',
                            emptyText: 'No matching posts found.',
                            getInnerTpl: function () {
                                return '<div data-qtip="{wh_code}">[{wh_code}] {wh_name}</div>';
                            }
                        },
                        listeners: {
                            select: function (combo, record) {
                            }//endofselect
                        }
                    },
                    {
                        fieldLabel: '비고',
                        xtype: 'textarea',
                        rows: 2,
                        name: 'gr_reason',
                        id: gu.id('grReason'),
                        fieldStyle: 'min-height: 40px !important',
                        emptyText: '비고를 입력해주세요.'
                    },
                ]
            }
            );
        } else {
            var form = Ext.create('Ext.form.Panel', {
                xtype: 'form',
                frame: false,
                border: false,
                bodyPadding: 10,
                region: 'center',
                layout: 'column',
                autoScroll: true,
                fieldDefaults: {
                    margin: '3 3 3 3',
                    width: 350,
                    labelAlign: 'right',
                    msgTarget: 'side'
                },
                items: [
                   
                    {
                        fieldLabel: '입고 날짜',
                        xtype: 'datefield',
                        name: 'gr_date',
                        id: gu.id('grDate'),
                        format: 'Y-m-d',
                        value: new Date()
                    },
                    {
                        fieldLabel: '창고명',
                        name: 'whouse_code',
                        xtype: 'combo',
                        displayField: 'wh_name',
                        valueField: 'unique_id_long',
                        editable: false,
                        allowBlank: true,
                        autoWidth: true,
                        id: gu.id('whouseUid'),
                        store: whouseStore,
                        value: whouse_uid,
                        listConfig: {
                            loadingText: 'Searching...',
                            emptyText: 'No matching posts found.',
                            getInnerTpl: function () {
                                return '<div data-qtip="{wh_code}">[{wh_code}] {wh_name}</div>';
                            }
                        },
                        listeners: {
                            select: function (combo, record) {
                            }//endofselect
                        }
                    },
                    
                ]
            }
            );
        }


        var etc_grid = Ext.create('Ext.grid.Panel', {

            store: new Ext.data.Store(),
            cls: 'rfx-panel',
            id: gu.id('etc_grid'),
            collapsible: false,
            multiSelect: false,
            width: 750,
            height: 500,
            autoScroll: true,
            margin: '0 0 20 0',
            autoHeight: true,
            frame: false,
            border: true,
            layout: 'fit',
            forceFit: true,
            viewConfig: {
                markDirty: false
            },
            columns: [
                {
                    text: 'LOT 번호',
                    width: '30%',
                    style: 'text-align:center',
                    dataIndex: 'input_lot',
                    name: 'input_lot',
                    editor: 'textfield',
                    sortable: false
                },
                {
                    text: '포장단위',
                    width: '20%',
                    dataIndex: 'packing',
                    editor: 'numberfield',
                    style: 'text-align:center',
                    align: 'right',
                    value: boxPacking,
                    listeners: {},
                    renderer: function (value) {
                        boxPacking = value;
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                    sortable: false
                },
                {
                    text: '박스 수량',
                    width: '20%',
                    dataIndex: 'each',
                    editor: 'numberfield',
                    sortable: false,
                    style: 'text-align:center',
                    align: 'right',
                    value: printQuan,
                    renderer: function (value) {
                        printQuan = value;
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: '자재 총 수량  ',
                    width: '30%',
                    dataIndex: 'totalQuan',
                    style: 'text-align:center',
                    align: 'right',
                    sortable: false,
                    renderer: function (val, meta, record, rowIndex) {
                        gm.me().setQuanBoxValue();
                        return Ext.util.Format.number(record.get('packing') * record.get('each'), '0,00/i');
                    }
                }
            ],
            selModel: 'cellmodel',
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2
            },
            listeners: {},
            autoScroll: true,
            dockedItems: [

                Ext.create('widget.toolbar', {
                    plugins: {
                        boxreorderer: false
                    },
                    cls: 'my-x-toolbar-default2',
                    margin: '0 0 0 0',
                    items: [

                        {
                            xtype: 'textfield',
                            name: 'item_name',
                            fieldLabel: '품명',
                            margin: '0 7 0 7',
                            editable: false,
                            labelWidth: 70,
                            width: 400,
                            allowBlank: false,
                            value: item_name,
                        },
                        // {
                        //     text: '+',
                        //     listeners: [{
                        //         click: function () {
                        //
                        //             var store = gu.getCmp('etc_grid').getStore();
                        //             var getCount = store.getCount();
                        //
                        //             console_logs('item index >> ', getCount);
                        //
                        //
                        //             store.insert(getCount, new Ext.data.Record({
                        //                 'packing': store.getAt(getCount - 1).get('packing'),
                        //                 'each': 1,
                        //                 'multiple': grQuan,
                        //                 'totalQuan': grQuan * 1
                        //             }));
                        //         }
                        //     }]
                        // },
                        // {
                        //     text: '-',
                        //     listeners: [{
                        //         click: function () {
                        //             var record = gu.getCmp('etc_grid').getSelectionModel().getSelected().items[0];
                        //             gu.getCmp('etc_grid').getStore().removeAt(gu.getCmp('etc_grid').getStore().indexOf(record));
                        //             gm.me().setQuanBoxValue();
                        //         }
                        //     }]
                        // },
                        '->',
                        {
                            xtype: 'component',
                            html: '총 입고예정: ' + Ext.util.Format.number(grQuan, '0,00/i')
                        },
                        // '-',
                        // {
                        //     xtype: 'component',
                        //     html: '포장단위: ' + Ext.util.Format.number(finance_rate, '0,00/i')
                        // }

                    ]
                }),
                form,

                // Ext.create('widget.toolbar', {
                //     plugins: {
                //         boxreorderer: false
                //     },
                //     cls: 'my-x-toolbar-default2',
                //     margin: '0 0 0 0',
                //     padding: '10 10 10 10',
                //     layout: {
                //         type: 'hbox',
                //         pack: 'end'
                //     },
                //     items: [
                //         {
                //             xtype: 'component',
                //             id: gu.id('totalQuanSum'),
                //             html: '총 입고수량: ' + Ext.util.Format.number(0, '0,00/i') + ' / ' +
                //             '총 박스수량: ' + Ext.util.Format.number(0, '0,00/i')
                //         }
                //
                //     ]
                // })

            ]
        });

        // var comboPrinter = gu.getCmp('printer');
        // comboPrinter.store.load(
        //     function () {
        //         this.each(function (record) {
        //             var system_code = record.get('system_code');
        //             if (system_code == '192.168.20.12') {
        //                 comboPrinter.select(record);
        //             }
        //         });
        //     }
        // );
        //
        // var comboLabel = gu.getCmp('print_label');
        // comboLabel.store.load(
        //     function () {
        //         this.each(function (record) {
        //             var system_code = record.get('system_code');
        //             if (system_code == 'L100x80') {
        //                 comboLabel.select(record);
        //             }
        //         });
        //     }
        // );

        var comboWhouse = gu.getCmp('whouseUid');
        comboWhouse.store.load(
            function () {
                this.each(function (record) {
                    var wh_code = record.get('wh_code');
                    if (wh_code == 'WH200') {
                        comboWhouse.select(record);
                    }
                });
            }
        );

        console_logs('finance_rate', finance_rate);
        if (finance_rate == 0 || finance_rate == 1 || finance_rate < 0) {
            gu.getCmp('etc_grid').getStore().insert(0, new Ext.data.Record({
                'each': 1, 'packing': grQuan, 'multiple': grQuan, 'totalQuan': grQuan
            }));
        } else {

            var divNum = parseInt(grQuan / finance_rate); //몫
            var resNum = grQuan - divNum * finance_rate;
            console_logs('grQuan', grQuan);
            console_logs('divNum', divNum);
            console_logs('resNum', resNum);
            if (divNum > 0) {
                gu.getCmp('etc_grid').getStore().insert(0, new Ext.data.Record({
                    'each': divNum,
                    'packing': finance_rate,
                    'multiple': divNum * finance_rate,
                    'totalQuan': divNum * finance_rate
                }));
            }


            if (resNum > 0) {
                gu.getCmp('etc_grid').getStore().insert(1, new Ext.data.Record({
                    'each': 1,
                    'packing': resNum,
                    'multiple': grQuan - (divNum * finance_rate),
                    'totalQuan': grQuan - (divNum * finance_rate)
                }));
            }
        }

        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '입고확인',
            width: 400,
            height: 210,
            plain: true,
            items: /*etc_grid,*/form,
            /*overflowY: 'scroll',*/
            buttons: [{
                text: '입고확인',

                handler: function (btn) {

                    prWin.setLoading(true);

                    var quanArray = []; //포장수량 배열
                    var lotArray = []; //로트 배열
                    var printQuanArray = [];   //출력 매수 배열

                    var rec = gm.me().grid.getSelectionModel().getSelection()[0];

                    quanArray.push(rec.get('curGr_qty'));
                    lotArray.push(null);
                    printQuanArray.push(1);

                    if (btn == 'no') {
                        prWin.close();

                    } else {
                        if(vCompanyReserved4 === 'CHMR01KR') {
                            var isGr = true;
                            var cartmapUids = [];
                            quanArray = [];

                            var selection_multi = gm.me().grid.getSelectionModel().getSelection();
                            for(var i = 0; i < selection_multi.length; i++) {
                                var recc = selection_multi[i];
                                cartmapUids.push(recc.get('unique_id_long'));
                                quanArray.push(recc.get('curGr_qty'));
                                if(recc.get('curGr_qty') == 0) {
                                    Ext.MessageBox.alert('알림','입고수량이 0인 항목이 있습니다.<br> 다시 확인해주세요.');
                                    isGr = false;
                                    break;
                                }
                            }
                            if(isGr === true) {
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/quality/wgrast.do?method=createGrMultiVersion',
                                    params: {
                                        cartmapUids : cartmapUids,
                                        grReason: gu.getCmp('grReason').getValue(),
                                        grDate: gu.getCmp('grDate').getValue(),
                                        whouseUid: gu.getCmp('whouseUid').getValue(),
                                        quanArray: quanArray,
                                        lotArray: lotArray,
                                        printQuanArray: printQuanArray
                                    },
                                    success: function () {
                                        //Ext.Msg.alert('알림', '입고가 완료 되었습니다.');
                                        gm.me().store.load();
        
                                        if (prWin) {
                                            prWin.close();
                                        }
                                    },
                                    failure: function () {
                                        if (prWin) {
                                            prWin.close();
                                        }
                                    }
                                });
                            } else {
                                prWin.setLoading(false);
                                if (prWin) {
                                    prWin.close();
                                }
                            }

                        } else {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/quality/wgrast.do?method=createGrIndividual',
                                params: {
                                    cartmapUid: cartmapUid,
                                    // grReason: gu.getCmp('grReason').getValue(),
                                    grDate: gu.getCmp('grDate').getValue(),
                                    whouseUid: gu.getCmp('whouseUid').getValue(),
                                    quanArray: quanArray,
                                    lotArray: lotArray,
                                    printQuanArray: printQuanArray
                                },
                                success: function () {
                                    //Ext.Msg.alert('알림', '입고가 완료 되었습니다.');
                                    gm.me().store.load();
    
                                    if (prWin) {
                                        prWin.close();
                                    }
                                },
                                failure: function () {
                                    if (prWin) {
                                        prWin.close();
                                    }
                                }
                            });
                        }
                        
                    }
                }
            },
            {
                text: '취소',
                handler: function () {
                    if (prWin) {
                        prWin.close();
                    }
                }
            }]
        });
        prWin.show();
    },

    setQuanBoxValue: function () {

        var totalQuanSum = gu.getCmp('totalQuanSum');

        var store = gu.getCmp('etc_grid').getStore();

        var sumQuan = 0;
        var sumBox = 0;

        for (var i = 0; i < store.getCount(); i++) {
            var packing = store.getAt(i).get('packing');
            var each = store.getAt(i).get('each');

            sumQuan += packing * each;
            sumBox += each;
        }

        totalQuanSum.setHtml('총 입고수량: ' + Ext.util.Format.number(sumQuan, '0,00/i') + ' / ' +
            '총 박스수량: ' + Ext.util.Format.number(sumBox, '0,00/i'));

    },

    selCheckOnly: false,
    selAllowDeselect: true,
    nextRow: false

});
