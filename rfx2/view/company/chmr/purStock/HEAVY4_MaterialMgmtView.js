//자재 관리
Ext.define('Rfx2.view.company.chmr.purStock.HEAVY4_MaterialMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype : 'material-mgmt-view',

    initComponent: function () {
        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;
        useMultitoolbar = false;
        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.addSearchField(
            {
                // type: 'combo',
                field_id      : 'standard_flag'
                , store       : 'StandardFlagStore'
                , displayField: 'code_name_kr'
                , valueField  : 'system_code'
                , innerTpl    : '[{code_name_kr}]{system_code}'

            });
        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('description');
        this.addSearchField('specification');
        // this.addSearchField('seller_name');

        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //부자재 선택시 구분(sg_code) disabled로 이벤트처리
        this.addCallback('STANDARD_FLAG', function (o) {
            console_logs('addCallback>>>>>>>>>', o);
        });

        this.createStore('Rfx2.model.company.chmr.HEAVY4_MaterialMgmt', [{
                property : 'item_code',
                direction: 'DESC'
            }],
            gm.pageSize
            , {
                item_code_dash: 's.item_code',
                comment       : 's.comment1'
            },
            ['srcahd']
        );

        var arr = [];
        arr.push(buttonToolbar);

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        arr.push(searchToolbar);

        var myCartModel = Ext.create('Rfx.model.MyCartLineSrcahd', {
            fields: this.fields
        });

        this.myCartStore = new Ext.data.Store({
            pageSize: 100,
            model   : myCartModel,
            sorters : [{
                property : 'create_date',
                direction: 'desc'
            }

            ]
        });

        this.setRowClass(function (record, index) {
            console_logs('record>>>', record);
            var stock_qty = record.get('stock_qty');
            var stock_qty_safe = record.get('stock_qty_safe');
            if (stock_qty <= stock_qty_safe) {
                return 'red-row';
            }
        });

        //grid 생성.
        this.createGrid(arr);

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items : [this.grid, this.crudTab]
        });

        this.myCartStore.load(function () {
        });

        this.addMyCart = Ext.create('Ext.Action', {
            xtype   : 'button',
            iconCls : 'fa-cart-arrow-down_14_0_5395c4_none',
            text    : '구매카트 담기 ',
            tooltip : '구매를 위한 마이카트 담기',
            disabled: true,
            handler : function (widget, event) {
                var my_child = new Array();
                var my_childs = new Array();
                var my_assymap_uid = new Array();
                var my_pl_no = new Array();
                var my_pr_quan = new Array();
                var my_item_code = new Array();


                var selections = gm.me().grid.getSelectionModel().getSelection();

                console_logs('selections', selections);
                var arrExist = [];

                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];
                    var unique_id = rec.get('unique_id');
                    var child = rec.get('child');
                    var item_code = rec.get('item_code');
                    var item_name = rec.get('item_name');
                    var pl_no = rec.get('pl_no');
                    arrExist.push(unique_id);

                    console_logs('unique_id----------------', unique_id);
                    my_child.push(unique_id);
                    my_childs.push(child);
                    my_item_code.push(item_code);
                    my_pl_no.push(pl_no);
                }

                if (my_child.length > 0) {

                    gm.me().grid.setLoading(true);

                    Ext.Ajax.request({
                        url    : CONTEXT_PATH + '/purchase/request.do?method=addMyCart',
                        params : {
                            childs     : my_child,
                            srcahd_uids: my_child,
                            item_codes : my_item_code
                        },
                        success: function (result, request) {
                            gm.me().grid.setLoading(false);
                            gm.me().myCartStore.load(function () {
                                var resultText = result.responseText;
                                Ext.Msg.alert('안내', '카트 담기 완료.', function () {
                                });
                            });
                        },

                    }); //end of ajax
                } else {

                }
            }
        });

        //버튼 추가.
        buttonToolbar.insert(2, '-');
        buttonToolbar.insert(3, this.addMyCart);

        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1) {
                buttonToolbar.items.remove(item);
            }
        });

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                rec = selections[0];
                gm.me().vSELECTED_UNIQUE_ID = rec.get('unique_id');
                gm.me().addMyCart.enable();
            } else {
                gm.me().addMyCart.disable();
            }
        })

        //디폴트 로드
        gm.setCenterLoading(false);
        this.store.getProxy().setExtraParam('standard_flag_list', 'R,A');
        this.store.load(function (records) {
        });
    },
    items        : [],

    claastStore: Ext.create('Mplm.store.ClaAstStoreMt', {
        hasNull: false
    }),

    itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

        var my_child = new Array();
        var my_childs = new Array();
        var my_assymap_uid = new Array();
        var my_pl_no = new Array();
        var my_pr_quan = new Array();
        var my_item_code = new Array();

        console_logs('selections', selections);
        var arrExist = [];

        var rec = selections[0];
        var unique_id = rec.get('unique_id');
        var child = rec.get('child');
        var item_code = rec.get('item_code');
        var item_name = rec.get('item_name');
        var pl_no = rec.get('pl_no');
        arrExist.push(unique_id);

        console_logs('unique_id----------------', unique_id);
        my_child.push(unique_id);
        my_childs.push(child);
        my_item_code.push(item_code);
        my_pl_no.push(pl_no);

        if (my_child.length > 0) {
            gm.me().grid.setLoading(true);
            Ext.Ajax.request({
                url    : CONTEXT_PATH + '/purchase/request.do?method=addMyCart',
                params : {
                    childs     : my_child,
                    srcahd_uids: my_child,
                    item_codes : my_item_code
                },
                success: function (result, request) {
                    gm.me().grid.setLoading(false);
                    gm.me().myCartStore.load(function () {
                        var resultText = result.responseText;
                        gm.me().showToast('안내', '카트담기가 완료되었습니다.');
                    });
                },

            }); //end of ajax
        } else {

        }

    },

});



