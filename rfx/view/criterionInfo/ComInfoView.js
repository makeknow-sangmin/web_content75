Ext.define('Rfx.view.criterionInfo.ComInfoView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'cominfo-view',
    initComponent: function () {
        this.initSearchField();

        this.addSearchField(
            {
                field_id: 'menu_code'
                , store: 'CominfoMenuCodeStore'
                , displayField: 'menu_code'
                , valueField: 'menu_code'
                , innerTpl: '<div data-qtip="{codeNameEn}">[{menu_code}] {codeName}</div>'
            });


        this.addSearchField('var_name');
        this.addSearchField('description');
        var searchToolbar = this.createSearchToolbar();

        // 메뉴그리드 초기화
        this.resetMenugrid = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            text: '메뉴그리드 초기화',
            tooltip: '메뉴그리드 초기화합니다.',
            disabled: false,
            hidden: gu.setCustomBtnHiddenProp('resetMenugrid'),
            handler: function () {
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/admin/menu.do?method=resetMenuUser',
                    params: {},
                    success: function (response, request) {
                        Ext.Msg.alert('안내', '메뉴그리드 초기화 완료', function () {
                        });
                    },
                    failure: function (val, action) {
                        alert('메뉴그리드 초기화 실패');
                    },
                }); // end of ajax
            },
        });

        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REMOVE', 'COPY', 'INITIAL', 'UTYPE'],
        });

        buttonToolbar.items.each(function (item, index, length) {
            if (index == 1 || index == 2) {
                buttonToolbar.items.remove(item);
            }
        });

        this.addCominfoButton = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus-circle',
            text: gm.getMC('CMD_Enrollment', '등록'),
            tooltip: '등록',
            disabled: false,
            hidden: gu.setCustomBtnHiddenProp('addCominfoButton'),
            handler: function () {
                gm.me().addCominfo();
            },
        });

        // 수정 버튼 선언
        this.modifyCominfoButton = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-edit',
            text: gm.getMC('CMD_MODIFY', '수정'),
            tooltip: '수정',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('modifyCominfoButton'),
            handler: function () {
                gm.me().modifyCominfo();
            },
        });

        // 삭제 버튼 선언
        this.deleteCominfoButton = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: gm.getMC('CMD_DELETE', '삭제'),
            tooltip: '삭제',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('deleteCominfoButton'),
            handler: function () {
                gm.me().deleteCominfo();
            },
        });

        buttonToolbar.insert(1, this.addCominfoButton);
        buttonToolbar.insert(2, this.modifyCominfoButton);
        buttonToolbar.insert(3, this.deleteCominfoButton);
        buttonToolbar.insert(4, '-');
        buttonToolbar.insert(5, this.resetMenugrid);

        this.setGridOnCallback(function (selections) {
            console_logs('>>>>callback', selections);
            if (selections != null && selections.length > 0) {
                this.modifyCominfoButton.enable();
                this.deleteCominfoButton.enable();
            } else {
                this.modifyCominfoButton.disable();
                this.deleteCominfoButton.disable();
            }
        });

        var loadUrl = CONTEXT_PATH + '/DynaHanaro/view/criterionInfo/ComInfoView.do';

        this.store = new Ext.data.Store({
            pageSize: 100,
            fields: this.fields,
            proxy: {
                type: 'ajax',
                url: loadUrl,
                reader: {
                    type: 'json',
                    root: 'datas',
                    successProperty: 'success',
                },
                autoLoad: false,
            },
        });

        //grid 생성.
        this.createGrid([buttonToolbar, searchToolbar]);

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab],
        });
        this.callParent(arguments);

        gMain.setCenterLoading(false);
        this.store.load(function (records) {
            console.log('record', records);
        });
    },

    addCominfo: function () {
        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('addCominfoPanel'),
            xtype: 'form',
            frame: false,
            border: false,
            width: '100%',
            height: '100%',
            bodyPadding: '3 3 0',
            region: 'center',
            layout: 'column',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side',
            },

            items: [
                {
                    xtype: 'fieldset',
                    title: '신규 등록',
                    id: gu.id('addCominfo'),
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2',
                    },
                    items: [
                        {
                            fieldLabel: this.getFieldName('var_name'),
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            id: 'var_name',
                            name: 'var_name',
                            width: '95%',
                        },
                        {
                            fieldLabel: this.getFieldName('var_value'),
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            id: 'var_value',
                            name: 'var_value',
                            width: '95%',
                        },
                        {
                            fieldLabel: this.getFieldName('description'),
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            id: 'description',
                            name: 'description',
                            width: '95%',
                        },
                        {
                            fieldLabel: this.getFieldName('menu_code'),
                            xtype: 'combo',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['menu_code', 'value'],
                                data: [
                                    {menu_code: 'SYSTEM', value: 'SYSTEM'},
                                    {menu_code: 'USER_DEFINE', value: 'USER_DEFINE'},
                                ],
                            }),
                            emptyText: 'select menu code',
                            editable: false,
                            displayField: 'value',
                            valueField: 'menu_code',
                            listConfig: {
                                loadingText: 'Searching...',
                                emptyText: 'No matching posts found.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{menu_code}">{value}</div>';
                                },
                            },
                            listeners: {
                                select: function (combo, record) {
                                    console.log(record);
                                },
                            },
                            width: '95%',
                            id: 'menu_code',
                            name: 'menu_code',
                        },
                    ],
                },
            ],
        });

        var myWidth = 600;
        var myHeight = 400;

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '신규 데이터 속성 등록',
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            buttons: [
                {
                    text: CMD_OK,
                    handler: function (btn) {
                        if (btn == 'no') {
                            prWin.close();
                        } else {
                            if (form.isValid()) {
                                var val = form.getValues(false);
                                prWin.setLoading(true);

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/DynaHanaro/view/criterionInfo/ComInfoView.do?method=insert',
                                    params: val,
                                    success: function (result, request) {
                                        prWin.setLoading(false);
                                        Ext.MessageBox.alert('알림', '등록처리 되었습니다.');
                                        prWin.close();
                                        gm.me().store.load();
                                    }, //endofsuccess
                                    failure: function () {
                                        prWin.setLoading(false);
                                        extjsUtil.failureMessage();
                                        prWin.close();
                                        gm.me().store.load();
                                    },
                                }); //endofajax
                            }
                        }
                    },
                },
                {
                    text: CMD_CANCEL,
                    handler: function () {
                        if (prWin) {
                            prWin.close();
                        }
                    },
                },
            ],
        });
        prWin.show();
    },

    modifyCominfo: function () {
        var rec = gm.me().grid.getSelectionModel().getSelection()[0];
        console_logs('>>>>> rec', rec);

        console.log('unique_id', rec.get('unique_id'));
        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('modifyCominfoPanel'),
            xtype: 'form',
            frame: false,
            border: false,
            width: '100%',
            height: '100%',
            bodyPadding: '3 3 0',
            region: 'center',
            layout: 'column',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side',
            },

            items: [
                {
                    xtype: 'fieldset',
                    title: '수정',
                    id: gu.id('modifyCominfo'),
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2',
                    },
                    items: [
                        new Ext.form.Hidden({
                            name: 'unique_id',
                            id: 'unique_id',
                            value: rec.get('unique_id'),
                        }),
                        {
                            fieldLabel: this.getFieldName('var_name'),
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            id: 'var_name',
                            name: 'var_name',
                            width: '95%',
                            value: rec.get('var_name'),
                        },
                        {
                            fieldLabel: this.getFieldName('var_value'),
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            id: 'var_value',
                            name: 'var_value',
                            width: '95%',
                            value: rec.get('var_value'),
                        },
                        {
                            fieldLabel: this.getFieldName('description'),
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            id: 'description',
                            name: 'description',
                            width: '95%',
                            value: rec.get('description'),
                        },
                        {
                            fieldLabel: this.getFieldName('menu_code'),
                            xtype: 'combo',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['menu_code', 'value'],
                                data: [
                                    {menu_code: 'SYSTEM', value: 'SYSTEM'},
                                    {menu_code: 'USER_DEFINE', value: 'USER_DEFINE'},
                                ],
                            }),
                            emptyText: 'select menu code',
                            editable: false,
                            displayField: 'value',
                            valueField: 'menu_code',
                            listConfig: {
                                loadingText: 'Searching...',
                                emptyText: 'No matching posts found.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{menu_code}">{value}</div>';
                                },
                            },
                            listeners: {
                                select: function (combo, record) {
                                    console.log(record);
                                },
                            },
                            width: '95%',
                            id: 'menu_code',
                            name: 'menu_code',
                            value: rec.get('menu_code'),
                        },
                    ],
                },
            ],
        });

        var myWidth = 600;
        var myHeight = 400;

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '수정',
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            buttons: [
                {
                    text: CMD_OK,
                    handler: function (btn) {
                        if (btn == 'no') {
                            prWin.close();
                        } else {
                            if (form.isValid()) {
                                var val = form.getValues(false);
                                prWin.setLoading(true);

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/DynaHanaro/view/criterionInfo/ComInfoView.do?method=update',
                                    params: val,
                                    success: function (result, request) {
                                        prWin.setLoading(false);
                                        Ext.MessageBox.alert('알림', '등록처리 되었습니다.');
                                        prWin.close();
                                        gm.me().store.load();
                                    }, //endofsuccess
                                    failure: function () {
                                        prWin.setLoading(false);
                                        extjsUtil.failureMessage();
                                        prWin.close();
                                        gm.me().store.load();
                                    },
                                }); //endofajax
                            }
                        }
                    },
                },
                {
                    text: CMD_CANCEL,
                    handler: function () {
                        if (prWin) {
                            prWin.close();
                        }
                    },
                },
            ],
        });
        prWin.show();
    },
});
