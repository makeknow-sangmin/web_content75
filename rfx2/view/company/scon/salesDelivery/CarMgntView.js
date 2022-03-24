Ext.define('Rfx2.view.company.scon.salesDelivery.CarMgntView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'carmgnt-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.addSearchField('reserved_varchar4');
        this.addSearchField('reserved_varchar5');
        this.addSearchField('reserved_varchar1');

        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');
        this.addReadonlyField('creator');
        this.addReadonlyField('creator_uid');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            switch (index) {
                case 1: case 2: case 3: case 4:
                    buttonToolbar.items.remove(item);
                    break;
                default:
                    break;
            }
        });

        //모델정의
        this.createStore('Rfx.model.CarMgnt', [{
            property: 'unique_id',
            direction: 'DESC'
        }],
            gMain.pageSize/*pageSize*/
            , {}
            , ['claast']
        );

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

        this.addCarAction = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            text: this.getMC('mes_order_car_btn', '등록'),
            tooltip: this.getMC('mes_order_car_btn_msg', '차량등록'),
            handler: function () {
                var form = Ext.create('Ext.form.Panel', {
                    id: 'addCarForm',
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '100%',
                    layout: 'vbox',
                    bodyPadding: 10,
                    items: [{
                        xtype: 'fieldset',
                        collapsible: false,
                        title: gm.me().getMC('msg_order_dia_header_title', '차량정보를 입력하십시오.'),
                        width: '100%',
                        style: 'padding:10px',
                        defaults: {
                            labelStyle: 'padding:10px',
                            anchor: '100%',
                            layout: {
                                type: 'vbox'
                            }
                        },
                        items: [{
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
                                    xtype: 'textfield',
                                    id: gu.id('reserved_varchar5'),
                                    name: 'reserved_varchar5',
                                    padding: '0 0 5px 30px',
                                    width: '99%',
                                    allowBlank: true,
                                    fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;"></span>' + '차량번호',
                                },
                                {
                                    fieldLabel: '차종 ',
                                    xtype: 'combo',
                                    name: 'egci_code',
                                    id: gu.id('egci_code'),
                                    mode: 'local',
                                    padding: '0 0 5px 30px',
                                    // anchor: '100%',
                                    width: '99%',
                                    editable: true,
                                    displayField: 'code_name_kr',
                                    store: Ext.create('Mplm.store.CarTypeInfoStore'),
                                    // sortInfo: { field: 'wa_code', direction: 'ASC' },
                                    valueField: 'system_code',
                                    allowBlank: true,
                                    listConfig: {
                                        loadingText: 'Searching...',
                                        emptyText: 'No matching posts found.',
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{system_code}">{code_name_kr} (가로:{code_name_en} 세로:{code_name_zh} 높이:{code_name_tw} 허용하중:{code_name_jp})</div>';
                                        }
                                    },
                                    triggerAction: 'all',
                                    listeners: {
                                        change: function (combo, record) {
                                            console_logs('>>> record', combo);
                                        },
                                        render: function (c) {

                                        }
                                    }
                                },
                                {
                                    xtype: 'textfield',
                                    id: gu.id('resserved_varchar1'),
                                    name: 'reserved_varchar1',
                                    padding: '0 0 5px 30px',
                                    width: '99%',
                                    allowBlank: true,
                                    fieldLabel: '상호',
                                },
                                {
                                    xtype: 'textfield',
                                    id: gu.id('reserved_varchar2'),
                                    name: 'reserved_varchar2',
                                    padding: '0 0 5px 30px',
                                    width: '99%',
                                    allowBlank: true,
                                    fieldLabel: '성명',
                                },
                                {
                                    xtype: 'textfield',
                                    id: gu.id('class_name'),
                                    name: 'class_name',
                                    padding: '0 0 5px 30px',
                                    width: '99%',
                                    allowBlank: true,
                                    editable: true,
                                    fieldLabel: '연락처',
                                },
                                {
                                    xtype: 'textfield',
                                    id: gu.id('class_name_eng'),
                                    name: 'class_name_eng',
                                    padding: '0 0 5px 30px',
                                    width: '99%',
                                    allowBlank: true,
                                    editable: true,
                                    fieldLabel: '기타',
                                },
                            ]
                        }] // items 안에 있는 items
                    }] // items
                }); // form 

                var win = Ext.create('Ext.Window', {
                    modal: true,
                    title: gm.me().getMC('mes_order_car_btn', '차량등록'),
                    width: 600,
                    height: 350,
                    plain: true,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function (btn) {
                            if (btn == "no") {
                                win.close();
                            } else {
                                var form = Ext.getCmp('addCarForm').getForm();
                                if (form.isValid()) {
                                    win.setLoading(true);
                                    var val = form.getValues(false);
                                    form.submit({
                                        submitEmptyText: false,
                                        url: CONTEXT_PATH + '/sales/delivery.do?method=addCarInfo',
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
                }) // win
                win.show();
            } // handler 
        }); // addCarAction

        this.editCarAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: this.getMC('mes_order_car_btn', '수정'),
            tooltip: this.getMC('mes_order_car_btn_msg', '수정'),
            disabled : true,
            handler: function () {

                var sel = gm.me().grid.getSelectionModel().getSelection();
                var rec = sel[0];
                var store = Ext.create('Mplm.store.CarTypeInfoStore');
                store.load();

                var form = Ext.create('Ext.form.Panel', {
                    id: 'addCarForm',
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '100%',
                    layout: 'vbox',
                    bodyPadding: 10,
                    items: [{
                        xtype: 'fieldset',
                        collapsible: false,
                        title: gm.me().getMC('msg_order_dia_header_title', '차량정보를 입력하십시오.'),
                        width: '100%',
                        style: 'padding:10px',
                        defaults: {
                            labelStyle: 'padding:10px',
                            anchor: '100%',
                            layout: {
                                type: 'vbox'
                            }
                        },
                        items: [{
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
                                    xtype: 'textfield',
                                    id: gu.id('reserved_varchar5'),
                                    name: 'reserved_varchar5',
                                    padding: '0 0 5px 30px',
                                    width: '99%',
                                    allowBlank: true,
                                    value : rec.get('reserved_varchar5'),
                                    fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;"></span>' + '차량번호',
                                },
                                {
                                    fieldLabel: '차종 ',
                                    xtype: 'combo',
                                    name: 'egci_code',
                                    id: gu.id('egci_code'),
                                    mode: 'local',
                                    padding: '0 0 5px 30px',
                                    // anchor: '100%',
                                    width: '99%',
                                    editable: true,
                                    displayField: 'code_name_kr',
                                    store: store,
                                    // sortInfo: { field: 'wa_code', direction: 'ASC' },
                                    valueField: 'system_code',
                                    allowBlank: true,
                                    value : rec.get('egci_code'),
                                    listConfig: {
                                        loadingText: 'Searching...',
                                        emptyText: 'No matching posts found.',
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{system_code}">{code_name_kr} (가로:{code_name_en} 세로:{code_name_zh} 높이:{code_name_tw} 허용하중:{code_name_jp})</div>';
                                        }
                                    },
                                    triggerAction: 'all',
                                    listeners: {
                                        change: function (combo, record) {
                                            console_logs('>>> record', combo);
                                        },
                                        render: function (c) {

                                        }
                                    }
                                },
                                {
                                    xtype: 'textfield',
                                    id: gu.id('resserved_varchar1'),
                                    name: 'reserved_varchar1',
                                    value : rec.get('reserved_varchar1'),
                                    padding: '0 0 5px 30px',
                                    width: '99%',
                                    allowBlank: true,
                                    fieldLabel: '상호',
                                },
                                {
                                    xtype: 'textfield',
                                    id: gu.id('reserved_varchar2'),
                                    name: 'reserved_varchar2',
                                    value : rec.get('reserved_varchar2'),
                                    padding: '0 0 5px 30px',
                                    width: '99%',
                                    allowBlank: true,
                                    fieldLabel: '성명',
                                },
                                {
                                    xtype: 'textfield',
                                    id: gu.id('class_name'),
                                    name: 'class_name',
                                    value : rec.get('class_name'),
                                    padding: '0 0 5px 30px',
                                    width: '99%',
                                    allowBlank: true,
                                    editable: true,
                                    fieldLabel: '연락처',
                                },
                                {
                                    xtype: 'textfield',
                                    id: gu.id('class_name_eng'),
                                    name: 'class_name_eng',
                                    value : rec.get('class_name_eng'),
                                    padding: '0 0 5px 30px',
                                    width: '99%',
                                    allowBlank: true,
                                    editable: true,
                                    fieldLabel: '기타',
                                },
                            ]
                        }] // items 안에 있는 items
                    }] // items
                }); // form 

                var win = Ext.create('Ext.Window', {
                    modal: true,
                    title: gm.me().getMC('mes_order_car_btn', '수정'),
                    width: 600,
                    height: 350,
                    plain: true,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function (btn) {
                            if (btn == "no") {
                                win.close();
                            } else {
                                var form = Ext.getCmp('addCarForm').getForm();
                                if (form.isValid()) {
                                    win.setLoading(true);
                                    var val = form.getValues(false);
                                    form.submit({
                                        submitEmptyText: false,
                                        url: CONTEXT_PATH + '/sales/delivery.do?method=editCarInfo',
                                        params: {
                                            unique_id: rec.get('unique_id_long')
                                        },
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
                }) // win
                win.show();
            } // handler 
        }); // addCarAction

        buttonToolbar.insert(1, this.addCarAction);
        buttonToolbar.insert(2, this.editCarAction);


        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                var rec = selections[0];
                console_logs('여기', rec);
                gm.me().editCarAction.enable();
            } else {
                gm.me().editCarAction.disable();
            }
        });
        this.callParent(arguments);
        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function (records) { });
    },
    items: []
});
