//자재 관리
Ext.define('Rfx2.view.gongbang.purStock.CreateSimplePoView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'create-simple-po-view',

    initComponent: function () {
        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.setDefComboValue('standard_flag', 'valueField', 'R');

        if(this.flag1 === 'Y'){
            this.addSearchField('item_name');
        }else{
            this.addSearchField('item_name');
            this.addSearchField('specification');
        }

        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');

        //명령툴바 생성
        let buttonToolbar = this.createCommandToolbar();

        //부자재 선택시 구분(sg_code) disabled로 이벤트처리
        this.addCallback('STANDARD_FLAG', function (o) {
            console_logs('addCallback>>>>>>>>>', o);
        });

        this.createStore('Rfx2.model.company.gongbang.CreateSimplePo', [{
                property: 'item_code',
                direction: 'DESC'
            }],
            gm.pageSize, {
                item_code_dash: 's.item_code',
                comment: 's.comment1'
            },
            ['srcahd']
        );

        let arr = [];
        arr.push(buttonToolbar);

        //검색툴바 생성
        let searchToolbar = this.createSearchToolbar();

        arr.push(searchToolbar);

        let myCartModel = Ext.create('Rfx.model.MyCartLineSrcahd', {
            fields: this.fields
        });

        this.myCartStore = new Ext.data.Store({
            pageSize: 100,
            model: myCartModel,
            sorters: [{
                property: 'create_date',
                direction: 'desc'
            }

            ]
        });

        //grid 생성.
        this.createGrid(arr);

        // remove the items
        (buttonToolbar.items).each(function (item, index) {
            if (index === 1 || index === 2 || index === 3 || index === 4 || index === 5) {
                buttonToolbar.items.remove(item);
            }
        });

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.myCartStore.load(function () {
        });

        this.addMyCart = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'fa-cart-arrow-down_14_0_5395c4_none',
            text: '구매 목록 추가',
            tooltip: '구매를 위한 목록에 추가',
            disabled: true,
            handler: function () {
                let my_child = [];
                let my_item_code = [];

                let selections = gm.me().grid.getSelectionModel().getSelection();

                for (let i = 0; i < selections.length; i++) {
                    let rec = selections[i];
                    let unique_id = rec.get('unique_id');
                    let item_code = rec.get('item_code');

                    my_child.push(unique_id);
                    my_item_code.push(item_code);
                }

                if (my_child.length > 0) {

                    gm.me().grid.setLoading(true);

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/purchase/request.do?method=addMyCart',
                        params: {
                            childs: my_child,
                            srcahd_uids: my_child,
                            item_codes: my_item_code
                        },
                        success: function () {
                            gm.me().grid.setLoading(false);
                            gm.me().myCartStore.load(function () {
                                gm.me().lStore.load();
                            });
                        }
                    }); //end of ajax
                } else {

                }
            }
        });

        //버튼 추가.
        buttonToolbar.insert(1, this.addMyCart);
        buttonToolbar.insert(1, '-');

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                let rec = selections[0];
                gm.me().vSELECTED_UNIQUE_ID = rec.get('unique_id');
                gm.me().addMyCart.enable();
            } else {
                gm.me().addMyCart.disable();
            }
        })

        //디폴트 로드
        gm.setCenterLoading(false);

        this.lStore = Ext.create('Rfx2.store.MyCartStore');

        let cellEditing = new Ext.grid.plugin.CellEditing({clicksToEdit: 2});

        this.createPoAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'fa-cart-arrow-down_14_0_5395c4_none',
            text: '주문작성',
            tooltip: '주문작성 하기',
            disabled: true,
            handler: function () {

                let fullYear = gUtil.getFullYear() + '';
                let month = gUtil.getMonth() + '';
                if (month.length === 1) {
                    month = '0' + month;
                }

                let first = "OR" + fullYear.substring(2, 4) + month;
                console_logs('first', first);

                // 마지막 수주번호 가져오기
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastPono',
                    params: {
                        first: first,
                        codeLength: 4
                    },
                    success: function (result) {
                        let po_no = result.responseText;
                        gm.me().treatPo(po_no);
                    },// endofsuccess
                    failure: extjsUtil.failureMessage
                });// endofajax
            }
        });

        this.removeCartAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: '목록에서 삭제',
            tooltip: '목록에서 삭제',
            disabled: true,
            handler: function () {

                let selections = gm.me().lGrid.getSelectionModel().getSelection();
                let arr = [];

                for (let i = 0; i < selections.length; i++) {
                    arr.push(selections[i].get('unique_id_long'));
                }

                Ext.MessageBox.show({
                    title: CMD_DELETE,
                    msg: gm.me().getMC('vst1_delete', '선택한 항목을 삭제하시겠습니까?'),
                    buttons: Ext.MessageBox.YESNO,
                    fn: function() {
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/index/generalData.do?method=delete',
                            params: {
                                DELETE_CLASS: 'MYCART',
                                uids: arr,
                                menuCode: 'PPO1_SUB'
                            },
                            method: 'POST',
                            success: function () {
                                gm.me().lGrid.getStore().load();
                            },
                            failure: function () {
                                Ext.Msg.alert('안내', '삭제에 실패하였습니다.', function () {
                                });
                            }
                        });
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.lGrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('lGrid'),
            store: this.lStore,
            viewConfig: {
                markDirty: false
            },
            collapsible: false,
            multiSelect: true,
            region: 'center',
            border: true,
            frame: true,
            title: '구매 예정 목록',
            resizable: false,
            scroll: true,
            layout: 'fit',
            forceFit: false,
            dockedItems: {
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default3',
                items: [
                    this.createPoAction,
                    this.removeCartAction
                ]
            },
            selModel: Ext.create("Ext.selection.CheckboxModel", {mode: 'multi'}),
            plugins: [cellEditing],
            listeners: {
                edit: function (editor, e) {

                    let params = {};

                    params['tableName'] = 'mycart';
                    params['setField'] = e.field;
                    params['setValue'] = e.value;
                    params['whereField'] = 'unique_id';
                    params['whereValue'] = e.record.get('unique_id_long');

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/index/generalData.do?method=updateGeneralOne',
                        params: params,
                        success: function (result, request) {
                        }
                    });
                }
            }
        });

        this.lGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    gm.me().createPoAction.enable();
                    gm.me().removeCartAction.enable();
                } else {
                    gm.me().createPoAction.disable();
                    gm.me().removeCartAction.disable();
                }
            }
        });

        gm.extFieldColumnStore.load({
            params: {menuCode: 'PPO1_SUB'},
            callback: function (records, operation, success) {
                if (success) {

                    let gridId = 'mycartgrid';

                    let o = gm.parseGridRecord(records, gridId);

                    Ext.each(o['columns'], function(columnObj) {
                        let dataIndex = columnObj["dataIndex"];

                        switch (dataIndex) {
                            case 'pr_quan':
                            case 'sales_price':
                                columnObj["editor"] = {};
                                columnObj["css"] = 'edit-cell';
                                columnObj["renderer"] = function (value, meta) {
                                    meta.css = 'custom-column';
                                    return value;
                                };
                                break;
                        }

                    });

                    gm.me().lGrid.reconfigure(o['columns']);
                    gm.me().lStore.load();

                } else {//endof if(success..
                    Ext.MessageBox.show({
                        title: '연결 종료',
                        msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
                        buttons: Ext.MessageBox.OK,
                        //animateTarget: btn,
                        scope: this,
                        icon: Ext.MessageBox['ERROR'],
                        fn: function () {

                        }
                    });
                }
            },
            scope: this
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
                    width: '50%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        items: [this.grid]
                    }]
                }, this.lGrid
            ]
        });

        this.store.load();
        this.callParent();
    },
    items: [],

    claastStore: Ext.create('Mplm.store.ClaAstStoreMt', {
        hasNull: false
    }),

    treatPo: function (po_no) {
        let supplierStore = Ext.create('Mplm.store.SupastStore', {
            supplierType: gm.me().suplier_type
        });

        let selections = gm.me().lGrid.getSelectionModel().getSelection();
        let total = 0;
        let supplier_name = '';
        let mycart_uids = [];
        let childs = [];
        let pr_quans = [];

        for (let i = 0; i < selections.length; i++) {
            total += selections[i].get('sales_price');
            childs.push(selections[i].get('child'));
            mycart_uids.push(selections[i].get('unique_id_long'));
            pr_quans.push(selections[i].get('pr_quan'));
        }

        let form = Ext.create('Ext.form.Panel', {
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
                width: 400,
                height: 280,
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
                        fieldLabel: '작성일자',
                        xtype: 'datefield',
                        width: '45%',
                        padding: '0 0 5px 30px',
                        name: 'aprv_date',
                        value: Ext.Date.format(new Date(), 'Y-m-d'),
                        altFormats: 'm/d/Y|n/j/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d|n-j|n/j|c',
                        format: 'Y-m-d'
                    },
                    {
                        fieldLabel: '주문처',
                        xtype: 'combo',
                        id: gu.id('target_supplier'),
                        anchor: '100%',
                        name: 'coord_key1',
                        store: supplierStore,
                        displayField: 'supplier_name',
                        valueField: 'unique_id',
                        emptyText: '선택',
                        value: "",
                        allowBlank: false,
                        sortInfo: {
                            field: 'create_date',
                            direction: 'DESC'
                        },
                        typeAhead: false,
                        readOnly: false,
                        fieldStyle: 'background-color: #fff; background-image: none;',
                        minChars: 2,
                        listConfig: {
                            loadingText: '검색중...',
                            emptyText: '일치하는 항목 없음.',
                            getInnerTpl: function () {
                                return '<div data-qtip="{unique_id}">{supplier_name}|{supplier_code}</div>';
                            }
                        },
                        listeners: {
                            select: function (combo, record) {
                                supplier_name = record.get('supplier_name');
                            }
                        }
                    },
                    {
                        fieldLabel: '합계금액',
                        xtype: 'textfield',
                        fieldStyle: 'background-color: #ddd; background-image: none;',
                        value: Ext.util.Format.number(total, '0,00/i') + ' ' + selections[0].get('currency'),
                        readOnly: true
                    },
                    {
                        fieldLabel: '요약',
                        xtype: 'textfield',
                        name: 'item_abst',
                        fieldStyle: 'background-color: #ddd; background-image: none;',
                        value: selections[0].get('item_name') + '외 ' + Ext.util.Format.number(selections.length - 1, '0,00/i') + '건',
                        readOnly: true
                    },
                    {
                        fieldLabel: '주문번호',
                        xtype: 'textfield',
                        rows: 4,
                        anchor: '100%',
                        name: 'po_no',
                        value: po_no,
                        fieldStyle: 'background-color: #ddd; background-image: none;',
                        readOnly: true
                    },
                    {
                        fieldLabel: '요청사항',
                        xtype: 'textarea',
                        rows: 4,
                        anchor: '100%',
                        name: 'reserved_varchar2',
                    }
                ]
            }]
        });

        supplierStore.load();

        let myHeight = 390;
        let myWidth = 420;

        let prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '주문 작성',
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {

                    if (btn === "no") {
                        prWin.close();
                    } else {

                        form.add(new Ext.form.Hidden({
                            name: 'supplier_name',
                            value: supplier_name
                        }));

                        form.add(new Ext.form.Hidden({
                            name: 'childs',
                            value: childs
                        }));

                        form.add(new Ext.form.Hidden({
                            name: 'mycart_uids',
                            value: mycart_uids
                        }));

                        form.add(new Ext.form.Hidden({
                            name: 'pr_quans',
                            value: pr_quans
                        }));

                        form.add(new Ext.form.Hidden({
                            name: 'req_date',
                            value: Ext.Date.format(new Date(), 'Y-m-d'),
                            format: 'Y-m-d'
                        }));

                        if (form.isValid()) {
                            let val = form.getValues(false);

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/request.do?method=createPoSimple',
                                params: val,
                                success: function () {
                                    prWin.setLoading(false);
                                    prWin.close();
                                    gm.me().store.load();
                                    gm.me().lStore.load();
                                },
                                failure: function () {
                                    prWin.setLoading(false);
                                    prWin.close();
                                    gm.me().store.load();
                                    gm.me().lStore.load();
                                }
                            });
                        }  // end of formvalid
                    }//else
                }
            }]
        });

        prWin.show();
    }
});



