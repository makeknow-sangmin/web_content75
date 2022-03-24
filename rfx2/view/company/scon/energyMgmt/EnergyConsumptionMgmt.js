Ext.define('Rfx2.view.company.scon.energyMgmt.EnergyConsumptionMgmt', {
    extend       : 'Rfx2.base.BaseView',
    xtype        : 'energy-view',
    initComponent: function () {
        this.initDefValue();

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가


        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar2({
            REMOVE_BUTTONS: ['COPY', 'INITIAL', 'UTYPE']
        });


        this.createStore('Rfx.model.Energy', [{
                property : 'unique_id',
                direction: 'DESC'
            }],
            10000/*pageSize*/
            , {}
            , ['energy']
        );


        this.createGrid(searchToolbar, buttonToolbar);

        //this.createGridCore([searchToolbar, buttonToolbar], option);
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items : [this.grid, this.crudTab]
        });

        this.addUserButton = Ext.create('Ext.Action', {
            xtype   : 'button',
            iconCls : 'mfglabs-retweet_14_0_5395c4_none',
            text    : '신규등록',
            tooltip : '신규등록',
            disabled: false,
            hidden  : gu.setCustomBtnHiddenProp('addUserButton'),
            handler : function () {
                gm.me().addUserView();
            }
        });

        this.modifyUserButton = Ext.create('Ext.Action', {
            xtype   : 'button',
            iconCls : 'af-edit',
            text    : gm.getMC('CMD_MODIFY', '수정'),
            tooltip : '수정하기',
            disabled: true,
            hidden  : gu.setCustomBtnHiddenProp('modifyUserButton'),
            handler : function () {
                gm.me().modifyUserView();
            }
        });

        buttonToolbar.items.each(function (item, index, length) {
            if (index == 1 || index == 2) {
                buttonToolbar.items.remove(item);
            }
        })

        buttonToolbar.insert(1, this.addUserButton);
        buttonToolbar.insert(2, this.modifyUserButton);

        this.callParent(arguments);
        this.store.getProxy().setExtraParam('delete_flag', 'N');

        this.setGridOnCallback(function (selections) {
            console_logs('>>>>callback', selections);
            if (selections != null && selections.length > 0) {
                this.modifyUserButton.enable();
            } else {
                this.modifyUserButton.disable();
            }
        });

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function (records) {
        });
    },
    items        : [],

    addUserView: function () {
        var form = Ext.create('Ext.form.Panel', {
            id         : gu.id('formPanel'),
            xtype      : 'form',
            frame      : false,
            border     : false,
            width      : '100%',
            height     : '100%',
            bodyPadding: '3 3 0',
            region     : 'center',
            layout     : 'column',
            items      : [
                {
                    xtype   : 'fieldset',
                    title   : '에너지사용량 정보 입력',
                    id      : gu.id('registration'),
                    frame   : true,
                    width   : '100%',
                    height  : '100%',
                    layout  : 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items   : [
                        {
                            fieldLabel  : '종류',
                            xtype       : 'combo',
                            anchor      : '100%',
                            allowBlank  : false,
                            store       : this.sampleTypeStore,
                            id          : gu.id('energy_type'),
                            name        : 'energy_type',
                            valueField  : 'systemCode',
                            displayField: 'codeName',
                            listConfig  : {
                                loadingText: 'Searching...',
                                emptyText  : 'No matching posts found.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{systemCode}">{codeName}</div>';
                                }
                            },
                            listeners   : {
                                select: function (combo, record) {
                                    console_logs('asdsadsadsad', record);
                                    gu.getCmp('unit').setValue(record.get('code_name_en'));
                                    // Ext.getCmp('reserved_varchar3').setValue(record.get('address_1'));
                                }// endofselect
                            }
                        }, {
                            fieldLabel  : '단위량',
                            xtype       : 'textfield',
                            anchor      : '100%',
                            allowBlank  : false,
                            store       : this.sampleTypeStore,
                            id          : gu.id('unit'),
                            name        : 'unit',
                            valueField  : 'code_name_en',
                            displayField: 'code_name_en',
                            editable    : false

                            // listConfig: {
                            //     loadingText: 'Searching...',
                            //     emptyText: 'No matching posts found.',
                            //     getInnerTpl: function () {
                            //         return '<div data-qtip="{code_name_en}">{code_name_en}</div>';
                            //     }
                            // }
                        }, {
                            fieldLabel: '사용량',
                            xtype     : 'numberfield',
                            anchor    : '100%',
                            allowBlank: true,
                            id        : gu.id('energy_usage'),
                            name      : 'energy_usage',
                            value     : 0,
                            renderer  : function (value, context, tmeta) {
                                return Ext.util.Format.number(value, '0,00/i');
                            },
                        }
                    ]
                },

            ]
        });


        var myWidth = 310;
        var myHeight = 200;


        var prWin = Ext.create('Ext.Window', {
            modal  : true,
            title  : '에너지사용량등록',
            width  : myWidth,
            height : myHeight,
            plain  : true,
            items  : form,
            buttons: [{
                text   : CMD_OK,
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (form.isValid()) {

                            prWin.setLoading(true);

                            var val = form.getValues(false);
                            // User Id 중복확인
                            Ext.Ajax.request({
                                url    : CONTEXT_PATH + '/energy/usage.do?method=energyCre',
                                params : val,
                                success: function (result, request) {
                                    if (prWin) {
                                        prWin.setLoading(false);
                                        prWin.close();
                                    }
                                    gm.me().store.load();
                                }, //endofsuccess
                                failure: function () {
                                    prWin.setLoading(false);
                                    extjsUtil.failureMessage();
                                }
                            }); //endofajax

                        }
                    }
                }
            }, {
                text   : CMD_CANCEL,
                handler: function () {
                    if (prWin) {
                        prWin.close();
                    }
                }
            }
            ]
        });
        prWin.show();
    },

    modifyUserView: function () {
        var rec = gm.me().grid.getSelectionModel().getSelection()[0];
        console_logs('>>>>>rrr', rec);
        gm.me().sampleTypeStore.load();
        var form = Ext.create('Ext.form.Panel', {
            id         : gu.id('formPanelModify'),
            xtype      : 'form',
            frame      : false,
            border     : false,
            width      : '100%',
            height     : '100%',
            bodyPadding: '3 3 0',
            region     : 'center',
            layout     : 'column',
            items      : [
                {
                    xtype   : 'fieldset',
                    id      : gu.id('modification'),
                    title   : '수정 정보입력',
                    frame   : true,
                    width   : '100%',
                    height  : '100%',
                    layout  : 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items   : [
                        new Ext.form.Hidden({
                            name : 'energyUid',
                            id   : gu.id('unique_id'),
                            value: rec.get('unique_id_long')
                        }),
                        {
                            fieldLabel  : '종류',
                            xtype       : 'combo',
                            anchor      : '100%',
                            allowBlank  : false,
                            store       : this.sampleTypeStore,
                            id          : gu.id('energy_type'),
                            name        : 'energy_type',
                            value       : rec.get('energy_type'),
                            displayField: 'codeName',
                            valueField: 'system_code',
                            listConfig  : {
                                loadingText: 'Searching...',
                                emptyText  : 'No matching posts found.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{systemCode}">{codeName}</div>';
                                }
                            },
                            listeners   : {
                                select: function (combo, record) {
                                    console_logs('asdsadsadsad', record);
                                    gu.getCmp('unit').setValue(record.get('code_name_en'));
                                    // Ext.getCmp('reserved_varchar3').setValue(record.get('address_1'));
                                }// endofselect
                            }
                        }, {
                            fieldLabel  : '단위량',
                            xtype       : 'textfield',
                            anchor      : '100%',
                            allowBlank  : false,
                            store       : this.sampleTypeStore,
                            id          : gu.id('unit'),
                            name        : 'unit',
                            value       : rec.get('unit'),
                            displayField: 'code_name_en',
                            editable    : false
                        }, {
                            fieldLabel: '사용량',
                            xtype     : 'numberfield',
                            anchor    : '100%',
                            allowBlank: true,
                            id        : gu.id('energy_usage'),
                            name      : 'energy_usage',
                            value     : rec.get('energy_usage'),
                            renderer  : function (value, context, tmeta) {
                                return Ext.util.Format.number(value, '0,00/i');
                            },
                        }
                    ]
                },

            ]
        });

        var myWidth = 310;
        var myHeight = 200;

        var prWin = Ext.create('Ext.Window', {
            modal  : true,
            title  : '수정',
            width  : myWidth,
            height : myHeight,
            plain  : true,
            items  : form,
            buttons: [{
                text   : CMD_OK,
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            prWin.setLoading(true);
                            var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                            Ext.Ajax.request({
                                url    : CONTEXT_PATH + '/energy/usage.do?method=energyUsageUpdate',
                                params : val,
                                success: function (result, request) {
                                    if (prWin) {
                                        prWin.setLoading(false);
                                        prWin.close();
                                    }
                                    gm.me().store.load();
                                }, //endofsuccess
                                failure: function () {
                                    prWin.setLoading(false);
                                    extjsUtil.failureMessage();
                                }
                            }); //endofajax
                        }
                    }
                }
            }, {
                text   : CMD_CANCEL,
                handler: function () {
                    if (prWin) {
                        prWin.close();
                    }
                }
            }
            ]
        });
        prWin.show(this, function () {
            var combo = gu.getCmp('unique_id_comdst');
            var val = combo.getValue();
            var record = combo.findRecordByValue(val);
            if (record != null) {
                combo.select(record);
            }

        });
    },

    sampleTypeStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'ENERGY_TYPE'}),

    comcstStore: Ext.create('Mplm.store.ComCstStore', {}),

    roleCodeStore: Ext.create('Mplm.store.UserRoleCodeStore', {}),

    ynStore: Ext.create('Mplm.store.YesnoStore', {})
});