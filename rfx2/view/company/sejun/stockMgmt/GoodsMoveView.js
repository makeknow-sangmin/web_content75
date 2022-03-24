//주문작성

Ext.define('Rfx2.view.company.sejun.stockMgmt.GoodsMoveView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'goods-move-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        console_logs('this.fields', this.fields);

        this.createStoreSimple({
            modelClass: 'Rfx2.model.company.bioprotech.GoodsMove',
            pageSize: gm.pageSize, /*pageSize*/
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

        var option = {

        };

        //grid 생성.
        this.createGridCore(arr, option);
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.removeAction.setText('반려');

        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 3 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        this.rejectMoveAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: '반려',
            tooltip: '반려',
            disabled: true,
            handler: function () {
                var cartmapArr = [];
                var prQuanArr = [];
                var stoqtyUidArr = [];
                var whouseUidArr = [];
                var selections = gm.me().grid.getSelectionModel().getSelection();

                if (selections.length) {

                    var isStatusCR = true;

                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];

                        cartmapArr.push(rec.get('unique_id'));
                        prQuanArr.push(rec.get('pr_quan'));
                        stoqtyUidArr.push(rec.get('stoqty_uid'));
                        whouseUidArr.push(rec.get('whouse_from_uid'));

                        var status = rec.get('status');

                        if (status !== 'CR') {
                            isStatusCR = false;
                            break;
                        }
                    }

                    if (cartmapArr.length < 1) {
                        Ext.Msg.alert("알림", "선택된 자재가 없습니다.");
                    } else if (!isStatusCR) {
                        Ext.Msg.alert("알림", "선택된 자재 중에 처리대기 상태가 아닌 자재가 있습니다.");
                    } else {

                        myHeight = 150;

                        var msg = '이동을 반려하시겠습니까? 원래 창고로 되돌아갑니다.'
                        var myTitle = '반려 확인';
                        Ext.MessageBox.show({
                            title: myTitle,
                            msg: msg,

                            buttons: Ext.MessageBox.YESNO,
                            icon: Ext.MessageBox.QUESTION,
                            fn: function (btn) {

                                if(btn=='yes') {

                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/inventory/prchStock.do?method=rejectMoveQty',
                                        params: {
                                            cartmapArr: cartmapArr,
                                            prQuanArr: prQuanArr,
                                            stoqtyUidArr: stoqtyUidArr,
                                            whouseUidArr: whouseUidArr
                                        },
                                        success: function () {
                                            Ext.Msg.alert('안내', '반려 처리되었습니다.');
                                            gm.me().storeLoad();
                                        },
                                        failure: function () {
                                            Ext.Msg.alert('안내', '반려 처리되었습니다.');
                                            gm.me().storeLoad();
                                        }
                                    });
                                }

                            }//fn function(btn)

                        });//show
                    }
                }
            }
        });

        this.createMoveAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '이동 확인',
            tooltip: '이동 확인',
            disabled: true,
            handler: function () {

                var cartmapArr = [];
                var prQuanArr = [];
                var stoqtyUidArr = [];
                var whouseUidArr = [];
                var selections = gm.me().grid.getSelectionModel().getSelection();

                if (selections.length) {

                    var isStatusCR = true;

                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];

                        cartmapArr.push(rec.get('unique_id'));
                        prQuanArr.push(rec.get('pr_quan'));
                        stoqtyUidArr.push(rec.get('stoqty_uid'));
                        whouseUidArr.push(rec.get('whouse_to_uid'));

                        var status = rec.get('status');

                        if (status !== 'CR') {
                            isStatusCR = false;
                            break;
                        }
                    }

                    if (cartmapArr.length < 1) {
                        Ext.Msg.alert("알림", "선택된 자재가 없습니다.");
                    } else if (!isStatusCR) {
                        Ext.Msg.alert("알림", "선택된 자재 중에 처리대기 상태가 아닌 자재가 있습니다.");
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
                                    fieldLabel: '이동 날짜',
                                    xtype: 'datefield',
                                    id: gu.id('reserved_timestamp1'),
                                    name: 'reserved_timestamp1',
                                    submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                    dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                                    fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                                    format: 'Y-m-d',
                                    value: new Date()
                                }
                            ]//item end..

                        });//Panel end...
                        myHeight = 150;

                        prWin = Ext.create('Ext.Window', {
                            modal: true,
                            title: '이동 확인',
                            width: 400,
                            height: myHeight,
                            plain: true,
                            items: form,
                            buttons: [{
                                text: CMD_OK,
                                handler: function (btn) {
                                    var msg = '이동 확인하시겠습니까?'
                                    var myTitle = '이동 확인';
                                    Ext.MessageBox.show({
                                        title: myTitle,
                                        msg: msg,

                                        buttons: Ext.MessageBox.YESNO,
                                        icon: Ext.MessageBox.QUESTION,
                                        fn: function (btn) {

                                            if(btn=='yes') {
                                                var form = gu.getCmp('formPanel').getForm();

                                                var val = form.getValues(false);
                                                prWin.setLoading(true);
                                                form.submit({
                                                    url: CONTEXT_PATH + '/inventory/prchStock.do?method=proceedMoveQty',
                                                    params: {
                                                        cartmapArr: cartmapArr,
                                                        prQuanArr: prQuanArr,
                                                        stoqtyUidArr: stoqtyUidArr,
                                                        whouseUidArr: whouseUidArr,
                                                        reserved_timestamp1: gu.getCmp('reserved_timestamp1').getValue()
                                                    },
                                                    success: function () {
                                                        Ext.Msg.alert('안내', '이동 확인하였습니다.');
                                                        gm.me().storeLoad();
                                                        prWin.close();
                                                    },
                                                    failure: function () {
                                                        Ext.Msg.alert('안내', '이동 확인하였습니다.');
                                                        gm.me().storeLoad();
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
        buttonToolbar.insert(3, this.createMoveAction);
        buttonToolbar.insert(3, this.rejectMoveAction);

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {

            if (selections.length > 0) {
                gm.me().createMoveAction.enable();
                gm.me().rejectMoveAction.enable();

            } else {
                gm.me().createMoveAction.disable();
                gm.me().rejectMoveAction.disable();
            }

        })

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.getProxy().setExtraParam('parent_code', this.link);
        this.store.load(function (records) {

        });
    }
});

