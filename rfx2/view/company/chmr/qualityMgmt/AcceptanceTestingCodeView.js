Ext.define('Rfx2.view.company.chmr.qualityMgmt.AcceptanceTestingCodeView', {
    extend: 'Rfx2.base.BaseView',
    xtype : 'general-code-view',
    //items: [{html: 'Rfx.view.criterionInfo.CodeView'}],
    initComponent: function () {
        //검색툴바 필드 초기화
        this.initSearchField();
        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id_long');
        this.addReadonlyField('create_date');
        //검색툴바 생성
        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');
        var searchToolbar = this.createSearchToolbar();
        // 툴바 버튼 옵션 설정
        var removeButtons = ['EXCEL', 'REGIST', 'EDIT', 'REMOVE', 'COPY'];
        var toolbarOptions = {'REMOVE_BUTTONS': removeButtons};
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar(toolbarOptions);
        // 메인 스토어 생성
        this.createStore('Rfx.model.readSimpleMaterial', [
                {
                    property : 'unique_id',
                    direction: 'desc'
                }],
            gMain.pageSize/*pageSize*/,
            {},
            ['srcahd']
        );
        this.store.getProxy().setExtraParam('standard_flag', 'R');
        this.store.getProxy().setExtraParam('orderBy', 'unique_id');
        this.store.getProxy().setExtraParam('ascDesc', 'desc');
        // 서브그리드 스토어 생성
        this.generalCodeDetailStore = Ext.create('Mplm.store.SpcColumnSearchStore', {});
        // 입력, 수정창에 사용할 스토어 생성
        var roleCodeStore = Ext.create('Mplm.store.RoleCodeStore', {});
        Ext.define('Temp.store.useYnStore', {
            extend : 'Ext.data.Store',
            storeId: 'useYnStore',
            fields : [
                "diplay",
                "value"
            ],
            data   : [
                {
                    diplay: 'Y',
                    value : 'Y'
                },
                {
                    diplay: 'N',
                    value : 'N'
                }
            ]

        });
        var leftContainer = new Ext.container.Container({
            title: gm.getMC('CMD_Item_Standard', '품목기준'),
            region: 'center',
            layout: {
                type: 'border'
            },
            defaults: {
                collapsible: true,
                split: true
            },
            items: [
                {
                    collapsible: false,
                    frame: false,
                    region: 'west',
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    flex: 0.85,
                    items: [this.grid]
                },
                {
                    collapsible: false,
                    frame: false,
                    region: 'center',
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    flex: 1,
                    items: [this.gridGeneralCodeChilds]
                }
            ]
        });

        var useYnStore = Ext.create('Temp.store.useYnStore', {});

        this.addChildCodeBtn = Ext.create('Ext.Action', {
            xtype   : 'button',
            iconCls : 'af-plus',
            text    : gm.getMC('CMD_Enrollment', '등록'),
            tooltip : '코드정보 등록',
            disabled: true,
            hidden  : gu.setCustomBtnHiddenProp('addChildCodeBtn'),
            handler : function () {
                // 선택한 system_code 정보 가져오기
                var selections = gm.me().grid.getSelectionModel().getSelected().items[0];
                console_logs('코드정보 등록입니다', selections.get('unique_id_long'));
                if (selections.get('state') !== 'A') {
                    console_logs('parent_system_code AKA selected_system_code', selections.get('system_code'));
                    // 추가 제품을 등록하기 위한 parent_system_code
                    var parent_system_code = selections.get('system_code');

                    var childCodeForm = Ext.create('Ext.form.Panel', {
                        xtype      : 'form',
                        width      : 450,
                        bodyPadding: 15,
                        layout     : {
                            type : 'vbox',
                            align: 'stretch'
                        }, defaults: {
                            allowBlank: true,
                            msgTarget : 'side',
                            labelWidth: 120
                        },
                        items      : [
                            new Ext.form.Hidden({
                                name: 'supast_uid',
                                id: gu.id('supast_uid'),
                            }),
                            {
                                xtype     : 'fieldcontainer',
                                fieldLabel: '공급사',
                                anchor    : '99%',
                                width     : '90%',
                                // padding   : '0 0 5px 30px',
                                // height: '10%',
                                layout  : 'hbox',
                                defaults: {
                                    margin: '2 2 2 2'
                                },
                                items   : [
                                    {
                                        id  : gu.id('supplier_name'),
                                        name: 'supplier_name',
                                        // fieldLabel: gm.me().getMC('msg_order_dia_order_customer', '고객명'),
                                        allowBlank: true,
                                        xtype     : 'textfield',
                                        width     : 185,
                                        editable  : false,
                                        // padding: '0 0 5px 30px',
                                        fieldStyle: 'background-color: #FFFCCC;',
                                        // store: gm.me().combstStore,
                                        emptyText   : '',
                                        displayField: 'wa_name',
                                        valueField  : 'unique_id',
                                        sortInfo    : {field: 'wa_name', direction: 'ASC'},
                                        typeAhead   : false,
                                        minChars    : 1,
                                        listConfig  : {
                                            loadingText: 'Searching...',
                                            emptyText  : 'No matching posts found.',
                                            getInnerTpl: function () {
                                                return '<div data-qtip="{unique_id}">{wa_name} / {president_name} ({biz_no})</div>';
                                            }
                                        },
                                        listeners   : {
                                            change: function (combo, record) {

                                            }// endofselect
                                        }
                                    },
                                    {
                                        xtype: 'button',
                                        text : '클릭',
                                        width: 80,
                                        // margin: '0 10 10 380',
                                        scale  : 'small',
                                        handler: function () {
                                            gm.me().selectCombst();
                                        }
                                    },
                                ]
                            },
                            {
                                fieldLabel: '검사항목',
                                xtype     : 'textfield',
                                id        : gu.id('legend_code_kr'),
                                name      : 'legend_code_kr',
                                width     : 185,
                            },
                            {
                                fieldLabel: '단위',
                                xtype     : 'textfield',
                                id        : gu.id('unit_name'),
                                name      : 'unit_name',
                                width     : 185,
                            },
                            {
                                fieldLabel: '기준치',
                                xtype     : 'textfield',
                                id        : gu.id('baseline'),
                                name      : 'baseline',
                                width     : 185,
                            },
                            {
                                fieldLabel: '순번',
                                xtype     : 'textfield',
                                id        : gu.id('order_number'),
                                name      : 'order_number',
                                width     : 185,
                            }
                        ],
                    });

                    var win = Ext.create('Ext.Window', {
                        modal  : true,
                        title  : '등록',
                        width  : 450,
                        height : 250,
                        plain  : true,
                        items  : childCodeForm,
                        buttons: [{
                            text   : CMD_OK,
                            handler: function (btn) {
                                if (btn == "no") {
                                    win.close();
                                } else {
                                    var form = childCodeForm;
                                    if (form.isValid()) {
                                        var val = form.getValues(false);
                                        // 등록 함수 호출
                                        gm.me().addChildCode(val, win);

                                    }
                                }
                            }
                        }, {
                            text   : CMD_CANCEL,
                            handler: function (btn) {
                                win.close();
                            }
                        }]
                    });
                    win.show();
                } else {
                    // Ext.MessageBox.alert('알림', '승인된 상태의 견적서는 수정이 불가합니다.')
                }
            }
        });

        // 하위 코드 수정 버튼
        this.updateChildCodeBtn = Ext.create('Ext.Action', {
            xtype   : 'button',
            iconCls : 'af-edit',
            text    : gm.getMC('CMD_MODIFY', '수정'),
            tooltip : '하위 코드 수정',
            disabled: true,
            hidden  : gu.setCustomBtnHiddenProp('updateChildCodeBtn'),
            handler : function () {
                // 메인 그리드에서 선택한 system_code 정보 가져오기
                var selections = gm.me().grid.getSelectionModel().getSelected().items[0];
                // 서브 그리드에서 선택한 한행의 정보를 다 가져오는 것
                var selectionFromChild = gm.me().gridGeneralCodeChilds.getSelectionModel().getSelection()[0];
        
                // if (selesctions.length > 0) {
                var form = Ext.create('Ext.form.Panel', {
                    xtype      : 'form',
                    width      : 450,
                    bodyPadding: 15,
                    layout     : {
                        type : 'vbox',
                        align: 'stretch'
                    }, defaults: {
                        allowBlank: true,
                        msgTarget : 'side',
                        labelWidth: 120
                    }, items   : [
                        new Ext.form.Hidden({
                            name: 'supast_uid',
                            id: gu.id('supast_uid'),
                        }),
                        {
                            xtype     : 'fieldcontainer',
                            fieldLabel: '공급사',
                            anchor    : '99%',
                            width     : '90%',
                            // padding   : '0 0 5px 30px',
                            // height: '10%',
                            layout  : 'hbox',
                            defaults: {
                                margin: '2 2 2 2'
                            },
                            items   : [
                                {
                                    id  : gu.id('supplier_name'),
                                    name: 'supplier_name',
                                    // fieldLabel: gm.me().getMC('msg_order_dia_order_customer', '고객명'),
                                    allowBlank: true,
                                    xtype     : 'textfield',
                                    width     : 185,
                                    editable  : false,
                                    // padding: '0 0 5px 30px',
                                    fieldStyle: 'background-color: #FFFCCC;',
                                    // store: gm.me().combstStore,
                                    emptyText   : '',
                                    displayField: 'wa_name',
                                    valueField  : 'unique_id',
                                    value : selectionFromChild.get('supplier_name'),
                                    sortInfo    : {field: 'wa_name', direction: 'ASC'},
                                    typeAhead   : false,
                                    minChars    : 1,
                                    listConfig  : {
                                        loadingText: 'Searching...',
                                        emptyText  : 'No matching posts found.',
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{unique_id}">{wa_name} / {president_name} ({biz_no})</div>';
                                        }
                                    },
                                    listeners   : {
                                        change: function (combo, record) {

                                        }// endofselect
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text : '클릭',
                                    width: 80,
                                    // margin: '0 10 10 380',
                                    scale  : 'small',
                                    handler: function () {
                                        gm.me().selectCombst();
                                    }
                                },
                            ]
                        },
                        {
                            fieldLabel: '검사항목',
                            xtype     : 'textfield',
                            id        : gu.id('legend_code_kr'),
                            name      : 'legend_code_kr',
                            value     : selectionFromChild.get('legend_code_kr')
                        },
                        {
                            fieldLabel: '단위',
                            xtype     : 'textfield',
                            id        : gu.id('unit_name'),
                            name      : 'unit_name',
                            value     : selectionFromChild.get('unit_name')
                        },
                        {
                            fieldLabel: '기준치',
                            xtype     : 'textfield',
                            id        : gu.id('baseline'),
                            name      : 'baseline',
                            value     : selectionFromChild.get('baseline')
                        },
                        {
                            fieldLabel: '순번',
                            xtype     : 'textfield',
                            id        : gu.id('order_number'),
                            name      : 'order_number',
                            value     : selectionFromChild.get('order_number')
                        }
                    ]

                });

                roleCodeStore.load();

                var winPart = Ext.create('Ext.Window', {
                    modal  : true,
                    title  : '하위코드 수정',
                    width  : 450,
                    height : 250,
                    plain  : true,
                    items  : form,
                    buttons: [{
                        text   : CMD_OK,
                        handler: function (btn) {
                            if (btn == "no") {
                                winPart.close();
                            } else {
                                if (form.isValid()) {
                                    winPart.setLoading(true);
                                    var val = form.getValues(false);
                                    var unique_id = selectionFromChild.get('unique_id_long');
                                    console_logs('unique_id', unique_id)
                                    // 수정 함수 호출
                                    gm.me().updateChildCode(val, unique_id, winPart);
                                }
                            }
                        }
                    }, {
                        text   : CMD_CANCEL,
                        handler: function (btn) {
                            if (winPart) {
                                winPart.close();
                            }
                        }
                    }]
                });
                winPart.show();
            }
        });

        //체가름성적 항목 등록
        this.addGranularityCodeBtn = Ext.create('Ext.Action', {
            xtype   : 'button',
            iconCls : 'af-plus',
            text    : gm.getMC('CMD_Enrollment', '등록'),
            tooltip : '코드정보 등록',
            disabled: true,
            hidden  : gu.setCustomBtnHiddenProp('addChildCodeBtn'),
            handler : function () {
                // 선택한 system_code 정보 가져오기
                var selections = gm.me().twoGrid.getSelectionModel().getSelected().items[0];
                console_logs('코드정보 등록입니다', selections.get('unique_id_long'));
                if (selections.get('state') !== 'A') {
                    console_logs('parent_system_code AKA selected_system_code', selections.get('system_code'));
                    // 추가 제품을 등록하기 위한 parent_system_code
                    var parent_system_code = selections.get('system_code');

                    var childCodeForm = Ext.create('Ext.form.Panel', {
                        xtype      : 'form',
                        width      : 450,
                        bodyPadding: 15,
                        layout     : {
                            type : 'vbox',
                            align: 'stretch'
                        }, defaults: {
                            allowBlank: true,
                            msgTarget : 'side',
                            labelWidth: 120
                        },
                        items      : [
                            new Ext.form.Hidden({
                                name: 'supast_uid',
                                id: gu.id('supast_uid'),
                            }),
                            {
                                xtype     : 'fieldcontainer',
                                fieldLabel: '공급사',
                                anchor    : '99%',
                                width     : '90%',
                                // padding   : '0 0 5px 30px',
                                // height: '10%',
                                layout  : 'hbox',
                                defaults: {
                                    margin: '2 2 2 2'
                                },
                                items   : [
                                    {
                                        id  : gu.id('supplier_name'),
                                        name: 'supplier_name',
                                        // fieldLabel: gm.me().getMC('msg_order_dia_order_customer', '고객명'),
                                        allowBlank: true,
                                        xtype     : 'textfield',
                                        width     : 185,
                                        editable  : false,
                                        // padding: '0 0 5px 30px',
                                        fieldStyle: 'background-color: #FFFCCC;',
                                        // store: gm.me().combstStore,
                                        emptyText   : '',
                                        displayField: 'wa_name',
                                        valueField  : 'unique_id',
                                        sortInfo    : {field: 'wa_name', direction: 'ASC'},
                                        typeAhead   : false,
                                        minChars    : 1,
                                        listConfig  : {
                                            loadingText: 'Searching...',
                                            emptyText  : 'No matching posts found.',
                                            getInnerTpl: function () {
                                                return '<div data-qtip="{unique_id}">{wa_name} / {president_name} ({biz_no})</div>';
                                            }
                                        },
                                        listeners   : {
                                            change: function (combo, record) {

                                            }// endofselect
                                        }
                                    },
                                    {
                                        xtype: 'button',
                                        text : '클릭',
                                        width: 80,
                                        // margin: '0 10 10 380',
                                        scale  : 'small',
                                        handler: function () {
                                            gm.me().selectCombst();
                                        }
                                    },
                                ]
                            },
                            {
                                fieldLabel: '체크기',
                                xtype     : 'textfield',
                                id        : gu.id('unit_name'),
                                name      : 'unit_name',
                                width     : 185,
                            },
                            {
                                fieldLabel: '시방범위',
                                xtype     : 'textfield',
                                id        : gu.id('baseline'),
                                name      : 'baseline',
                                width     : 185,
                            },
                            {
                                fieldLabel: '순번',
                                xtype     : 'textfield',
                                id        : gu.id('order_number'),
                                name      : 'order_number',
                                width     : 185,
                            }
                        ],
                    });

                    var win = Ext.create('Ext.Window', {
                        modal  : true,
                        title  : '등록',
                        width  : 450,
                        height : 250,
                        plain  : true,
                        items  : childCodeForm,
                        buttons: [{
                            text   : CMD_OK,
                            handler: function (btn) {
                                if (btn == "no") {
                                    win.close();
                                } else {
                                    var form = childCodeForm;
                                    if (form.isValid()) {
                                        var val = form.getValues(false);
                                        // 등록 함수 호출
                                        gm.me().addGranularity(val, win);

                                    }
                                }
                            }
                        }, {
                            text   : CMD_CANCEL,
                            handler: function (btn) {
                                win.close();
                            }
                        }]
                    });
                    win.show();
                } else {
                    // Ext.MessageBox.alert('알림', '승인된 상태의 견적서는 수정이 불가합니다.')
                }
            }
        });

        // 체가름 하위 코드 수정 버튼
        this.updateGranularity = Ext.create('Ext.Action', {
            xtype   : 'button',
            iconCls : 'af-edit',
            text    : gm.getMC('CMD_MODIFY', '수정'),
            tooltip : '하위 코드 수정',
            disabled: true,
            hidden  : gu.setCustomBtnHiddenProp('updateChildCodeBtn'),
            handler : function () {
                // 메인 그리드에서 선택한 system_code 정보 가져오기
                var selections = gm.me().twoGrid.getSelectionModel().getSelected().items[0];
                // 서브 그리드에서 선택한 한행의 정보를 다 가져오는 것
                var selectionFromChild = gm.me().gridGeneralCodeChildss.getSelectionModel().getSelection()[0];
        
                // if (selesctions.length > 0) {
                var form = Ext.create('Ext.form.Panel', {
                    xtype      : 'form',
                    width      : 450,
                    bodyPadding: 15,
                    layout     : {
                        type : 'vbox',
                        align: 'stretch'
                    }, defaults: {
                        allowBlank: true,
                        msgTarget : 'side',
                        labelWidth: 120
                    }, items   : [
                        new Ext.form.Hidden({
                            name: 'supast_uid',
                            id: gu.id('supast_uid'),
                        }),
                        {
                            xtype     : 'fieldcontainer',
                            fieldLabel: '공급사',
                            anchor    : '99%',
                            width     : '90%',
                            // padding   : '0 0 5px 30px',
                            // height: '10%',
                            layout  : 'hbox',
                            defaults: {
                                margin: '2 2 2 2'
                            },
                            items   : [
                                {
                                    id  : gu.id('supplier_name'),
                                    name: 'supplier_name',
                                    // fieldLabel: gm.me().getMC('msg_order_dia_order_customer', '고객명'),
                                    allowBlank: true,
                                    xtype     : 'textfield',
                                    width     : 185,
                                    editable  : false,
                                    // padding: '0 0 5px 30px',
                                    fieldStyle: 'background-color: #FFFCCC;',
                                    // store: gm.me().combstStore,
                                    emptyText   : '',
                                    displayField: 'wa_name',
                                    valueField  : 'unique_id',
                                    value : selectionFromChild.get('supplier_name'),
                                    sortInfo    : {field: 'wa_name', direction: 'ASC'},
                                    typeAhead   : false,
                                    minChars    : 1,
                                    listConfig  : {
                                        loadingText: 'Searching...',
                                        emptyText  : 'No matching posts found.',
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{unique_id}">{wa_name} / {president_name} ({biz_no})</div>';
                                        }
                                    },
                                    listeners   : {
                                        change: function (combo, record) {

                                        }// endofselect
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text : '클릭',
                                    width: 80,
                                    // margin: '0 10 10 380',
                                    scale  : 'small',
                                    handler: function () {
                                        gm.me().selectCombst();
                                    }
                                },
                            ]
                        },
                        {
                            fieldLabel: '검사항목',
                            xtype     : 'textfield',
                            id        : gu.id('legend_code_kr'),
                            name      : 'legend_code_kr',
                            value     : selectionFromChild.get('legend_code_kr')
                        },
                        {
                            fieldLabel: '단위',
                            xtype     : 'textfield',
                            id        : gu.id('unit_name'),
                            name      : 'unit_name',
                            value     : selectionFromChild.get('unit_name')
                        },
                        {
                            fieldLabel: '기준치',
                            xtype     : 'textfield',
                            id        : gu.id('baseline'),
                            name      : 'baseline',
                            value     : selectionFromChild.get('baseline')
                        },
                        {
                            fieldLabel: '순번',
                            xtype     : 'textfield',
                            id        : gu.id('order_number'),
                            name      : 'order_number',
                            value     : selectionFromChild.get('order_number')
                        }
                    ]

                });

                roleCodeStore.load();

                var winPart = Ext.create('Ext.Window', {
                    modal  : true,
                    title  : '하위코드 수정',
                    width  : 450,
                    height : 250,
                    plain  : true,
                    items  : form,
                    buttons: [{
                        text   : CMD_OK,
                        handler: function (btn) {
                            if (btn == "no") {
                                winPart.close();
                            } else {
                                if (form.isValid()) {
                                    winPart.setLoading(true);
                                    var val = form.getValues(false);
                                    var unique_id = selectionFromChild.get('unique_id_long');
                                    console_logs('unique_id', unique_id)
                                    // 수정 함수 호출
                                    gm.me().updateChildCode(val, unique_id, winPart);
                                }
                            }
                        }
                    }, {
                        text   : CMD_CANCEL,
                        handler: function (btn) {
                            if (winPart) {
                                winPart.close();
                            }
                        }
                    }]
                });
                winPart.show();
            }
        });

        // 체가름성적 항목 하위 코드 삭제 버튼
        this.deleteGranularity= Ext.create('Ext.Action', {
            xtype   : 'button',
            iconCls : 'af-remove',
            text    : gm.getMC('CMD_DELETE', '삭제'),
            tooltip : '선택한 하위 코드 삭제',
            disabled: true,
            hidden  : gu.setCustomBtnHiddenProp('deleteChildCodeBtn'),
            handler : function () {
                Ext.MessageBox.show({
                    title  : '하위 코드 삭제',
                    msg    : '선택한 코드 정보를 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn     : function (btn) {
                        if (btn == 'yes') {

                            var selectionFromChild = gm.me().gridGeneralCodeChildss.getSelectionModel().getSelection()[0];

                            Ext.Ajax.request({
                                url    : CONTEXT_PATH + '/xdview/spcMgmt.do?method=destroy',
                                params : {
                                    unique_id: selectionFromChild.get('unique_id_long')
                                },
                                success: function (result, request) {
                                    var resultText = result.responseText;
                                    console_log('result:' + resultText);
                                    gm.me().store.load();
                                    gm.me().generalCodeDetailStore.load();
                                },
                                failure: extjsUtil.failureMessage
                            });

                        }
                    },
                    icon   : Ext.MessageBox.QUESTION
                });
            }
        });

        // 하위 코드 삭제 버튼
        this.deleteChildCodeBtn = Ext.create('Ext.Action', {
            xtype   : 'button',
            iconCls : 'af-remove',
            text    : gm.getMC('CMD_DELETE', '삭제'),
            tooltip : '선택한 하위 코드 삭제',
            disabled: true,
            hidden  : gu.setCustomBtnHiddenProp('deleteChildCodeBtn'),
            handler : function () {
                Ext.MessageBox.show({
                    title  : '하위 코드 삭제',
                    msg    : '선택한 코드 정보를 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn     : function (btn) {
                        if (btn == 'yes') {

                            var selectionFromChild = gm.me().gridGeneralCodeChilds.getSelectionModel().getSelection()[0];

                            Ext.Ajax.request({
                                url    : CONTEXT_PATH + '/xdview/spcMgmt.do?method=destroy',
                                params : {
                                    unique_id: selectionFromChild.get('unique_id_long')
                                },
                                success: function (result, request) {
                                    var resultText = result.responseText;
                                    console_log('result:' + resultText);
                                    gm.me().store.load();
                                    gm.me().generalCodeDetailStore.load();
                                },
                                failure: extjsUtil.failureMessage
                            });

                        }
                    },
                    icon   : Ext.MessageBox.QUESTION
                });
            }
        });

        this.loadOtherCode = Ext.create('Ext.Action', {
            xtype   : 'button',
            iconCls : 'af-plus',
            text    : '타 품목 설정목록 불러오기',
            tooltip : '관리선 항목이 존재하는 품목의 검사항목을 불러온 후 자동등록을 합니다.',
            disabled: true,
            handler : function () {
                // 선택한 system_code 정보 가져오기
                var selections = gm.me().grid.getSelectionModel().getSelected().items[0];
                console_logs('코드정보 등록입니다', selections.get('unique_id_long'));
                var childCodeForm = Ext.create('Ext.form.Panel', {
                    xtype      : 'form',
                    // width      : 500,
                    id : 'loadForm',
                    bodyPadding: 10,
                    region       : 'center',
                    layout       : 'form',
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget : 'side'
                    },
                    items      : [
                        {
                            xtype: 'fieldset',
                            title: '관리선 항목이 존재하는 품목을 선택 후 확인을 클릭하여 등록하십시오.<br>이미 등록된 건의 대한 목록 불러오기는 불가합니다.',
                            items: [
                                {
                                    xtype       : 'combo',
                                    fieldLabel  : '품목선택',
                                    id          : gu.id('uid_srcahd'),
                                    anchor      : '97%',
                                    store       : gm.me().existMgmtLineStore,
                                    name        : 'srcahd_uid',
                                    valueField  : 'unique_id_long',
                                    minChars    : 1,
                                    allowBlank  : false,
                                    displayField: 'item_name',
                                    emptyText   : '선택해주세요.',
                                    listConfig  : {
                                        loadingText: '검색중...',
                                        emptyText  : '일치하는 항목 없음',
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{unique_id_long}">{item_name} {specification}</div>';
                                        }
                                    }
                                },
                            ]
                        }
                    ],
                });

                var win = Ext.create('Ext.Window', {
                    modal  : true,
                    title  : '불러오기',
                    width  : 500,
                    height : 200,
                    plain  : true,
                    items  : childCodeForm,
                    buttons: [{
                        text   : CMD_OK,
                        handler: function (btn) {
                            if (btn == "no") {
                                win.close();
                            } else {
                                var form = childCodeForm;
                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                    var add_uid_srcahd = selections.get('unique_id_long');
                                    var copy_uid_srcahd = val['srcahd_uid'];
                                    Ext.Ajax.request({
                                        url    : CONTEXT_PATH + '/xdview/spcMgmt.do?method=copyMgmtColumn',
                                        params : {
                                            add_uid_srcahd : add_uid_srcahd,
                                            copy_uid_srcahd : copy_uid_srcahd
                                        },
                                        success: function (result) {
                                            let resultText = result.responseText;
                                            if (win) {
                                                Ext.MessageBox.alert('알림','불러오기 처리가 완료되었습니다.')
                                                win.close();
                                            }
                                            gm.me().getStore().load(function () {
                                            });
                                            gm.me().generalCodeDetailStore.load();
                                        },
                                        failure: extjsUtil.failureMessage
                                    });//endof ajax request
                                }
                            }
                        }
                    }, {
                        text   : CMD_CANCEL,
                        handler: function (btn) {
                            win.close();
                        }
                    }]
                });
                win.show();
            }
        });

        // 오른쪽단 그리드
        this.gridGeneralCodeChilds = Ext.create('Ext.grid.Panel', {
            cls        : 'rfx-panel',
            id         : gu.id('gridGeneralCodeChilds'),
            store      : this.generalCodeDetailStore,
            viewConfig : {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            region     : 'center',
            autoScroll : true,
            autoHeight : true,
            flex       : 0.5,
            frame      : true,
            bbar       : getPageToolbar(this.generalCodeDetailStore),
            border     : true,
            layout     : 'fit',
            forceFit   : false,
            selModel   : Ext.create("Ext.selection.CheckboxModel", {}),
            margin     : '0 0 0 0',
            dockedItems: [
                {
                    dock : 'top',
                    xtype: 'toolbar',
                    items: [
                        this.addChildCodeBtn,
                        this.updateChildCodeBtn,
                        this.deleteChildCodeBtn,
                        this.loadOtherCode
                    ]
                }
            ],
            columns    : [
                {text: '순번', width: 130, style: 'text-align:center', dataIndex: 'order_number', sortable: false},
                {text: '검사항목', width: 130, style: 'text-align:center', dataIndex: 'legend_code_kr', sortable: false},
                {text: '단위', width: 130, style: 'text-align:center', dataIndex: 'unit_name', sortable: false},
                {text: '기준치', width: 130, style: 'text-align:center', dataIndex: 'baseline', sortable: false},
                {text: '공급사', width: 130, style: 'text-align:center', dataIndex: 'supplier_name', sortable: false},

            ],
            title      : '분류 목록',
            name       : 'po',
            autoScroll : true
        });

        this.gridGeneralCodeChilds.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections) {
                    console_logs('----------selection : ', selections);
                }
            }
        });

        this.gridGeneralCodeChildss = Ext.create('Ext.grid.Panel', {
            cls        : 'rfx-panel',
            id         : gu.id('gridGeneralCodeChildss'),
            store      : this.generalCodeDetailStore,
            viewConfig : {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            region     : 'center',
            autoScroll : true,
            autoHeight : true,
            flex       : 0.5,
            frame      : true,
            bbar       : getPageToolbar(this.generalCodeDetailStore),
            border     : true,
            layout     : 'fit',
            forceFit   : false,
            selModel   : Ext.create("Ext.selection.CheckboxModel", {}),
            margin     : '0 0 0 0',
            dockedItems: [
                {
                    dock : 'top',
                    xtype: 'toolbar',
                    items: [
                        this.addGranularityCodeBtn,
                        this.updateGranularity,
                        this.deleteGranularity
                    ]
                }
            ],
            columns    : [
                {text: '순번', width: 130, style: 'text-align:center', dataIndex: 'order_number', sortable: false},
                {text: '단위', width: 130, style: 'text-align:center', dataIndex: 'unit_name', sortable: false},
                {text: '기준치', width: 130, style: 'text-align:center', dataIndex: 'baseline', sortable: false},
                {text: '공급사', width: 130, style: 'text-align:center', dataIndex: 'supplier_name', sortable: false},

            ],
            title      : '체가름 성적 분류',
            name       : 'po',
            autoScroll : true
        });


        //그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성
        this.createGrid(arr);
        this.createCrudTab();

        this.grid.flex = 1;

        this.aggregateMatStore = Ext.create('Rfx2.store.company.chmr.AggregateMatStore', { pageSize: 100 });
        this.aggregateMatStore.load();

        this.twoGrid = Ext.create('Rfx2.base.BaseGrid', {
            cls: 'rfx-panel',
            id: gu.id('twoGrid'),
            selModel: 'checkboxmodel',
            store: this.aggregateMatStore,
            columns: [
                {
                    text: '자재코드',
                    width: 150,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'item_code'
                },
                {
                    text: '품명',
                    width: 150,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'item_name'
                },
                {
                    text: '규격',
                    width: 150,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'specification',
                },
            ],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        // this.purListSrch,
                    ]
                },
            ],
            scrollable: true,
            flex: 1,
            bbar: Ext.create('Ext.PagingToolbar', {
                store: this.combstStore,
                displayInfo: true,
                displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                emptyMsg: "표시할 항목이 없습니다.",
                listeners: {
                    beforechange: function (page, currentPage) {
                        // console_logs('여기++++++++++++++++++++++++++++++++++++++++ : ', record);
                    }
                }
            }),
        });

        // 체가름 성적서 왼쪽 메인 그리드
        this.twoGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length) {
                    var rec = selections[0];
                    gm.me().generalCodeDetailStore.getProxy().setExtraParams(
                        {
                            srcahd_uid         : rec.get('unique_id_long'),
                            inspection_standard: 'G',
                    
                        }
                    );
                    // 오른쪽 단 스토어 로드
                    gm.me().generalCodeDetailStore.load();
                    gm.me().addGranularityCodeBtn.enable();
                    gm.me().deleteGranularity.enable();
                    gm.me().updateGranularity.enable();
                } else {
                    gm.me().addGranularityCodeBtn.disable();
                    gm.me().deleteGranularity.disable();
                    gm.me().updateGranularity.disable();
                }
            }
        });

        var leftContainer = new Ext.container.Container({
            title: '관리선설정',
            region: 'center',
            layout: {
                type: 'border'
            },
            defaults: {
                collapsible: true,
                split: true
            },
            items: [
                {
                    collapsible: false,
                    frame: false,
                    region: 'west',
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    flex: 1,
                    items: [this.grid]
                },
                {
                    collapsible: false,
                    frame: false,
                    region: 'center',
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    flex: 1,
                    items: [this.gridGeneralCodeChilds]
                }
            ]
        });

        var rightContainer = new Ext.container.Container({
            title: '체가름성적 항목',
            region: 'center',
            layout: {
                type: 'border'
            },
            defaults: {
                collapsible: true,
                split: true
            },
            items: [
                {
                    collapsible: false,
                    frame: false,
                    region: 'west',
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    flex: 0.85,
                    items: [this.twoGrid]
                },
                {
                    collapsible: false,
                    frame: false,
                    region: 'center',
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    flex: 1,
                    items: [this.gridGeneralCodeChildss]
                }
            ]
        });



        var mainTab = Ext.widget('tabpanel', {
            layout: 'border',
            border: true,
            region: 'center',
            tabPosition: 'top',
            items: [leftContainer, rightContainer]
        });

        // 오른쪽 단
        Ext.apply(this, {
            layout: 'border',
            items: mainTab
        });
        // Ext.apply(this, {
        //     layout: 'border',
        //     items : [
        //         {
        //             collapsible: false,
        //             frame      : false,
        //             region     : 'west',
        //             layout     : {
        //                 type : 'hbox',
        //                 pack : 'start',
        //                 align: 'stretch'
        //             },
        //             margin     : '5 0 0 0',
        //             width      : '50%',
        //             items      : [{
        //                 region: 'west',
        //                 layout: 'fit',
        //                 margin: '0 0 0 0',
        //                 width : '100%',
        //                 items : [this.grid]
        //             }]
        //         }, this.crudTab, this.gridGeneralCodeChilds
        //     ]
        // });

        this.callParent(arguments);
        // 그리드 선택 했을 시 콜백
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                var rec = selections[0];
                this.generalCodeDetailStore.getProxy().setExtraParams(
                    {
                        srcahd_uid         : rec.get('unique_id_long'),
                        inspection_standard: 'D',
                
                    }
                );
                // 오른쪽 단 스토어 로드
                this.generalCodeDetailStore.load();
                this.addChildCodeBtn.enable();
                this.deleteChildCodeBtn.enable();
                this.updateChildCodeBtn.enable();
                this.loadOtherCode.enable();
            } else {
                this.addChildCodeBtn.disable();
                this.loadOtherCode.disable();
                this.deleteChildCodeBtn.disable();
                this.updateChildCodeBtn.disable();
            }
        })

        // 서브 그리드 선택 시 
        // this.gridGeneralCodeChilds.getSelectionModel().on({
        //     selectionchange: function (sm, selections) {
        //         if (selections.length > 0) {
        //         var rec = selections[0];
        //         this.generalCodeDetailStore.getProxy().setExtraParams(
        //             {
        //                 srcahd_uid         : rec.get('unique_id_long'),
        //                 inspection_standard: 'G',
                
        //             }
        //         );
        //             gm.me().deleteChildCodeBtn.enable();
        //             gm.me().updateChildCodeBtn.enable();
        //         } else {
        //             gm.me().deleteChildCodeBtn.disable();
        //             gm.me().updateChildCodeBtn.disable();
        //         }
        //     }
        // })

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function (records) {
        });

    },

    // 하위코드 등록 팝업창에서 확인버튼 클릭시 호출되는 함수
    addChildCode: function (val, win) {
        Ext.MessageBox.show({
            title  : '등록',
            msg    : '품목별 관리선설정을 등록하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn     : function (btn) {
                if (btn == 'yes') {
                    win.setLoading(true);
                    var selections = gm.me().grid.getSelectionModel().getSelected().items[0];
                    console_logs('>>>>>>>>>>>>>>>>>>>>>',gu.getCmp('supast_uid').getValue());
                    Ext.Ajax.request({
                        url    : CONTEXT_PATH + '/xdview/spcMgmt.do?method=createSpcColumnNMgmt',
                        params : {
                            legend_code_kr: val['legend_code_kr'],
                            unit_name     : val['unit_name'],
                            baseline      : val['baseline'],
                            supast_uid    : gu.getCmp('supast_uid').getValue(),
                            order_number  : val['order_number'],
                            srcahd_uid    : selections.get('unique_id_long'),
                            spec_need_flag: selections.get('spec_need_flag')
                        },
                        success: function (result, request) {
                            var resultText = result.responseText;
                            console_log('result:' + resultText);
                            gm.me().store.load();
                            gm.me().generalCodeDetailStore.load();
                            if (win) {
                                win.close();
                            }
                        },
                        failure: extjsUtil.failureMessage
                    });//endof ajax request
                } else {
                    if (win) {
                        win.close();
                    }
                }
            },
            icon   : Ext.MessageBox.QUESTION
        })

    },

    // 체가름성적 항목 입력 시 호출되는 함수
    addGranularity: function (val, win) {
        Ext.MessageBox.show({
            title  : '등록',
            msg    : '품목별 관리선설정을 등록하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn     : function (btn) {
                if (btn == 'yes') {
                    win.setLoading(true);
                    var selections = gm.me().twoGrid.getSelectionModel().getSelected().items[0];
                    console_logs('>>>>>>>>>>>>>>>>>>>>>',gu.getCmp('supast_uid').getValue());
                    Ext.Ajax.request({
                        url    : CONTEXT_PATH + '/xdview/spcMgmt.do?method=createSpcColumnNMgmt',
                        params : {
                            legend_code_kr: val['legend_code_kr'],
                            unit_name     : val['unit_name'],
                            baseline      : val['baseline'],
                            supast_uid    : gu.getCmp('supast_uid').getValue(),
                            order_number  : val['order_number'],
                            srcahd_uid    : selections.get('unique_id_long'),
                            spec_need_flag: selections.get('spec_need_flag')
                        },
                        success: function (result, request) {
                            var resultText = result.responseText;
                            console_log('result:' + resultText);
                            gm.me().store.load();
                            gm.me().generalCodeDetailStore.load();
                            if (win) {
                                win.close();
                            }
                        },
                        failure: extjsUtil.failureMessage
                    });//endof ajax request
                } else {
                    if (win) {
                        win.close();
                    }
                }
            },
            icon   : Ext.MessageBox.QUESTION
        })

    },

    // 하위코드 수정 팝업창에서 확인버튼 클릭시 호출되는 함수
    updateChildCode: function (val, unique_id, win) {
        console_logs('unique_id from function : ', unique_id);
        Ext.MessageBox.show({
            title  : '수정',
            msg    : '제품별 하위 코드를 수정하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn     : function (btn) {
                if (btn == 'yes') {
                    Ext.Ajax.request({
                        url    : CONTEXT_PATH + '/xdview/spcMgmt.do?method=createSpcColumnNMgmt',
                        params : {
                            legend_code_kr: val['legend_code_kr'],
                            unit_name     : val['unit_name'],
                            baseline      : val['baseline'],
                            supast_uid    : gu.getCmp('supast_uid').getValue(),
                            order_number  : val['order_number'],
                            unique_id     : unique_id
                        },
                        success: function (result, request) {
                            var resultText = result.responseText;
                            console_log('result:' + resultText);
                            gm.me().store.load();
                            gm.me().generalCodeDetailStore.load();
                            if (win) {
                                win.close();
                            }
                        },
                        failure: extjsUtil.failureMessage
                    });//endof ajax request
                }
            },
            icon   : Ext.MessageBox.QUESTION
        })
    },
    combstStore    : Ext.create('Mplm.store.SupastStore', {}),
    selectCombst   : function () {
        // var detailStore = Ext.create('Rfx2.store.company.chmr.MoneyInStoreByBill', {});
        // detailStore.getProxy().setExtraParam('project_uid', rec.get('ac_uid'));
        // detailStore.getProxy().setExtraParam('combst_uid', rec.get('order_com_unique'));
        gm.me().combstStore.getProxy().setExtraParam('wa_name', '');
        gm.me().combstStore.getProxy().setExtraParam('biz_no', '');
        gm.me().combstStore.load();
        // gm.me().combstStore.load();

        // paytype.load();
        var loadForm = Ext.create('Ext.grid.Panel', {
            store    : gm.me().combstStore,
            selModel : Ext.create("Ext.selection.CheckboxModel", {}),
            id       : gu.id('loadForm'),
            layout   : 'fit',
            title    : '',
            region   : 'center',
            style    : 'padding-left:0px;',
            plugins  : {
                ptype       : 'cellediting',
                clicksToEdit: 2,
            },
            bbar     : getPageToolbar(gm.me().combstStore),
            columns  : [
                {
                    id       : 'supplier_name',
                    text     : "공급사명",
                    flex     : 1,
                    style    : 'text-align:center',
                    dataIndex: 'supplier_name',
                    sortable : true,
                    // renderer: Ext.util.Format.dateRenderer('Y-m-d')
                },
                {
                    text     : "사업자번호",
                    flex     : 1,
                    dataIndex: 'business_registration_no',
                    // align: 'right',
                    style   : 'text-align:center',
                    sortable: true,

                },
                {
                    text     : "대표자명",
                    flex     : 1,
                    style    : 'text-align:center',
                    dataIndex: 'president_name',
                    sortable : true,
                    // renderer: Ext.util.Format.dateRenderer('Y-m-d')
                },

                {
                    text     : "본사주소",
                    flex     : 1,
                    style    : 'text-align:center',
                    dataIndex: 'address_1',
                    sortable : true,
                },

            ],
            listeners: {
                itemdblclick: function (dv, record, item, index, e) {
                    var selections = loadForm.getSelectionModel().getSelection();
                    var rec = selections[0];
                    console_logs('>>>> rec dbclick', rec);
                    var order_com_unique = rec.get('unique_id');
                    let supplier_name = rec.get('supplier_name');
                    let address = rec.get('address_1');
                    console_logs('>>>>>>>>address', address);
                    console_logs('>>>>>>>>supast_uid', order_com_unique);
                    gu.getCmp('supplier_name').setValue(supplier_name);
                    gu.getCmp('supast_uid').setValue(order_com_unique);
                    // gu.getCmp('v001').setValue(address);
                    winProduct.setLoading(false);
                    winProduct.close();
                }
            },

            renderTo   : Ext.getBody(),
            autoScroll : true,
            multiSelect: true,
            pageSize   : 100,
            width      : 300,
            height     : 300,
            dockedItems: [
                {
                    dock : 'top',
                    xtype: 'toolbar',
                    cls  : 'my-x-toolbar-default1',
                    items: [
                        {
                            width          : 200,
                            field_id       : 'wa_name',
                            id             : gu.id('wa_name_search'),
                            name           : 'wa_name',
                            xtype          : 'triggerfield',
                            emptyText      : '회사명',
                            trigger1Cls    : Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');
                                gm.me().combstStore.load();
                            },
                            listeners      : {
                                change: function (fieldObj, e) {
                                    //if (e.getKey() == Ext.EventObject.ENTER) {
                                    gm.me().combstStore.getProxy().setExtraParam('wa_name', gu.getCmp('wa_name_search').getValue());
                                    gm.me().combstStore.load();
                                    //srchSingleHandler (store, srchId, fieldObj, isWild);
                                    //}
                                },
                                render: function (c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html  : c.emptyText
                                    });
                                }
                            }
                        },
                        {
                            width          : 200,
                            field_id       : 'biz_no',
                            id             : gu.id('biz_no_search'),
                            name           : 'biz_no',
                            xtype          : 'triggerfield',
                            emptyText      : '사업자번호',
                            trigger1Cls    : Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');
                                gm.me().combstStore.load();
                            },
                            listeners      : {
                                change: function (fieldObj, e) {
                                    //if (e.getKey() == Ext.EventObject.ENTER) {

                                    gm.me().combstStore.getProxy().setExtraParam('biz_no', gu.getCmp('biz_no_search').getValue());
                                    gm.me().combstStore.load();
                                    //srchSingleHandler (store, srchId, fieldObj, isWild);
                                    //}
                                },
                                render: function (c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html  : c.emptyText
                                    });
                                }
                            }
                        },
                        '->',
                        this.addCombst
                    ]
                }] // endofdockeditems
        });

        loadForm.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length) {
                    var rec = selections[0];
                } else {

                }
            }
        });

        var winProduct = Ext.create('ModalWindow', {
            title    : '공급사를 선택후 확인버튼을 클릭하세요.',
            width    : 700,
            height   : 600,
            minWidth : 600,
            minHeight: 300,
            items    : [
                // searchPalletGrid, 
                loadForm
            ],
            buttons  : [{
                text   : CMD_OK,
                handler: function (btn) {
                    var sel = loadForm.getSelectionModel().getSelected().items[0];
                    console_logs('>>> sel >>>>', sel);
                    if (sel !== undefined) {
                        console_logs('>>> sel111', sel);
                        var unique_id_long = sel.get('unique_id_long');
                        let supplier_name = sel.get('supplier_name');
                        console_logs('supplier_name', supplier_name);
                        gu.getCmp('supplier_name').setValue(supplier_name);
                        gu.getCmp('supast_uid').setValue(unique_id_long);
                        winProduct.setLoading(false);
                        winProduct.close();
                    } else {
                        Ext.MessageBox.alert('알림', '고객사가 선택되지 않았습니다.');
                        return;
                    }
                }
            }]
        });
        winProduct.show();
    },
    items: [],
    existMgmtLineStore: Ext.create('Rfx2.store.company.chmr.ExistMgmtLinePrdStore'),
    
});