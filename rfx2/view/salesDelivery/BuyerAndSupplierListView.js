//고객사 관리 메뉴
Ext.define('Rfx2.view.salesDelivery.BuyerAndSupplierListView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'buyer-list-view',
    initComponent: function () {
        //검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField({
            field_id: 'pr_active_flag'
            , store: 'PrActiveFlagStore'
            , displayField: 'codeName'
            , valueField: 'systemCode'
            , innerTpl: '{codeName}'
        });

        this.addSearchField('wa_name');
        this.addSearchField('president_name');

        this.initReadonlyField();
        this.addReadonlyField('unique_id');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        console_logs('this.fields', this.fields);

        this.createStore('Rfx2.model.BuyerAndSupplierList', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gMain.pageSize/*pageSize*/, {}
            , ['combst']
        );

        this.addCallback('CHECK_CODE', function (o) {
            var target = gMain.selPanel.getInputTarget('wa_code');
            var code = target.getValue();
            var uppercode = code.toUpperCase();
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/userMgmt/combst.do?method=checkWaCode',
                params: {
                    code: code
                },
                success: function (result, request) {
                    var resultText = result.responseText;
                    if (resultText == '0') {
                        Ext.Msg.alert('안내', '사용가능한 코드입니다', function () { });
                        gMain.selPanel.getInputTarget('wa_code').setValue(uppercode);
                    } else {
                        Ext.Msg.alert('사용불가', '이미 사용중인 코드입니다', function () { });
                        gMain.selPanel.getInputTarget('wa_code').setValue('');
                    }
                },
                failure: extjsUtil.failureMessage
            }); //end of ajax
        });  // end of addCallback
        //grid 생성.
        // var selModel = Ext.create('Ext.selection.CheckboxModel', {
        //     selType: 'checkboxmodel',
        //     mode: 'SINGLE',
        //     checkOnly: false,
        //     allowDeselect: true
        // })

        this.createGrid(searchToolbar, buttonToolbar, {selModel:{
                selType: 'checkboxmodel',
                mode: 'SINGLE'}
        });
        this.createCrudTab('buyer-list-view');
        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });


        this.callParent(arguments);



        //디폴트 로드
        this.store.load(function (records) { });
    },

    deleteConfirm: function (result) {
        if (result == 'yes') {

            var selections = gm.me().grid.getSelectionModel().getSelection();
            var combstUids = [];
            var supastUids = [];

            for (var i = 0; i < selections.length; i++) {
                var category = selections[i].get('category');
                var unique_id_long = selections[i].get('unique_id_long');

                if (category === 'CUSTOMER') {
                    combstUids.push(unique_id_long);
                } else {
                    supastUids.push(unique_id_long);
                }
            }

            if (combstUids.length > 0) {
                var CLASS_ALIAS = 'combst';

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/index/generalData.do?method=delete',
                    params: {
                        DELETE_CLASS: CLASS_ALIAS,
                        uids: combstUids,
                        menuCode: gm.me().link
                    },
                    method: 'POST',
                    success: function (rec, op) {
                        gm.me().redrawStore();

                    },
                    failure: function (rec, op) {
                        Ext.Msg.alert('안내', '삭제에 실패하였습니다.', function () {
                        });

                    }
                });
            }

            if (supastUids.length > 0) {
                var CLASS_ALIAS = 'supast';

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/index/generalData.do?method=delete',
                    params: {
                        DELETE_CLASS: CLASS_ALIAS,
                        uids: supastUids,
                        menuCode: gm.me().link
                    },
                    method: 'POST',
                    success: function (rec, op) {
                        gm.me().redrawStore();

                    },
                    failure: function (rec, op) {
                        Ext.Msg.alert('안내', '삭제에 실패하였습니다.', function () {
                        });

                    }
                });
            }
        }
    },
    items: []
});
