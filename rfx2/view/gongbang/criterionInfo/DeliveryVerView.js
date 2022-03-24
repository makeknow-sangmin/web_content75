Ext.define('Rfx2.view.gongbang.criterionInfo.DeliveryVerView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'delivery-ver-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.addSearchField('wa_name');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        (buttonToolbar.items).each(function (item, index, length) {
            switch (index) {
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    buttonToolbar.items.remove(item);
                    break;
                default :
                    break;
            }
        });

        // Comment 등록 버튼
        this.commentwriteAction = Ext.create('Ext.Action', {
            itemId: 'commentwriteAction',
            iconCls: 'af-plus-circle',
            text: '작성',
            plain: true,
            handler: function (widget, event) {

                var selectedUids = [];
                var selections = gm.me().grid.getSelectionModel().getSelection();
                if (selections.length > 0) {
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        selectedUids.push(rec.get('unique_id_long'));
                    } // for
                } // if
                var wa_name = selections[0]['data']['wa_name'];
                var req_date = selections[0]['data']['req_date'];
                var item_name = selections[0]['data']['item_name'];

                var myWidth = 700;
                var myHeight = 300;

                var formItem = [
                    {
                        xtype: 'textfield',
                        id: gu.id('wa_name'),
                        readonly: true,
                        name: 'wa_name',
                        padding: '0 0 5px 0',
                        style: 'width: 99%',
                        allowBlank: true,
                        fieldStyle: 'background-color: #ebe8e8; background-image: none; font-weight: bold; text-align: left',
                        editable: false,
                        fieldLabel: '고객사',
                        value: wa_name
                    },
                    {
                        xtype: 'textfield',
                        id: gu.id('item_name'),
                        readonly: true,
                        name: 'item_name',
                        padding: '0 0 5px 0',
                        style: 'width: 99%',
                        allowBlank: true,
                        fieldStyle: 'background-color: #ebe8e8; background-image: none; font-weight: bold; text-align: left',
                        editable: false,
                        fieldLabel: '제품명',
                        value: item_name
                    },
                    {
                        xtype: 'textfield',
                        id: gu.id('req_date'),
                        readonly: true,
                        name: 'req_date',
                        padding: '0 0 5px 0',
                        style: 'width: 99%',
                        allowBlank: true,
                        fieldStyle: 'background-color: #ebe8e8; background-image: none; font-weight: bold; text-align: left',
                        editable: false,
                        fieldLabel: '납품일자',
                        value: req_date
                    },
                    {
                        xtype: 'textarea',
                        id: gu.id('project_varcharj'),
                        fieldLabel: '코멘트',
                        name: 'project_varcharj',
                        padding: '0 0 5px 0',
                        style: 'width: 99%',
                        height: 120
                    },
                ]; //formItem

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
                        msgTarget: 'side',
                    },
                    items: formItem
                }) // form

                var item = [form];

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '코멘트 작성',
                    width: myWidth,
                    height: myHeight,
                    items: item,
                    buttons: [{
                        text: CMD_OK,
                        handler: function (btn) {
                            if (btn == "no") {
                                prWin.close();
                            } else {
                                if (form.isValid()) {
                                    var project_uid = "";
                                    var selections = gm.me().grid.getSelectionModel().getSelection();

                                    for (var i = 0; i < selections.length; i++) {
                                        project_uid = selections[i].get('project_uid');
                                    }// for

                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/production/schdule.do?method=updateDeliveryCompletedComment',
                                        params: {
                                            project_uid: project_uid,
                                            project_varcharj: gu.getCmp('project_varcharj').getValue()
                                        }, // params
                                        success: function (result, request) {
                                            gm.me().store.load();
                                            Ext.Msg.alert('안내', '코멘트 작성을 완료하였습니다.', function () {
                                            });
                                            prWin.close();
                                        }, // success
                                        failure: extjsUtil.failureMessage
                                    })// ajax
                                } // if
                            } // if
                        } // handler
                    }, {
                        text: CMD_CANCEL,
                        handler: function (btn) {
                            prWin.close();
                        }
                    }], // button
                }); // prWin
                prWin.show();
            } // handler
        });

        this.commentreadAction = Ext.create('Ext.Action', {
            itemId: 'commentreadAction',
            iconCls: 'af-edit',
            text: '상세보기',
            plain: true,
            handler: function (widget, event) {
                var selectedUids = [];
                var selections = gm.me().grid.getSelectionModel().getSelection();
                if (selections.length > 0) {
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        selectedUids.push(rec.get('unique_id_long'));
                    } // for
                } // if

                var project_varcharj = selections[0]['data']['project_varcharj'];

                var myWidth = 700;
                var myHeight = 300;

                var formItem = [
                    {
                        xtype: 'textarea',
                        id: gu.id('project_varcharj'),
                        fieldLabel: '코멘트',
                        name: 'project_varcharj',
                        padding: '0 0 5px 0',
                        style: 'width: 99%',
                        height: 200,
                        value: project_varcharj
                    },
                ]; //formItem

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
                        msgTarget: 'side',
                    },
                    items: formItem
                }) // form

                var item = [form];

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '코멘트 상세보기',
                    width: myWidth,
                    height: myHeight,
                    items: item,

                    buttons: [{
                        text: CMD_OK,
                        handler: function (btn) {
                            prWin.close();
                        } // handler
                    }] // button
                }) //prWin
                prWin.show();
            }//handler
        });

        buttonToolbar.insert(1, this.commentwriteAction);
        buttonToolbar.insert(2, this.commentreadAction);

        //모델 정의
        this.createStore('Rfx2.model.DeliveryVer', [{
            property: 'create_date',
            direction: 'DESC'
        }]);

        //그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);

        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function (records) {
        });
        this.store.getProxy().setExtraParam('sloast_status', 'DC');
        this.loadStoreAlways = true;

    },
    items: [],
});
