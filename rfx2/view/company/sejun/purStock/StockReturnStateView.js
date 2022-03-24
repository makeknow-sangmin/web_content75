Ext.define('Rfx2.view.company.sejun.purStock.StockReturnStateView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'stock-return-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        //this.addSearchField('seller_name');
        //this.addSearchField('project_varchar6');
        this.addSearchField('item_code');
        this.addSearchField('item_name');
        //this.addSearchField('specification');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //console_logs('this.fields', this.fields);


        this.createStore('Rfx.model.StockReturnState', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gMain.pageSize/*pageSize*/
        );

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        //그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        //grid 생성.
        this.createGrid(arr);
        this.createCrudTab();

        // this.reWearhousingAction = Ext.create('Ext.Action', {
        //     xtype: 'button',
        //     text: '재입고',
        //     tooltip: '재입고',
        //     iconCls: 'mfglabs-retweet_14_0_5395c4_none',
        //     disabled: true,
        //     handler: function () {

        //     }
        // });

        this.discardStockAction = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '반품 확정',
            tooltip: '반품 확정',
            iconCls: 'af-remove',
            disabled: true,
            handler: function () {
                var stodtl_uids = new Array();
                var exp_dates = new Array();
                var item_codes = new Array();
                var item_names = new Array();

                var selections = gm.me().grid.getSelectionModel().getSelection();

                console_logs('selections', selections);
                var arrExist = [];

                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];
                    var unique_id = rec.get('unique_id');
                    var exp_date = rec.get('exp_date');
                    var item_code = rec.get('item_code');
                    var item_name = rec.get('item_name');

                    stodtl_uids.push(unique_id);
                    exp_dates.push(exp_date);
                    item_codes.push(item_code);
                    item_names.push(item_name);
                }

                if (stodtl_uids.length > 0) {

                    gm.me().grid.setLoading(true);

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/purchase/request.do?method=addMyCart',
                        params: {
                            stodtl_uids: stodtl_uids,
                            exp_dates: exp_date,
                            item_codes: item_code,
                            item_names: item_name
                        },
                        success: function (result, request) {
                            gm.me().grid.setLoading(false);
                            gm.me().load(function () {
                                var resultText = result.responseText;
                                Ext.Msg.alert('안내', '반품 확정 완료.', function () {
                                });
                            });
                        },

                    }); //end of ajax
                } else {

                }
            }
        });

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
            text: '자재',
            tooltip: '자재',
            toggleGroup: 'matType',
            handler: function () {
                this.matType = 'RAW';
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'R');
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
                gm.me().store.getProxy().setExtraParam('sp_code', 'K');
                gm.me().store.load(function () {
                });
            }
        });

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        //버튼 추가.

        buttonToolbar.insert(1, this.reWearhousingAction);
        buttonToolbar.insert(1, this.discardStockAction);

        buttonToolbar.insert(5, '-');
        buttonToolbar.insert(5, this.setUsedMatView);
        buttonToolbar.insert(5, this.setMROView);
        buttonToolbar.insert(5, this.setSubMatView);
        buttonToolbar.insert(5, this.setSaMatView);
        buttonToolbar.insert(5, this.setAllMatView)

        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                rec = selections[0];
                gm.me().vSELECTED_UNIQUE_ID = rec.get('unique_id');
                gm.me().discardStockAction.enable();
            } else {
                gm.me().discardStockAction.disable();
            }
        })

        this.callParent(arguments);
        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function (records) {
        });
    },
    items: []
});
