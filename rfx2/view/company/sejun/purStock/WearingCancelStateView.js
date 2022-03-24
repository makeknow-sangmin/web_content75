Ext.define('Rfx2.view.company.sejun.purStock.WearingCancelStateView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'wearing-cancel-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.addSearchField('seller_name');
        //this.addSearchField('project_varchar6');
        this.addSearchField('item_code');
        this.addSearchField('item_name');
        //this.addSearchField('specification');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.WarehousingCancelState', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gMain.pageSize/*pageSize*/
        );

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index >= 1 && index <= 5) {
                buttonToolbar.items.remove(item);
            }
        });

        //그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        //grid 생성.
        this.createGrid(arr);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length > 0) {
                gm.me().discardStockAction.enable();
                gm.me().reWearhousingAction.enable();
            } else {
                gm.me().discardStockAction.disable();
                gm.me().reWearhousingAction.disable();
            }

        });

        this.createCrudTab();

        this.reWearhousingAction = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '재입고',
            tooltip: '재입고',
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            disabled: true,
            handler: function () {

                var selections = gm.me().grid.getSelectionModel().getSelection();
                var isExistNotN = false;

                for (var i = 0; i < selections.length; i++) {
                    var isSended = selections[i].get('is_sended');

                    if (isSended !== null && isSended !== 'N') {
                        isExistNotN = true;
                        break;
                    }
                }

                if (!isExistNotN) {
                    Ext.MessageBox.confirm('확인', '선택하신 품목을 재입고처리 하시겠습니까?</br>이 작업은 취소할 수 없습니다.', function (btn) {
                        if (btn == 'yes') {

                            var selections = gm.me().grid.getSelectionModel().getSelection();

                            var wgrastUidArr = [];
                            var wgrbstUidArr = [];
                            var srcahdUidArr = [];
                            var grQtyArr = [];
                            var expDateArr = [];
                            var lotNoArr = [];

                            for (var i = 0; i < selections.length; i++) {

                                wgrastUidArr.push(selections[i].get('wgrast_uid'));
                                wgrbstUidArr.push(selections[i].get('unique_id_long'));
                                srcahdUidArr.push(selections[i].get('srcahd_uid'));
                                grQtyArr.push(selections[i].get('gr_blocking_qty'));
                                expDateArr.push(selections[i].get('ar_date'));
                                lotNoArr.push(selections[i].get('area_code'));
                            }

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/quality/wgrast.do?method=reWearhousingOfItems',
                                params: {
                                    wgrastUidArr: wgrastUidArr,
                                    wgrbstUidArr: wgrbstUidArr,
                                    srcahdUidArr: srcahdUidArr,
                                    grQtyArr: grQtyArr,
                                    expDateArr: expDateArr,
                                    lotNoArr: lotNoArr,
                                    whouseUid: 100
                                },
                                success: function (result, request) {
                                    Ext.Msg.alert('저장', '해당 품목을 재입고 처리하였습니다.', function () {
                                    });
                                    gm.me().store.load();
                                },//endofsuccess
                            });//endofajax
                        } else {
                        }
                    });
                } else {
                    Ext.Msg.alert('경고', '창고대기 상태가 아닌 품목이 있습니다.');
                }
            }
        });

        this.discardStockAction = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '재고폐기',
            tooltip: '재고폐기',
            iconCls: 'af-remove',
            disabled: true,
            handler: function () {

                var selections = gm.me().grid.getSelectionModel().getSelection();
                var isExistNotN = false;

                for (var i = 0; i < selections.length; i++) {
                    var isSended = selections[i].get('is_sended');

                    if (isSended !== null && isSended !== 'N') {
                        isExistNotN = true;
                        break;
                    }
                }

                if (!isExistNotN) {
                    Ext.MessageBox.confirm('확인', '선택하신 품목을 폐기처리 하시겠습니까?</br>이 작업은 취소할 수 없습니다.', function (btn) {
                        if (btn == 'yes') {

                            var wgrbstUidArr = [];
                            var srcahdUidArr = [];
                            var disposalQtyArr = [];
                            var expDateArr = [];
                            var lotNoArr = [];

                            for (var i = 0; i < selections.length; i++) {
                                wgrbstUidArr.push(selections[i].get('unique_id_long'));
                                srcahdUidArr.push(selections[i].get('srcahd_uid'));
                                disposalQtyArr.push(selections[i].get('gr_blocking_qty'));
                                expDateArr.push(selections[i].get('ar_date'));
                                lotNoArr.push(selections[i].get('area_code'));
                            }

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/quality/wgrast.do?method=disposeOfItems',
                                params: {
                                    wgrbstUidArr: wgrbstUidArr,
                                    srcahdUidArr: srcahdUidArr,
                                    disposalQtyArr: disposalQtyArr,
                                    expDateArr: expDateArr,
                                    lotNoArr: lotNoArr
                                },
                                success: function (result, request) {
                                    Ext.Msg.alert('저장', '해당 품목을 폐기 처리하였습니다.', function () { });
                                    gm.me().store.load();
                                },//endofsuccess
                            });//endofajax
                        } else { }
                    });
                } else {
                    Ext.Msg.alert('경고', '창고대기 상태가 아닌 품목이 있습니다.');
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
        buttonToolbar.insert(5, this.setAllMatView);


        this.callParent(arguments);
        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function (records) {
        });
    },
    items: []
});
