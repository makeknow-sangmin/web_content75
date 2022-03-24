Ext.define('Rfx2.view.company.hsct.produceMgmt.ProduceMgmtAssyDetailView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'contract-material-view',


    initComponent: function () {
        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;
        useMultitoolbar = false;
        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        //this.addSearchField('unique_id');
        this.setDefComboValue('standard_flag', 'valueField', 'R');
        this.addSearchField('item_name');
        this.addSearchField('specification');
        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();


        (buttonToolbar.items).each(function (item, index, length) {
            if (index !== 0) {
                buttonToolbar.remove(item);
            }
        });


        //부자재 선택시 구분(sg_code) disabled로 이벤트처리
        this.addCallback('STANDARD_FLAG', function (o) {
            console_logs('addCallback>>>>>>>>>', o);
        });

        this.createStore('Rfx2.model.company.bioprotech.ProductMgmtAssy', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gMain.pageSize
            , {
                item_code_dash: 's.item_code',
                comment: 's.comment1'
            },
            ['srcahd']
        );
        var arr = [];
        arr.push(buttonToolbar);

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        arr.push(searchToolbar);

        this.salesPriceListStore = Ext.create('Rfx2.store.company.bioprotech.SalesPriceMgmtStore', {pageSize: 100000});
        this.salesPriceByCompanyListStore = Ext.create('Rfx2.store.company.bioprotech.AanalysisBomStore', {pageSize: 100000});


        this.prEstablishAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: gm.getMC('CMD_Production_Order', '계획수립'),
            tooltip: '생산 계획을 수립합니다!!',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('prEstablishAction'),
            handler: function () {
                gm.me().producePlanOp();
            }
        });

        this.prEstablishActionOrder = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: gm.getMC('CMD_Production_Order', '계획수립'),
            tooltip: '생산 계획을 수립합니다',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('prEstablishActionOrder'),
            handler: function () {
                gm.me().producePlanOpByOrder();
            }
        });

        //grid 생성.
        this.createGrid(arr);

        this.createCrudTab();

        this.grid.flex = 1;

        this.newButtonToolBar = buttonToolbar;
        this.newSearchToolBar = searchToolbar;

        this.produceStore = Ext.create('Mplm.store.ProduceMgmtStore', {pageSize: 100});
        this.produceStore.sorters.removeAll();

        this.purListSrch = Ext.create('Ext.Action', {
            itemId: 'putListSrch',
            iconCls: 'af-search',
            text: CMD_SEARCH/*'검색'*/,
            disabled: false,
            handler: function (widget, event) {
                try {
                    var wa_name = '';

                    if (Ext.getCmp('wa_name').getValue().length > 0) {
                        reserved_varcharh = Ext.getCmp('wa_name').getValue();
                    }
                } catch (e) {

                }
                gm.me().produceStore.getProxy().setExtraParam('wa_name', '%' + wa_name + '%');
                gm.me().produceStore.load();
            }
        });

        this.twoGrid = Ext.create('Rfx2.base.BaseGrid', {
            cls: 'rfx-panel',
            id: gu.id('twoGrid'),
            selModel: 'checkboxmodel',
            store: this.produceStore,
            columns: [
                {
                    text: this.getMC('msg_order_dia_order_customer', '수주번호'),
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'orderNo'
                },
                {
                    text: this.getMC('msg_comcst', '소속'),
                    width: 80,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'division_name'
                },
                {
                    text: this.getMC('msg_sales_price_oem', '고객사'),
                    width: 150,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'wa_name'
                },
                {
                    text: this.getMC('msg_sales_price_oem', '품번'),
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'item_code'
                },
                {
                    text: this.getMC('msg_sales_price_oem', '품명'),
                    width: 150,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'item_name'
                },
                {
                    text: this.getMC('msg_sales_price_oem', '규격'),
                    width: 150,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'specification'
                },
                {
                    text: this.getMC('msg_sales_price_oem', '단위'),
                    width: 80,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'unit_code'
                },
                {
                    text: this.getMC('msg_sales_price_oem', '생산요청량'),
                    width: 100,
                    sortable: true,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'assymap_bm_quan',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                }
            ],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        this.purListSrch,
                        this.prEstablishActionOrder
                    ]
                },
              
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    layout: 'column',
                    defaults: {
                        style: 'margin-top: 1px; margin-bottom: 1px;'
                    },
                    items: [{
                        xtype: 'triggerfield',
                        emptyText: this.getMC('msg_order_dia_order_customer', '고객사'),
                        id: gu.id('wa_name'),
                        width: 130,
                        fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                        name: 'query_sup',
                        listeners: {
                            specialkey: function (field, e) {
                                if (e.getKey() == Ext.EventObject.ENTER) {
                                    gm.me().produceStore.getProxy().setExtraParam('wa_name', '%' + gu.getCmp('wa_name').getValue() + '%');
                                    gm.me().produceStore.load(function () {
                                    });
                                }
                            }
                        },
                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                        'onTrigger1Click': function () {
                            gu.getCmp('wa_name').setValue('');
                            this.produceStore.getProxy().setExtraParam('wa_name', gu.getCmp('wa_name').getValue());
                            this.produceStore.load(function () {
                            });
                        }
                    }]
                }
            ],
            scrollable: true,
            flex: 1,
            bbar: Ext.create('Ext.PagingToolbar', {
                store: this.produceStore,
                displayInfo: true,
                displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                emptyMsg: "표시할 항목이 없습니다.",
                listeners: {
                    beforechange: function (page, currentPage) {
                    }
                }

            }),
            viewConfig: {
                markDirty: false,
                stripeRows: true,
                enableTextSelection: false,
                preserveScrollOnReload: true,

            },
            listeners: {}
        });

        this.produceStore.load();

        var leftContainer = new Ext.container.Container({
            title: this.getMC('msg_sales_price_tab1', '자재기준'),
            region: 'center',
            layout: {
                type: 'border'
            },
            items: [
                this.grid
            ]
        });

        this.twoGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length) {
                    var rec = selections[0];
                    console_logs('rec >>', rec);
                    var ac_uid = rec.get('ac_uid');
                    var child = rec.get('child');
                    gm.me().prEstablishActionOrder.enable();
                    gm.me().salesPriceByCompanyListStore.getProxy().setExtraParam('ver_child', child);
                    gm.me().salesPriceByCompanyListStore.getProxy().setExtraParam('standard_flag', 'A');
                    gm.me().salesPriceByCompanyListStore.load(function (record) {
                    });
                } else {
                    gm.me().prEstablishActionOrder.disable();
                }
            }
        });

        var rightContainer = new Ext.container.Container({
            title: this.getMC('msg_sales_price_tab2', '수주기준'),
            region: 'center',
            layout: {
                type: 'border'
            },
            defaults: {
            },
            items: [
                   this.twoGrid               
            ]
        });

        var mainTab = Ext.widget('tabpanel', {
            layout: 'border',
            border: true,
            region: 'center',
            tabPosition: 'top',
            items: [leftContainer, rightContainer]
        });

        Ext.apply(this, {
            layout: 'border',
            items: mainTab
        });

        //버튼 추가.

        this.callParent(arguments);
        buttonToolbar.insert(1, this.prEstablishAction);
        buttonToolbar.insert(2, this.packageEstablishAction);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                this.prEstablishAction.enable();
                this.prEstablishActionOrder.enable();
            } else {
                this.prEstablishAction.disable();
                this.prEstablishActionOrder.disable();
            }
        });

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.getProxy().setExtraParam('existSalesPrice', 'true');
        this.store.load(function (records) {

        });
    },

    editRedord: function (field, rec) {

        switch (field) {
            case 'sort_order':
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/purchase/material.do?method=updateSortOrder',
                    params: {
                        srcmap_uid: rec.get('unique_id'),
                        srcahd_uid: rec.get('srcahd_uid'),
                        sort_order: rec.get('sort_order')
                    },
                    success: function (result, request) {
                        var resultText = result.responseText;
                        console_log('result:' + resultText);
                        gm.me().getStore().load(function () {
                        });
                        //alert('finished..');
                    },
                    failure: extjsUtil.failureMessage
                });//endof ajax request
                break;
            default:
                gm.editRedord(field, rec);
        }
    },


    producePlanOp: function () {

        var selection = this.grid.getSelectionModel().getSelection()[0];
        console_logs('selection ????', selection);

        var myWidth = 500;
        var myHeight = 280;

        var timeStore = Ext.create('Ext.data.Store', {
            fields: ['time', 'view'],
            data: [
                {"time": "00:00", "view": "00:00"},
                {"time": "01:00", "view": "01:00"},
                {"time": "02:00", "view": "02:00"},
                {"time": "03:00", "view": "03:00"},
                {"time": "04:00", "view": "04:00"},
                {"time": "05:00", "view": "05:00"},
                {"time": "06:00", "view": "06:00"},
                {"time": "07:00", "view": "07:00"},
                {"time": "08:00", "view": "08:00"},
                {"time": "09:00", "view": "09:00"},
                {"time": "10:00", "view": "10:00"},
                {"time": "11:00", "view": "11:00"},
                {"time": "12:00", "view": "12:00"},
                {"time": "13:00", "view": "13:00"},
                {"time": "14:00", "view": "14:00"},
                {"time": "15:00", "view": "15:00"},
                {"time": "16:00", "view": "16:00"},
                {"time": "17:00", "view": "17:00"},
                {"time": "18:00", "view": "18:00"},
                {"time": "19:00", "view": "19:00"},
                {"time": "20:00", "view": "20:00"},
                {"time": "21:00", "view": "21:00"},
                {"time": "22:00", "view": "22:00"},
                {"time": "23:00", "view": "23:00"},
            ]
        });

        var form = Ext.create('Ext.form.Panel', {
            xtype: 'form',
            frame: false,
            border: false,
            autoScroll: true,
            bodyPadding: 10,
            region: 'center',
            layout: 'vbox',
            width: myWidth,
            height: myHeight - 10,
            items: [
                {
                    xtype: 'container',
                    width: '95%',
                    defaults: {
                        width: '99%',
                        padding: '1 2 2 10'
                    },
                    border: true,
                    layout: 'vbox',
                    items: [
                        {
                            fieldLabel: '품번',
                            xtype: 'textfield',
                            name: 'line_item_code',
                            allowBlank: false,
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            id: gu.id('item_code'),
                            editable: false,
                            value: selection.get('item_code')
                        },
                        {
                            fieldLabel: '품명',
                            xtype: 'textfield',
                            name: 'line_code',
                            allowBlank: false,
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            id: gu.id('line_code'),
                            editable: false,
                            value: selection.get('item_name')
                        },
                        {
                            fieldLabel: '규격',
                            xtype: 'textfield',
                            name: 'line_specification',
                            allowBlank: false,
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            id: gu.id('line_specification'),
                            editable: false,
                            value: selection.get('specification')
                        },
                        {
                            xtype: 'datefield',
                            name: 'reserved_timestamp1',
                            id: gu.id('reserved_timestamp1'),
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '생산시작일',
                            hideTrigger: false,
                            value: new Date(),
                            format: 'Y-m-d',
                            keyNavEnabled: true,
                            mouseWheelEnabled: true,
                            editable: true,
                            listeners: {}
                        },
                        {
                            xtype: 'datefield',
                            name: 'end_date',
                            id: gu.id('end_date'),
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '생산종료일',
                            hideTrigger: false,
                            keyNavEnabled: true,
                            format: 'Y-m-d',
                            mouseWheelEnabled: true,
                            editable: true,
                            listeners: {}
                        },
                        {
                            xtype: 'numberfield',
                            name: 'bm_quan',
                            id: gu.id('bm_quan'),
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '생산계획량',
                            hideTrigger: false,
                            keyNavEnabled: true,
                            mouseWheelEnabled: true,
                            editable: true,
                        },
                    ]
                },             
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '생산계획수립',
            width: myWidth,
            height: myHeight,
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
                                    form.submit({
                                        submitEmptyText: false,
                                        url: CONTEXT_PATH + '/index/process.do?method=addPrdPlan',
                                        waitMsg: '데이터를 처리중입니다.<br>잠시만 기다려 주십시오.',
                                        params: {
                                            srcahd_uid: selection.get('unique_id'),
                                            produce_plan_qty: val['bm_quan'],
                                            start_plan_date: val['reserved_timestamp1'],
                                            end_plan_date: val['end_date'],
                                        },
                                        success: function (val, action) {
                                            console_logs('OK', 'PROCESS OK');
                                            if (prWin) {
                                                Ext.MessageBox.alert('확인', '확인 되었습니다.');
                                                prWin.close();
                                                gm.me().store.load();
                                            }
                                        },
                                        failure: function () {
                                            prWin.setLoading(false);
                                            Ext.MessageBox.alert('에러', '데이터 처리중 문제가 발생하였습니다.<br>같은 증상이 지속될 시 시스템 관리자에게 문의 바랍니다.')
                                            if (prWin) {
                                                prWin.close();
                                                gm.me().store.load();
                                            }
                                        }
                                    });
                            }
                        }
                    }
                },
                {
                    text: CMD_CANCEL,
                    scope: this,
                    handler: function () {
                        Ext.MessageBox.alert(
                            '알림',
                            '취소 할 시 입력한 모든정보가 저장되지 않습니다.<br>그래도 취소하시겠습니까?',
                            function () {
                                console_logs('취소', '취소');
                                if (prWin) {
                                    prWin.close();
                                }
                            }
                        )
                    }
                }
            ]
        });
        prWin.show();
    },

    producePlanOpByOrder: function () {
        var twoGridSelection = gm.me().twoGrid.getSelectionModel().getSelection()[0];
        console_logs('selection ????', twoGridSelection);

        var myWidth = 500;
        var myHeight = 280;

        var timeStore = Ext.create('Ext.data.Store', {
            fields: ['time', 'view'],
            data: [
                {"time": "00:00", "view": "00:00"},
                {"time": "01:00", "view": "01:00"},
                {"time": "02:00", "view": "02:00"},
                {"time": "03:00", "view": "03:00"},
                {"time": "04:00", "view": "04:00"},
                {"time": "05:00", "view": "05:00"},
                {"time": "06:00", "view": "06:00"},
                {"time": "07:00", "view": "07:00"},
                {"time": "08:00", "view": "08:00"},
                {"time": "09:00", "view": "09:00"},
                {"time": "10:00", "view": "10:00"},
                {"time": "11:00", "view": "11:00"},
                {"time": "12:00", "view": "12:00"},
                {"time": "13:00", "view": "13:00"},
                {"time": "14:00", "view": "14:00"},
                {"time": "15:00", "view": "15:00"},
                {"time": "16:00", "view": "16:00"},
                {"time": "17:00", "view": "17:00"},
                {"time": "18:00", "view": "18:00"},
                {"time": "19:00", "view": "19:00"},
                {"time": "20:00", "view": "20:00"},
                {"time": "21:00", "view": "21:00"},
                {"time": "22:00", "view": "22:00"},
                {"time": "23:00", "view": "23:00"},
            ]
        });

        var formOrder = Ext.create('Ext.form.Panel', {
            xtype: 'form',
            frame: false,
            border: false,
            autoScroll: true,
            bodyPadding: 10,
            region: 'center',
            layout: 'vbox',
            width: myWidth,
            height: myHeight - 10,
            items: [
                {
                    xtype: 'container',
                    width: '95%',
                    defaults: {
                        width: '99%',
                        padding: '1 2 2 10'
                    },
                    border: true,
                    layout: 'vbox',
                    items: [
                        {
                            fieldLabel: '품번',
                            xtype: 'textfield',
                            name: 'line_item_code',
                            allowBlank: false,
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            id: gu.id('item_code'),
                            editable: false,
                            value: twoGridSelection.get('item_code')
                        },
                        {
                            fieldLabel: '품명',
                            xtype: 'textfield',
                            name: 'line_code',
                            allowBlank: false,
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            id: gu.id('line_code'),
                            editable: false,
                            value: twoGridSelection.get('item_name')
                        },
                        {
                            fieldLabel: '규격',
                            xtype: 'textfield',
                            name: 'line_specification',
                            allowBlank: false,
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            id: gu.id('line_specification'),
                            editable: false,
                            value: twoGridSelection.get('specification')
                        },
                        {
                            fieldLabel: '생산계획량',
                            xtype: 'textfield',
                            name: 'bm_quan',
                            allowBlank: false,
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            id: gu.id('bm_quan'),
                            editable: false,
                            value: twoGridSelection.get('bm_quan'),
                        },
                        {
                            xtype: 'datefield',
                            name: 'start_date',
                            id: gu.id('start_date'),
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '생산시작일',
                            hideTrigger: false,
                            value: new Date(),
                            format: 'Y-m-d',
                            keyNavEnabled: true,
                            mouseWheelEnabled: true,
                            editable: true,
                            listeners: {}
                        },
                        {
                            xtype: 'datefield',
                            name: 'end_date',
                            id: gu.id('end_date'),
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '생산종료일',
                            hideTrigger: false,
                            keyNavEnabled: true,
                            format: 'Y-m-d',
                            mouseWheelEnabled: true,
                            editable: true,
                            listeners: {}
                        },
                    ]
                },            
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '생산계획수립',
            width: myWidth,
            height: myHeight,
            items: formOrder,
            buttons: [
                {
                    text: CMD_OK,
                    handler: function (btn) {
                        if (btn == 'no') {
                            prWin.close();
                        } else {
                            if(formOrder.isValid()){
                                var val = formOrder.getValues(false);
                                formOrder.submit({
                                    submitEmptyText : false,
                                    url : CONTEXT_PATH + '/index/process.do?method=addPrdPlan',
                                    waitMsg: '데이터를 처리중입니다.<br>잠시만 기다려 주십시오.',
                                    params : {
                                        srcahd_uid : twoGridSelection.get('child'),
                                        project_uid : twoGridSelection.get('ac_uid'),
                                        cartmap_uid : twoGridSelection.get('unique_id_long'),
                                        assymap_uid : twoGridSelection.get('assymap_uid'),
                                        comcst_uid : twoGridSelection.get('comcst_uid'),
                                        start_plan_date: val['start_date'],
                                        end_plan_date: val['end_date'],
                                        produce_plan_qty: val['bm_quan']
                                    },
                                    success: function (val, action) {
                                        console_logs('OK', 'PROCESS OK');
                                        if (prWin) {
                                            Ext.MessageBox.alert('확인', '확인 되었습니다.');
                                            prWin.close();
                                            gm.me().produceStore.load();
                                        }
                                    },
                                    failure: function () {
                                        prWin.setLoading(false);
                                        Ext.MessageBox.alert('에러', '데이터 처리중 문제가 발생하였습니다.<br>같은 증상이 지속될 시 시스템 관리자에게 문의 바랍니다.');
                                        if (prWin) {
                                            prWin.close();
                                        }
                                    }
                                })// form
                            }// if 
                        }// else
                    }
                },
                {
                    text: CMD_CANCEL,
                    scope: this,
                    handler: function () {
                        Ext.MessageBox.alert(
                            '알림',
                            '취소 할 시 입력한 모든정보가 저장되지 않습니다.<br>그래도 취소하시겠습니까?',
                            function () {
                                console_logs('취소', '취소');
                                if (prWin) {
                                    prWin.close();
                                }
                            }
                        )
                    }
                }
            ]
        });

        prWin.show();
    },

    renderNumber: function (value, p, record) {
        var isNumber = true;
        if (value == null) {
            value = 0;
        }
        for (var i = 0; i < value.length; i++) {
            var charValue = value.charCodeAt(i);
            if (charValue < 48 || charValue > 57) {
                isNumber = false;
            }
        }

        if (typeof value == 'number' || isNumber) {
            return Ext.util.Format.number(value, '0,00/i');
        } else {
            return value;
        }
    },
    loding_msg: function () {
        Ext.MessageBox.wait('데이터를 처리중입니다.<br>잠시만 기다려주세요.', '알림');
    },
    stop_msg: function () {
        Ext.MessageBox.hide();
    },

    addProUnit: function () {
        var store = gu.getCmp('prodUnitGrid').getStore();
        var selection = gm.me().grid.getSelectionModel().getSelection();
        var rec = selection[0];
        var bm_quan = gu.getCmp('bm_quan').getValue();
        // var bm_quan  = rec.get('unit_mass');
        var store = gu.getCmp('prodUnitGrid').getStore();
        var previous_store = store.data.items;
        var total_quan = 0;

        for (var j = 0; j < previous_store.length; j++) {
            var item = previous_store[j];
            total_quan = Number(total_quan) + Number(item.get('proQuan'));
        }
        console_logs('등록된 total_quan ??? ', total_quan);
        console_logs('차액 ???', Number(bm_quan) - Number(total_quan))
        var diff_price = Number(bm_quan) - Number(total_quan);
        var cnt = store.getCount() + 1;

        store.insert(store.getCount(), new Ext.data.Record({
            'proNumber': cnt,
            'proQuan': diff_price
        }));

        var workStore = gu.getCmp('workGrid').getStore();

        workStore.insert(workStore.getCount(), new Ext.data.Record({
            'workNumber': cnt,
            'workCapa': 0,
            'startDate': null,
            'endDate': null,
            'start_time': null,
            'end_time': null,
            'pcsmchn_uid': null,
            'mchn_code': null,
            'work_site': null
        }));

    },

    searchStore: Ext.create('Rfx2.store.company.kbtech.MaterialStore', {})
});