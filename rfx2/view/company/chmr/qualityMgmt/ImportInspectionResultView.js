Ext.define('Rfx2.view.company.chmr.qualityMgmt.ImportInspectionResultView', {
    extend: 'Rfx2.base.BaseView',
    xtype : 'import-inspection-view',


    initComponent : function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField({
            type    : 'dateRange',
            field_id: 'search_date',
            text    : "입고일",
            sdate   : Ext.Date.add(new Date(), Ext.Date.YEAR, -1),
            edate   : new Date()
        });

        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');


        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE']
        });


        this.createStoreSimple({
            modelClass: 'Rfx2.model.company.chmr.ImportInspection',
            sorters   : [{
                property : 'unique_id',
                direction: 'DESC'
            }],
            pageSize  : gMain.pageSize,/*pageSize*/
        }, {});

        // 검사 삭제 버튼
        this.deleteInspection = Ext.create('Ext.Action', {
            xtype   : 'button',
            iconCls : 'af-remove',
            text    : '검사삭제',
            tooltip : this.getMC('msg_btn_prd_add', '수입검사 내역 삭제'),
            disabled: true,
            handler : function () {
                Ext.MessageBox.show({
                    title  : '삭제',
                    msg    : '선택한 차수의 수입검사 내역을 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn     : function (btn) {
                        if (btn == 'yes') {
                            var record = gm.me().grid.getSelectionModel().getSelection()[0].data;
                            Ext.Ajax.request({
                                url    : CONTEXT_PATH + '/xdview/spcMgmt.do?method=destroyInspection',
                                params : {
                                    target_uid   : record.unique_id_long,
                                    type         : !record.type ? 'I' : record.type, // 기본값 2(최종검사)
                                    inspection_no: !record.v027 ? 1 : record.v027 // 기본값 1차 검사
                                },
                                success: function (result, request) {
                                    var resultText = result.responseText;
                                    console_log('result:' + resultText);
                                    gm.me().store.load();
                                },
                                failure: extjsUtil.failureMessage
                            });
                        }
                    },
                    icon   : Ext.MessageBox.QUESTION
                });
            }
        });

        this.fileattachAction = Ext.create('Ext.Action', {
            iconCls : 'af-download',
            itemId  : 'fileattachAction',
            disabled: true,
            text    : '파일관리',
            handler : function (widget, event) {
                gm.me().attachFile();
            }
        });

        var btnsNeedsSelection = [];

        buttonToolbar.insert(1, this.fileattachAction);

        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        //grid 생성.
        this.createGrid(arr);
        this.createCrudTab();

        this.testStore = Ext.create('Rfx2.store.company.bioprotech.ImportInspectionStore', {pageSize: 10});

        Ext.apply(this, {
            layout: 'border',
            items : this.grid
        });

        this.callParent(arguments);

        var dateRangeId = this.link + '-' + gMain.getSearchField('search_date');
        sDateField = Ext.getCmp(dateRangeId + '-s');
        eDateField = Ext.getCmp(dateRangeId + '-e');
        sDateField.setMaxValue(new Date());
        eDateField.setMaxValue(new Date());

        //디폴트 로드
        // this.store.getProxy().setExtraParams({
        //     isReady: true,
        // });
        gm.setCenterLoading(false);
        this.store.getProxy().setExtraParam('is_ok', '');
        this.storeLoad();

        // this.setGridOnCallback(function (selections) {
        //     if (selections.length) {
        //         console_logs('>>> aaa', 'aaa');
        //
        //         gm.me().addTakeResult.enable();
        //         gu.getCmp('company_name').setValue('');
        //     } else {
        //         gm.me().addTakeResult.disable();
        //     }
        // });

        // this.inspectionResultStore = Ext.create('Rfx2.store.company.chmr.InspectionResultStore', {});

        this.subInspectionResultStore = Ext.create('Rfx2.store.company.chmr.MaterialInspectionListStore', {});

        var subGridMain = Ext.create('Ext.form.Panel', {
            id         : gu.id('subGridMain'),
            xtype      : 'form',
            frame      : false,
            border     : false,
            width      : '100%',
            layout     : 'column',
            bodyPadding: 10,
            items      : [
                {
                    xtype      : 'fieldset',
                    collapsible: false,
                    width      : '100%',
                    style      : 'padding:10px',
                    defaults   : {
                        labelStyle: 'padding:10px',
                        anchor    : '100%',
                        layout    : {
                            type: 'column'
                        }
                    },
                    items      : [
                        {
                            xtype         : 'container',
                            width         : '100%',
                            border        : true,
                            defaultMargins: {
                                top   : 0,
                                right : 0,
                                bottom: 0,
                                left  : 10
                            },
                            items         : [
                                {
                                    xtype     : 'fieldcontainer',
                                    fieldLabel: '공급사',
                                    anchor    : '99%',
                                    width     : '90%',
                                    padding   : '0 0 5px 30px',
                                    // height: '10%',
                                    layout  : 'hbox',
                                    defaults: {
                                        margin: '2 2 2 2'
                                    },
                                    // default: {
                                    //     flex: 1
                                    // },
                                    items: [
                                        {
                                            id  : gu.id('company_name'),
                                            name: 'company_name',
                                            // fieldLabel: gm.me().getMC('msg_order_dia_order_customer', '고객명'),
                                            allowBlank: true,
                                            xtype     : 'textfield',
                                            width     : 300,
                                            editable  : false,
                                            // padding: '0 0 5px 30px',
                                            fieldStyle: 'background-color: #FFFCCC;',
                                            // store: gm.me().combstStore,
                                            emptyText   : '우측버튼을 클릭하여 공급사를 선택 후 입력.',
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
                                                    // var buyer = gu.getCmp('order_com_unique').getValue();
                                                    // console_logs('>>> buyer', buyer);
                                                    // gu.getCmp('customer_name').setValue(buyer);
                                                }// endofselect
                                            }
                                        },
                                        {
                                            xtype: 'button',
                                            text : '클릭하여 선택',
                                            width: 120,
                                            // margin: '0 10 10 380',
                                            scale  : 'small',
                                            handler: function () {
                                                gm.me().selectCombst();
                                            }
                                        },

                                    ]
                                },
                                {
                                    id        : gu.id('v000'),
                                    name      : 'v000',
                                    allowBlank: true,
                                    fieldLabel: '종류 / 규격',
                                    xtype     : 'textfield',
                                    width     : '45%',
                                    padding   : '0 0 5px 30px',
                                    editable  : false,
                                    fieldStyle: 'background-color: #FFFCCC;'
                                },
                                {
                                    xtype     : 'textfield',
                                    id        : gu.id('v001'),
                                    name      : 'v001',
                                    width     : '45%',
                                    allowBlank: true,
                                    padding   : '0 0 5px 30px',
                                    fieldLabel: '채취장소'
                                },
                                {
                                    xtype     : 'textfield',
                                    id        : gu.id('v002'),
                                    name      : 'v002',
                                    padding   : '0 0 5px 30px',
                                    width     : '45%',
                                    allowBlank: true,
                                    fieldLabel: 'LOT No'
                                },

                                {
                                    fieldLabel  : '채취일자',
                                    xtype       : 'datefield',
                                    padding     : '0 0 5px 30px',
                                    width       : '45%',
                                    name        : 'v003',
                                    format      : 'Y-m-d',
                                    submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                    dateFormat  : 'Y-m-d',// 'Y-m-d H:i:s'
                                    allowBlank  : false,
                                    id          : gu.id('v003'),
                                    listeners   : {
                                        change: function (sender, newValue, oldValue, opts) {
                                            var v003 = gu.getCmp('v003').getValue();
                                            v003 = Ext.Date.format(v003, 'Y-m-d');
                                            var vat = v003.replace(/-/gi, "");
                                            gu.getCmp('v002').setValue(vat);

                                        }
                                    }
                                },
                                {
                                    fieldLabel: '시험일자',
                                    xtype     : 'datefield',
                                    padding   : '0 0 5px 30px',
                                    width     : '45%',
                                    name      : 'v005',
                                    format    : 'Y-m-d',
                                    allowBlank: false,
                                    id        : gu.id('v005')
                                },
                                {
                                    fieldLabel: '시험방법',
                                    xtype     : 'textfield',
                                    padding   : '0 0 5px 30px',
                                    width     : '45%',
                                    name      : 'v006',
                                    format    : 'Y-m-d',
                                    allowBlank: false,
                                    id        : gu.id('v006')
                                },
                                {
                                    fieldLabel: '검사자',
                                    xtype     : 'textfield',
                                    padding   : '0 0 5px 30px',
                                    width     : '45%',
                                    name      : 'v007',
                                    allowBlank: false,
                                    id        : gu.id('v007')
                                },
                                {
                                    fieldLabel: '입고수량',
                                    xtype     : 'textfield',
                                    padding   : '0 0 5px 30px',
                                    width     : '45%',
                                    name      : 'v008',
                                    allowBlank: false,
                                    editable  : false,
                                    fieldStyle: 'background-color: #FFFCCC;',
                                    id        : gu.id('v008')

                                },
                                {
                                    xtype  : 'button',
                                    text   : '저장',
                                    width  : 120,
                                    margin : '20 10 10 650',
                                    scale  : 'small',
                                    handler: function () {
                                        gm.me().saveInspection();
                                    },

                                },

                            ],

                        },
                    ],
                    tbar       : [],

                },

            ]

        });

        var subGrid = Ext.create('Ext.grid.Panel', {
            cls        : 'rfx-panel',
            id         : gu.id('subGrid'),
            store      : this.subInspectionResultStore,
            viewConfig : {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            region     : 'center',
            autoScroll : true,
            autoHeight : true,
            flex       : 1,
            width      : 800,
            height     : 350,
            frame      : true,
            border     : true,
            layout     : 'fit',
            forceFit   : false,
            margin     : '0 0 0 0',
            columns    : [
                {
                    text     : 'No',
                    width    : '5%',
                    dataIndex: 'row_num',
                    style    : 'text-align:center',
                    sortable : false
                },
                {
                    text     : '검사항목',
                    width    : '20%',
                    dataIndex: 'legend_code_kr',
                    style    : 'text-align:center',
                    sortable : false
                },
                {
                    text     : '단위',
                    width    : '10%',
                    dataIndex: 'unit_name',
                    style    : 'text-align:center',
                    sortable : false,
                },
                {
                    text     : '기준치',
                    width    : '10%',
                    dataIndex: 'baseline',
                    style    : 'text-align:center',
                    sortable : false
                },
                {
                    text     : '측정치',
                    width    : '10%',
                    dataIndex: 'v000',
                    editor   : 'textfield',
                    style    : 'text-align:center',
                    align    : 'left',
                    sortable : false,
                    editor   : 'textfield'
                },
                {
                    text     : '판정',
                    width    : '10%',
                    css      : 'edit-cell',
                    dataIndex: 'v028',
                    style    : 'text-align:center',
                    sortable : false,
                    editor   : {
                        xtype         : 'combobox',
                        id            : gu.id('decision'),
                        displayField  : 'codeName',
                        editable      : true,
                        forceSelection: true,
                        store         : this.decisionStore,
                        triggerAction : 'all',
                        valueField    : 'systemCode'
                    },
                    renderer : function (val) {
                        var recordIndex = gm.me().decisionStore.find('systemCode', val);
                        console_logs('>>>> recordIndex ', recordIndex);
                        if (recordIndex === -1) {
                            return '';
                        }
                        return gm.me().decisionStore.getAt(recordIndex).get('codeName');
                    },
                },
                {
                    text     : '비고',
                    width    : '31%',
                    css      : 'edit-cell',
                    dataIndex: 'v001',
                    style    : 'text-align:center',
                    editor   : 'textfield',
                    sortable : false,
                },
            ],
            tbar       : [],
            plugins    : {
                ptype       : 'cellediting',
                clicksToEdit: 2,
            },
            listeners  : {
                selectionchange: function (selectionModel, records, listeners) {

                }
            }
        });

        var rtPanel = Ext.create('Ext.form.Panel', {
            id         : 'rtPanel',
            xtype      : 'form',
            frame      : false,
            border     : false,
            width      : '100%',
            layout     : 'column',
            bodyPadding: 10,
            items      : [
                {
                    xtype      : 'fieldset',
                    collapsible: false,
                    width      : '100%',
                    height     : '50%',
                    defaults   : {
                        labelStyle: 'padding:10px',
                        anchor    : '100%',
                        layout    : {
                            type: 'column'
                        }
                    },
                    items      : [
                        {
                            xtype : 'container',
                            width : '100%',
                            border: true,
                            height: '50%',
                            items : [
                                subGridMain
                            ]
                        },

                    ]
                },
                {
                    xtype: 'fieldset',
                    frame: true,
                    // title      : '검사항목 입력',
                    width : '100%',
                    height: '100%',
                    layout: 'fit',
                    // bodyPadding: 10,
                    items: [
                        subGrid
                    ]
                },
            ]
        });

        Ext.apply(this, {
            layout: 'border',
            items : [
                {
                    collapsible: false,
                    frame      : false,
                    region     : 'west',
                    layout     : {
                        type : 'hbox',
                        pack : 'start',
                        align: 'stretch'
                    },
                    margin     : '5 0 0 0',
                    width      : '50%',
                    items      : [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width : '100%',
                        items : [this.grid]
                    }]
                },
                // this.crudTab, 
                rtPanel
            ]
        });


        this.callParent(arguments);

        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                var rec = selections[0];
                // gm.me().inspectionResultStore.getProxy().setExtraParam('target_uid', rec.get('unique_id_long'));

                gm.me().subInspectionResultStore.getProxy().setExtraParam('type', 'D');
                gm.me().subInspectionResultStore.getProxy().setExtraParam('srcahd_uid', rec.get('srcahd_uid'));
                gm.me().subInspectionResultStore.getProxy().setExtraParam('wgrast_uid', rec.get('unique_id_long'));
                gm.me().subInspectionResultStore.load();

                gm.me().decisionStore.load();

                gm.me().fileattachAction.enable();

                let v000 = rec.get('item_name') + (rec.get('specification') !== '' ? ' / ' + rec.get('specification') : '');
                gu.getCmp('v000').setValue(v000);
                gu.getCmp('company_name').setValue('');
                gu.getCmp('v001').setValue('');
                gu.getCmp('v002').setValue('');
                gu.getCmp('v003').setValue('');
                gu.getCmp('v005').setValue('');
                gu.getCmp('v006').setValue('');
                gu.getCmp('v007').setValue('');
                gu.getCmp('v008').setValue(rec.get('gr_qty'));

                Ext.Ajax.request({
                    url    : CONTEXT_PATH + '/quality/cementInspect.do?method=getInspectionTestBaseInfo',
                    params : {
                        target_uid: rec.get('unique_id_long'),
                    },
                    success: function (result, request) {
                        var result = result.responseText;
                        console_logs('>>>>> result', result);
                        var result_split = result.split('|', 7);
                        let v004 = result_split[0] === "null" || result_split[0] === "" ? '' : result_split[0];
                        let v001 = result_split[1] === "null" || result_split[1] === "" ? '' : result_split[1];
                        let v002 = result_split[2] === "null" || result_split[2] === "" ? '' : result_split[2];
                        let v003 = result_split[3];
                        let v005 = result_split[4];
                        let v006 = result_split[5] === "null" || result_split[5] === "" ? '' : result_split[5];
                        let v007 = result_split[6] === "null" || result_split[6] === "" ? '' : result_split[6];

                        gu.getCmp('company_name').setValue(v004);
                        gu.getCmp('v001').setValue(v001);
                        gu.getCmp('v002').setValue(v002);
                        gu.getCmp('v003').setValue(v003 === "null" || v003 === "" ? '' : new Date(v003));
                        gu.getCmp('v005').setValue(v005 === "null" || v005 === "" ? '' : new Date(v005));
                        gu.getCmp('v006').setValue(v006);
                        gu.getCmp('v007').setValue(v007);

                        win.setLoading(false);
                        gm.me().store.load();

                    }, //endofsuccess
                    failure: function (result, request) {
                        var result = result.responseText;
                        Ext.MessageBox.alert('알림', result);
                    },
                });
            } else {
                gm.me().fileattachAction.disable();
                // gu.getCmp('value_edit').disable();
                // gu.getCmp('value_delete').disable();
            }
        })

    }, // end of init
    inspectList   : Ext.create('Rfx2.store.company.chmr.MaterialInspectionListStore'),
    decisionStore : Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'INPSECT_DECISION'}),
    combstStore   : Ext.create('Mplm.store.SupastStore', {}),
    selectCombst  : function () {
        // var detailStore = Ext.create('Rfx2.store.company.chmr.MoneyInStoreByBill', {});
        // detailStore.getProxy().setExtraParam('project_uid', rec.get('ac_uid'));
        // detailStore.getProxy().setExtraParam('combst_uid', rec.get('order_com_unique'));
        gm.me().combstStore.getProxy().setExtraParam('wa_name', '');
        gm.me().combstStore.getProxy().setExtraParam('biz_no', '');
        gm.me().combstStore.load();
        // gm.me().combstStore.load();

        // paytype.load();
        var loadForm = Ext.create('Ext.grid.Panel', {
            store      : gm.me().combstStore,
            selModel   : Ext.create("Ext.selection.CheckboxModel", {}),
            id         : gu.id('loadForm'),
            layout     : 'fit',
            title      : '',
            region     : 'center',
            style      : 'padding-left:0px;',
            plugins    : {
                ptype       : 'cellediting',
                clicksToEdit: 2,
            },
            bbar       : getPageToolbar(gm.me().combstStore),
            columns    : [
                {
                    id       : gu.id('supplier_name'),
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
            listeners  : {
                itemdblclick: function (dv, record, item, index, e) {
                    var selections = loadForm.getSelectionModel().getSelection();
                    var rec = selections[0];
                    console_logs('>>>> rec dbclick', rec);
                    var order_com_unique = rec.get('unique_id');
                    let supplier_name = rec.get('supplier_name');
                    // gu.getCmp('order_com_unique').setValue('');
                    // gu.getCmp('order_com_unique').setValue(order_com_unique);
                    // gu.getCmp('company_name').setValue('');
                    gu.getCmp('company_name').setValue(supplier_name);

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
                    // gm.me().deleteWthList.enable();
                    // gu.getCmp('loadCancel').enable();
                } else {
                    // gm.me().deleteWthList.disable();
                    // gu.getCmp('loadCancel').disable();
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
                        // gu.getCmp('order_com_unique').setValue('');
                        // gu.getCmp('order_com_unique').setValue(unique_id_long);
                        // gu.getCmp('company_name').setValue('');
                        gu.getCmp('company_name').setValue(supplier_name);

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
    saveInspection: function () {
        var select = gm.me().grid.getSelectionModel().getSelection()[0];
        console_logs('>>>> select', select);
        let storeData = gu.getCmp('subGridMain');
        console_logs('>>>> storeData', storeData);
        let supplier_name = gu.getCmp('company_name').getValue();
        let v000 = gu.getCmp('v000').getValue();
        let v001 = gu.getCmp('v001').getValue();
        let v002 = gu.getCmp('v002').getValue();
        let v003 = gu.getCmp('v003').getValue();
        let v004 = gu.getCmp('company_name').getValue();
        let v005 = gu.getCmp('v005').getValue();
        let v006 = gu.getCmp('v006').getValue();
        let v007 = gu.getCmp('v007').getValue();

        let storeDataSub = gu.getCmp('subGrid').getStore();
        const v000List = [];
        const v001List = [];
        const v028List = [];
        const spccolumnUids = [];
        for (var j = 0; j < storeDataSub.data.items.length; j++) {
            const itemSub = storeDataSub.data.items[j];
            console_logs('itemSub >>>', itemSub);
            v000List.push(itemSub.get('v000'));
            v001List.push(itemSub.get('v001'));
            v028List.push(itemSub.get('v028'));
            spccolumnUids.push(itemSub.get('unique_id_long'));
        }
        console_logs('>>>> v000List', v000List);
        console_logs('>>>> v001List', v001List);
        Ext.Ajax.request({
            url    : CONTEXT_PATH + '/quality/cementInspect.do?method=insertIncomeResultValue',
            params : {
                v000List     : v000List,
                v001List     : v001List,
                v028List     : v028List,
                spccolumnUids: spccolumnUids,
                wgrast_uid   : select.get('unique_id_long'),
                v000         : v000,
                v001         : v001,
                v002         : v002,
                v003         : v003,
                v004         : v004,
                v005         : v005,
                v006         : v006,
                v007         : v007
            },
            success: function (result, request) {
                var resultText = result.responseText;
                console_log('result:' + resultText);
                gm.me().store.load();
                // gm.me().inspectionResultStore.load();
                gm.me().subInspectionResultStore.load();
                gu.getCmp('value_edit').disable();
            },
            failure: extjsUtil.failureMessage
        });


    },

    attachFile: function () {
        var record = gm.me().grid.getSelectionModel().getSelection()[0];
        this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('unique_id_long'));
        // this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('top_srcahd_uid'));
        this.attachedFileStore.load(function (records) {
            if (records != null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update('파일 수 : ' + records.length);
                }

            }
        });
        var selFilegrid = Ext.create("Ext.selection.CheckboxModel", {});
        this.fileGrid = Ext.create('Ext.grid.Panel', {
            title: '첨부된 파일 리스트',
            store: this.attachedFileStore,
            collapsible: false,
            multiSelect: true,
            // hidden : ! this.useDocument,
            // selModel: selFilegrid,
            stateId: 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    {
                        xtype: 'button',
                        text: '파일업로드',
                        scale: 'small',
                        iconCls: 'af-upload-white',
                        scope: this.fileGrid,
                        handler: function () {
                            console_logs('=====aaa', record);
                            var url = CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + record.get('unique_id_long');
                            var uploadPanel = Ext.create('Ext.ux.upload.Panel', {
                                uploader: 'Ext.ux.upload.uploader.FormDataUploader',
                                uploaderOptions: {
                                    url: url
                                },
                                synchronous: true
                            });
                            var uploadDialog = Ext.create('Ext.ux.upload.Dialog', {
                                dialogTitle: '파일첨부',
                                panel: uploadPanel
                            });
                            this.mon(uploadDialog, 'uploadcomplete', function (uploadPanel, manager, items, errorCount) {
                                console_logs('this.mon uploadcomplete uploadPanel', uploadPanel);
                                console_logs('this.mon uploadcomplete manager', manager);
                                console_logs('this.mon uploadcomplete items', items);
                                console_logs('this.mon uploadcomplete errorCount', errorCount);
                                gm.me().uploadComplete(items);
                                uploadDialog.close();
                            }, this);
                            uploadDialog.show();
                        }
                    },
                    {
                        xtype: 'button',
                        text: '파일삭제',
                        scale: 'small',
                        iconCls: 'af-remove',
                        scope: this.fileGrid,
                        handler: function () {
                            console_logs('파일 UID ?????? ', gm.me().fileGrid.getSelectionModel().getSelected().items[0]);
                            if (gm.me().fileGrid.getSelectionModel().getSelected().items[0] != null) {
                                var unique_id = gm.me().fileGrid.getSelectionModel().getSelected().items[0].get('unique_id_long');
                                var file_path = gm.me().fileGrid.getSelectionModel().getSelected().items[0].get('file_path');
                                if (unique_id != null) {
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/sales/delivery.do?method=deleteFile',
                                        params: {
                                            file_path: file_path,
                                            unique_id: unique_id
                                        },
                                        success: function (result, request) {
                                            Ext.MessageBox.alert('확인', '삭제 되었습니다.');
                                            gm.me().attachedFileStore.load(function (records) {
                                                if (records != null) {
                                                    var o = gu.getCmp('file_quan');
                                                    if (o != null) {
                                                        o.update('파일 수 : ' + records.length);
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            } else {
                                Ext.MessageBox.alert('알림', '삭제할 파일이 선택되지 않았습니다.');
                            }
                        }
                    },
                    this.removeActionFile,
                    '-',
                    this.sendFileAction,
                    '->',
                    {
                        xtype: 'component',
                        id: gu.id('file_quan'),
                        style: 'margin-right:5px;width:100px;text-align:right',
                        html: '파일 수 : 0'
                    },
                ]
            }

            ],
            columns: [
                {
                    text: '파일 일련번호',
                    width: 100,
                    style: 'text-align:center',
                    sortable: true,
                    dataIndex: 'id'
                },
                {
                    text: '파일명',
                    style: 'text-align:center',
                    flex: 0.7,
                    sortable: true,
                    dataIndex: 'object_name'
                },
                {
                    text: '파일유형',
                    style: 'text-align:center',
                    width: 70,
                    sortable: true,
                    dataIndex: 'file_ext'
                },
                {
                    text: '업로드 날짜',
                    style: 'text-align:center',
                    width: 160,
                    sortable: true,
                    dataIndex: 'create_date'
                },
                {
                    text: 'size',
                    width: 100,
                    sortable: true,
                    xtype: 'numbercolumn',
                    format: '0,000',
                    style: 'text-align:center',
                    align: 'right',
                    dataIndex: 'file_size'
                },
                {
                    text: '등록자',
                    style: 'text-align:center',
                    width: 70,
                    sortable: true,
                    dataIndex: 'creator'
                },
            ]
        });

        var win = Ext.create('ModalWindow', {
            title: '첨부파일',
            width: 1300,
            height: 600,
            minWidth: 250,
            minHeight: 180,
            autoScroll: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            xtype: 'container',
            plain: true,
            items: [
                this.fileGrid
            ],
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    if (win) {
                        win.close();
                    }
                }
            }, {
                text: CMD_CANCEL,
                handler: function () {
                    if (win) {
                        win.close();
                    }
                }
            }]

        });
        win.show();
    },


    attachedFileStore: Ext.create('Mplm.store.AttachedFileStore', { group_code: null }),

    postDocument: function (url, store, i, tabname) {

        var xhr = new XMLHttpRequest();
        xhr.timeout = 30000; // time in milliseconds
        var fd = new FormData();
        fd.append("serverTimeDiff", 0);
        xhr.open("POST", url, true);
        fd.append('index', i);
        fd.append('file', store.getData().getAt(i).data.file);
        fd.append('upload_type', /*gu.getCmp('measureType').lastValue.radio1*/'SALES_PLAN');
        //fd.append('product_type', 'BW');

        xhr.setRequestHeader("serverTimeDiff", 0);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                if (xhr.responseText.length > 1) {
                    if (store.getData().getAt(i) !== undefined) {
                        store.getData().getAt(i).data.status = gm.me().getMC('sro1_completeAction', '완료');
                    }
                    for (var j = 0; j < store.data.items.length; j++) {
                        var record = store.getData().getAt(j);
                        if ((record.data.status === gm.me().getMC('sro1_completeAction', '완료'))) {
                            store.remove(record);
                            j--;
                        }
                    }
                } else {
                    store.getData().getAt(i).data.status = gm.me().getMC('error_msg_prompt', '오류');
                }
                //store.getData().getAt(i).commit();
                var data = Ext.util.JSON.decode(xhr.responseText).datas;
            } else if (xhr.readyState == 4 && (xhr.status == 404 || xhr.status == 500)) {
                store.getData().getAt(i).data.status = gm.me().getMC('error_msg_prompt', '오류');
                store.getData().getAt(i).commit();
            } else {
                for (var j = 0; j < store.data.items.length; j++) {
                    var record = store.getData().getAt(j);
                    store.remove(record);
                    j--;
                }
                if (store.data.items.length == 0 && gu.getCmp('uploadPrWin') != undefined) {
                    gu.getCmp('uploadPrWin').close();
                    gm.me().showToast(gm.me().getMC('mes_sro5_pln_header_reflection', '반영중'),
                        gm.me().getMC('mes_sro5_pln_msg_reflection', '데이터를 반영 중입니다. 잠시 후 새로고침 하시기 바랍니다.'));
                }
            }
        };
        xhr.send(fd);
    },

    uploadComplete: function (items) {
        console_logs('uploadComplete items', items);
        var output = 'Uploaded files: <br>';
        Ext.Array.each(items, function (item) {
            output += item.getFilename() + ' (' + item.getType() + ', '
                + Ext.util.Format.fileSize(item.getSize()) + ')' + '<br>';
        });
        console_logs('파일업로드 결과', output);
        Ext.MessageBox.show({
            title: '파일업로드 완료',
            icon: Ext.MessageBox['INFO'],
            msg: '파일첨부가 완료되었습니다.',
            buttons: Ext.MessageBox.OK,
            width: 450
        });
        this.attachedFileStore.load(function (records) {
            if (records != null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update('파일 수 : ' + records.length);
                }
            }
        });
    },
});
