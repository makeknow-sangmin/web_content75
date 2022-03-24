//수리현황
Ext.define('Rfx2.view.gongbang.equipState.WoodenRepareView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'repair-view',
    initComponent: function () {

        this.setDefValue('occ_date', new Date());

        var next7 = gUtil.getNextday(7);
        this.setDefValue('fix_date', next7);

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        // this.addSearchField(
        //     {
        //         field_id: 'mchn_uid'
        //         , store: 'PcsMchnStore'
        //         , displayField: 'name_ko'
        //         , valueField: 'unique_id'
        //         , width: 260
        //         , innerTpl: '<div data-qtip="{mchn_code}">[{mchn_code}] {name_ko}</div>'
        //     });


        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        // PDF
        // buttonToolbar.insert(2, this.printPDFAction); 

        // switch(vCompanyReserved4){

        // case 'DOOS01KR':
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 0 || index == 1 || index == 2 || index == 3 || index == 4) {
                buttonToolbar.items.remove(item);
            }
        });
        // break;
        // default :

        // break;
        // }

        this.addPoAction = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            text: gm.getMC('CMD_Enrollment', '등록'),
            tooltip: '수리내역 등록',
            disable: true,
            handler: function () {
                var form = Ext.create('Ext.form.Panel', {
                    id: 'addPoForm',
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '100%',
                    layout: 'vbox',
                    // overflowY: 'scroll',
                    bodyPadding: 10,
                    items: [
                        {
                            xtype: 'container',
                            collapsible: false,
                            width: '99%',
                            style: 'padding:10px',
                            defaults: {
                                labelStyle: 'padding:10px',
                                anchor: '100%',
                                layout: {
                                    type: 'vbox'
                                }
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    width: '100%',
                                    border: true,
                                    defaultMargins: {
                                        top: 0,
                                        right: 0,
                                        bottom: 0,
                                        left: 10
                                    },
                                    items: [
                                        {
                                            id: gu.id('mold_uid'),
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '목형',
                                            xtype: 'combo',
                                            width: '99%',
                                            name: 'mold_uid',
                                            allowBlank: true,
                                            padding: '0 0 5px 10px',
                                            fieldStyle: 'background-image: none;',
                                            store: gm.me().woodenStore,
                                            emptyText: '선택해주세요.',
                                            displayField: 'item_name',
                                            valueField: 'unique_id',
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{unique_id}">{item_name}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {

                                                }// endofselect
                                            }
                                        },
                                        {
                                            id: gu.id('mcstate'),
                                            name: 'mcstate',
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '목형상태',
                                            xtype: 'combo',
                                            width: '99%',
                                            padding: '0 0 5px 10px',
                                            allowBlank: false,
                                            fieldStyle: 'background-image: none;',
                                            store: gm.me().mcStateStore,
                                            // emptyText: '선택해주세요.',
                                            displayField: 'codeName',
                                            valueField: 'systemCode',
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{systemCode}">{codeName}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {

                                                }// endofselect
                                            }
                                        },
                                        {
                                            id: gu.id('fixtype'),
                                            name: 'fixtype',
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '수리구분',
                                            xtype: 'combo',
                                            width: '99%',
                                            padding: '0 0 5px 10px',
                                            allowBlank: false,
                                            fieldStyle: 'background-image: none;',
                                            store: gm.me().fixTypeStore,
                                            // emptyText: '선택해주세요.',
                                            displayField: 'codeName',
                                            valueField: 'systemCode',
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{systemCode}">{codeName}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {

                                                }// endofselect
                                            }
                                        },
                                        {
                                            id: gu.id('cause_type'),
                                            name: 'cause_type',
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '발생구분',
                                            xtype: 'combo',
                                            width: '99%',
                                            padding: '0 0 5px 10px',
                                            allowBlank: false,
                                            fieldStyle: 'background-image: none;',
                                            store: gm.me().causeTypeStore,
                                            // emptyText: '선택해주세요.',
                                            displayField: 'codeName',
                                            valueField: 'systemCode',
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{systemCode}">{codeName}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {

                                                }// endofselect
                                            }
                                        },

                                        {
                                            xtype: 'textfield',
                                            id: 'occ_reason',
                                            name: 'occ_reason',
                                            padding: '0 0 5px 10px',
                                            width: '99%',
                                            allowBlank: true,
                                            fieldLabel: '발생원인',
                                        },
                                        {
                                            xtype: 'datefield',
                                            id: 'occ_date',
                                            name: 'occ_date',
                                            padding: '0 0 5px 10px',
                                            width: '99%',
                                            allowBlank: true,
                                            fieldLabel: '발생일',
                                            format: 'Y-m-d',
                                            value: new Date()
                                        },
                                        {
                                            xtype: 'datefield',
                                            id: 'fix_date',
                                            name: 'fix_date',
                                            padding: '0 0 5px 10px',
                                            width: '99%',
                                            allowBlank: true,
                                            fieldLabel: '수리일자',
                                            format: 'Y-m-d',
                                            value: new Date()
                                        },
                                        {
                                            xtype: 'numberfield',
                                            id: 'fix_price',
                                            name: 'fix_price',
                                            padding: '0 0 5px 10px',
                                            width: '99%',
                                            allowBlank: true,
                                            minValue: 0,
                                            fieldLabel: '수리비용',
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'fix_desc',
                                            name: 'fix_desc',
                                            padding: '0 0 5px 10px',
                                            width: '99%',
                                            allowBlank: true,
                                            fieldLabel: '조치내역',
                                        }
                                    ]
                                },

                            ]
                        }
                    ]
                });

                var win = Ext.create('Ext.Window', {
                    modal: true,
                    title: gm.me().getMC('mes_order_recv_btn', '수리내역 등록'),
                    width: 600,
                    height: 450,
                    plain: true,
                    items: form,
                    // overflowY: 'scroll',
                    // overflowY: 'scroll',
                    buttons: [{
                        text: CMD_OK,
                        handler: function (btn) {
                            if (btn == "no") {
                                win.close();
                            } else {
                                var form = Ext.getCmp('addPoForm').getForm();
                                if (form.isValid()) {
                                    win.setLoading(true);
                                    var val = form.getValues(false);
                                    form.submit({
                                        submitEmptyText: false,
                                        url: CONTEXT_PATH + '/index/process.do?method=addFixHistory',
                                        success: function (val, action) {
                                            console_logs('val >>>>', val);
                                            win.setLoading(false);
                                            gm.me().store.load();
                                            win.close();
                                        },
                                        failure: function () {
                                            win.setLoading(false);
                                            extjsUtil.failureMessage();
                                            gm.me().store.load();
                                        }
                                    });
                                } else {

                                }
                            }
                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function (btn) {
                            win.close();
                        }
                    }]
                });
                win.show();
            }
        });


        this.editPoAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: this.getMC('mes_order_edit_btn', '수정'),
            tooltip: this.getMC('mes_order_edit_btn_msg', '수정'),
            disabled: true,
            handler: function () {
                var select = gm.me().grid.getSelectionModel().getSelection()[0];
                gm.me().woodenStore.load();
                gm.me().mcStateStore.load();
                gm.me().fixTypeStore.load();
                gm.me().causeTypeStore.load();
                var form = Ext.create('Ext.form.Panel', {
                    id: 'editPoForm',
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '100%',
                    layout: 'column',
                    bodyPadding: 10,
                    items: [
                        {
                            xtype: 'fieldset',
                            collapsible: false,
                            title: gm.me().getMC('mes_order_edit_btn', '공통정보 수정'),
                            width: '100%',
                            style: 'padding:10px',
                            defaults: {
                                labelStyle: 'padding:10px',
                                anchor: '100%',
                                layout: {
                                    type: 'column'
                                }
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    width: '100%',
                                    border: true,
                                    defaultMargins: {
                                        top: 0,
                                        right: 0,
                                        bottom: 0,
                                        left: 10
                                    },
                                    items: [
                                        {
                                            id: gu.id('mold_uid'),
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '목형',
                                            xtype: 'combo',
                                            width: '45%',
                                            name: 'mold_uid',
                                            allowBlank: true,
                                            padding: '0 0 5px 10px',
                                            fieldStyle: 'background-image: none;',
                                            store: gm.me().woodenStore,
                                            emptyText: '선택해주세요.',
                                            displayField: 'item_name',
                                            valueField: 'unique_id',
                                            typeAhead: false,
                                            minChars: 1,
                                            value: select.get('mold_uid'),
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{unique_id}">{item_name}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {

                                                }// endofselect
                                            }
                                        },
                                        {
                                            id: gu.id('mcstate'),
                                            name: 'mcstate',
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '목형상태',
                                            xtype: 'combo',
                                            width: '45%',
                                            padding: '0 0 5px 10px',
                                            allowBlank: false,
                                            fieldStyle: 'background-image: none;',
                                            store: gm.me().mcStateStore,
                                            // emptyText: '선택해주세요.',
                                            displayField: 'codeName',
                                            valueField: 'systemCode',
                                            typeAhead: false,
                                            minChars: 1,
                                            value: select.get('mold_state'),
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{systemCode}">{codeName}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {

                                                }// endofselect
                                            }
                                        },
                                        {
                                            id: gu.id('fixtype'),
                                            name: 'fixtype',
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '수리구분',
                                            xtype: 'combo',
                                            width: '45%',
                                            padding: '0 0 5px 10px',
                                            allowBlank: false,
                                            fieldStyle: 'background-image: none;',
                                            store: gm.me().fixTypeStore,
                                            // emptyText: '선택해주세요.',
                                            displayField: 'codeName',
                                            valueField: 'systemCode',
                                            typeAhead: false,
                                            value: select.get('fixtype'),
                                            minChars: 1,
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{systemCode}">{codeName}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {

                                                }// endofselect
                                            }
                                        },
                                        {
                                            id: gu.id('cause_type'),
                                            name: 'cause_type',
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '발생구분',
                                            xtype: 'combo',
                                            width: '45%',
                                            padding: '0 0 5px 10px',
                                            allowBlank: false,
                                            fieldStyle: 'background-image: none;',
                                            store: gm.me().causeTypeStore,
                                            // emptyText: '선택해주세요.',
                                            displayField: 'codeName',
                                            valueField: 'systemCode',
                                            value: select.get('cause_type'),
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{systemCode}">{codeName}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {

                                                }// endofselect
                                            }
                                        },

                                        {
                                            xtype: 'textfield',
                                            id: 'occ_reason',
                                            name: 'occ_reason',
                                            padding: '0 0 5px 10px',
                                            width: '45%',
                                            allowBlank: true,
                                            value: select.get('occ_reason'),
                                            fieldLabel: '발생원인',
                                        },
                                        {
                                            xtype: 'datefield',
                                            id: 'occ_date',
                                            name: 'occ_date',
                                            padding: '0 0 5px 10px',
                                            width: '45%',
                                            allowBlank: true,
                                            fieldLabel: '발생일',
                                            value: select.get('occ_date'),
                                            format: 'Y-m-d',
                                            value: new Date()
                                        },
                                        {
                                            xtype: 'datefield',
                                            id: 'fix_date',
                                            name: 'fix_date',
                                            padding: '0 0 5px 10px',
                                            width: '45%',
                                            allowBlank: true,
                                            fieldLabel: '수리일자',
                                            value: select.get('fix_date'),
                                            format: 'Y-m-d',
                                            value: new Date()
                                        },
                                        {
                                            xtype: 'numberfield',
                                            id: 'fix_price',
                                            name: 'fix_price',
                                            padding: '0 0 5px 10px',
                                            width: '45%',
                                            allowBlank: true,
                                            value: select.get('fix_price'),
                                            minValue: 0,
                                            fieldLabel: '수리비용',
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'fix_desc',
                                            name: 'fix_desc',
                                            padding: '0 0 5px 10px',
                                            width: '92%',
                                            allowBlank: true,
                                            value: select.get('fix_desc'),
                                            fieldLabel: '조치내역',
                                        }
                                    ]
                                },

                            ]
                        },

                    ]
                });

                var win = Ext.create('Ext.Window', {
                    modal: true,
                    title: gm.me().getMC('mes_order_edit_btn', '수리내역 수정'),
                    width: 650,
                    height: 300,
                    plain: true,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function (btn) {
                            if (btn == "no") {
                                win.close();
                            } else {
                                var form = Ext.getCmp('editPoForm').getForm();
                                if (form.isValid()) {
                                    win.setLoading(true);
                                    var val = form.getValues(false);
                                    form.submit({
                                        url: CONTEXT_PATH + '/index/process.do?method=editFixHistory',
                                        params: {
                                            unique_id: select.get('unique_id_long')
                                        },
                                        success: function (val, action) {
                                            gm.me().store.load();
                                            win.setLoading(false);
                                            win.close();
                                        },
                                        failure: function () {
                                            win.setLoading(false);
                                            extjsUtil.failureMessage();
                                        }
                                    });

                                } else {
                                    Ext.MessageBox.alert('알림', '목형 수정 원인을 확인해주세요.');
                                }
                            }
                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function (btn) {
                            win.close();
                        }
                    }]
                });
                win.show();
            }
        });


        //console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.Repair', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gMain.pageSize/*pageSize*/
            , {}
            , ['pcsmcfix']
        );

        buttonToolbar.insert(0, this.addPoAction);
        buttonToolbar.insert(1, this.editPoAction);
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);


        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });


        this.callParent(arguments);

        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                var rec = selections[0];
                gMain.selPanel.editPoAction.enable();
            } else {
                gMain.selPanel.editPoAction.disable();
            }
        });

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function (records) {
        });
    },
    mcStateStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'MACHINE_STATE'}),
    fixTypeStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'EMC5_FIX_TYPE'}),
    causeTypeStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'EMC5_CAUSE_TYPE'}),
    woodenStore: Ext.create('Rfx.store.WoodenStore', {}),
    // mcStateStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'MACHINE_STATE' }),
    items: []
});

