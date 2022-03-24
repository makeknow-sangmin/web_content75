//자재 관리
Ext.define('Rfx.view.purStock.HEAVY5_ContractMaterialView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'contract-material-view',


    initComponent: function () {

        useMultitoolbar = false;
        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        //this.addSearchField('unique_id');
        this.setDefComboValue('standard_flag', 'valueField', 'R');

        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('supplier_name');
        this.addSearchField('specification');
        this.addSearchField('model_no');

        this.addCallback('CHECK_SP_CODE', function (combo, record) {
            gm.me().refreshStandard_flag(record);
        });

        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3) {
                buttonToolbar.items.remove(item);
            }
        });

        //부자재 선택시 구분(sg_code) disabled로 이벤트처리
        this.addCallback('STANDARD_FLAG', function (o) {
            console_logs('addCallback>>>>>>>>>', o);
        });

        //페이지 사이즈
        this.localSize = 300;

        //console_logs('this.fields', this.fields);
        this.createStore('Rfx.model.HEAVY5_ContractMaterial', [{
                property: 'unique_id',
                direction: 'DESC',
            }], this.localSize
            , {
                item_code_dash: 's.item_code',
                comment: 's.comment1'
            },
            ['srcmap']
        );

        var arr = [];
        arr.push(buttonToolbar);

        //검색툴바 생성
        if (useMultitoolbar == true) {
            var multiToolbar = this.createMultiSearchToolbar({first: 9, length: 11});
            console_logs('multiToolbar', multiToolbar);
            for (var i = 0; i < multiToolbar.length; i++) {
                arr.push(multiToolbar[i]);
            }
        } else {
            var searchToolbar = this.createSearchToolbar();
            arr.push(searchToolbar);
        }
        var myCartModel = Ext.create('Rfx.model.MyCartLineSrcahd', {
            fields: this.fields
        });

        //grid 생성.
        this.createGrid(arr);

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.setAllMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '전체',
            tooltip: '전체',
            //pressed: true,
            toggleGroup: 'stockviewType',
            handler: function () {
                gm.me().stockviewType = 'ALL';
                gm.me().store.getProxy().setExtraParam('standard_flag', '');
                gm.me().store.getProxy().setExtraParam('sp_code', '');
                gm.me().store.load(function () {
                });
            }
        });

        this.setRawMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '원자재',
            tooltip: '원자재 재고',
            //pressed: true,
            toggleGroup: 'stockviewType',
            handler: function () {
                this.matType = 'RAW';
                gm.me().store.getProxy().setExtraParam('standard_flag', 'K');
                gm.me().store.getProxy().setExtraParam('sp_code', '');
                gm.me().store.load(function () {
                });
            }
        });
        this.setSaMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '공구',
            tooltip: '공구 재고',
            //pressed: true,
            toggleGroup: 'stockviewType',
            handler: function () {
                this.matType = 'SUB';
                gm.me().store.getProxy().setExtraParam('standard_flag', 'R');
                gm.me().store.getProxy().setExtraParam('sp_code', 'R1');
                gm.me().store.load(function () {
                });
            }
        });
        this.setSubMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '기타소모품',
            tooltip: '기타소모품 재고',
            //pressed: true,
            toggleGroup: 'stockviewType',
            handler: function () {
                this.matType = 'MRO';
                gm.me().store.getProxy().setExtraParam('standard_flag', 'R');
                gm.me().store.getProxy().setExtraParam('sp_code', 'R2');
                gm.me().store.load(function () {
                });
            }
        });

        // 자재 계약
        this.addContractMatAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'font-awesome_4-7-0_sign-in_14_0_5395c4_none',
            text: '업체 추가 계약',
            tooltip: '자재 계약',
            disabled: true,
            handler: function () {
                var mStore = Ext.create('Mplm.store.SupastStore');
                var selections = gm.me().grid.getSelectionModel().getSelection();

                console_logs('selections', selections);


                if (selections.length > 0) {
                    var rec = selections[0];

                    var form = Ext.create('Ext.form.Panel', {
                        xtype: 'form',
                        width: 500,
                        bodyPadding: 15,
                        layout: {
                            type: 'vbox',
                            align: 'stretch' // Child items are stretched to full width
                        },
                        defaults: {
                            allowBlank: true,
                            msgTarget: 'side',
                            labelWidth: 80
                        },
                        items: [

                            {
                                fieldLabel: gm.me().getColName('srcahd_uid'),
                                xtype: 'textfield',
                                id: gu.id('srcahd_uid'),
                                name: 'srcahd_uid',
                                emptyText: '자재 UID',
                                value: rec.get('srcahd_uid'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                fieldLabel: gm.me().getColName('item_code'),
                                xtype: 'textfield',
                                id: gu.id('item_code'),
                                name: 'item_code',
                                value: rec.get('item_code'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                fieldLabel: gm.me().getColName('item_name'),
                                xtype: 'textfield',
                                id: gu.id('item_name'),
                                name: 'item_name',
                                value: rec.get('item_name'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
                                fieldLabel: gm.me().getColName('specification'),
                                xtype: 'textfield',
                                id: gu.id('specification'),
                                name: 'item_name',
                                value: rec.get('specification'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
                                fieldLabel: gm.me().getColName('maker_name'),
                                xtype: 'textfield',
                                id: gu.id('maker_name'),
                                name: 'maker_name',
                                value: rec.get('maker_name'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
                                fieldLabel: gm.me().getColName('model_no'),
                                xtype: 'textfield',
                                id: gu.id('model_no'),
                                name: 'model_no',
                                value: rec.get('model_no'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
                                fieldLabel: gm.me().getColName('description'),
                                xtype: 'textfield',
                                id: gu.id('description'),
                                name: 'description',
                                value: rec.get('description'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'

                            }, {
                                fieldLabel: gm.me().getColName('comment'),
                                xtype: 'textfield',
                                id: gu.id('comment'),
                                name: 'comment',
                                value: rec.get('comment'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'

                            }, {
                                id: gu.id('supast_uid'),
                                fieldLabel: '공급사',
                                labelWidth: 80,
                                xtype: 'combo',
                                anchor: '100%',
                                name: 'supast_uid',
                                mode: 'remote',
                                displayField: 'supplier_name',
                                store: mStore,
                                sortInfo: {field: 'supplier_name', direction: 'ASC'},
                                valueField: 'unique_id',
                                typeAhead: false,
                                minChars: 1,
                                flex: 1,
                                allowBlank : false,
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{unique_id}">[{supplier_code}] {supplier_name}</div>';
                                    }
                                },
                                listeners : {
                                    beforeselect: function(combo, records, eOpts) {
                                        console_logs('111', combo.getValue());
                                    }
                                }
                            }, 
                            {
                                fieldLabel: '통화',
                                xtype: 'textfield',
                                id: gu.id('currency'),
                                name: 'currency',
                                value: 'KRW',
                                flex: 1
                            }, {
                                fieldLabel: '단가',
                                xtype: 'textfield',
                                id: gu.id('sales_price'),
                                name: 'sales_price',
                                flex: 1
                            }, {
                                fieldLabel: '계약시작일',
                                xtype: 'datefield',
                                id: gu.id('start_date'),
                                name: 'start_date',
                                value: new Date(),
                                flex: 1
                            }, {
                                fieldLabel: '계약종료일',
                                xtype: 'datefield',
                                id: gu.id('end_date'),
                                name: 'end_date',
                                flex: 1
                            }

                        ]
                    });
                    

                    var winPart = Ext.create('ModalWindow', {
                        title: '계약',
                        width: 500,
                        height: 600,
                        items: form,
                        buttons: [{
                            text: CMD_OK,
                            handler: function () {
                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                    console_logs('form val', val);
                                    gm.me().addContractMat(val);
                                } else {
                                    Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                                }
                                if (winPart) {
                                    winPart.close();
                                }
                            }
                        }, {
                            text: CMD_CANCEL,
                            handler: function () {
                                if (winPart) {
                                    winPart.close();
                                }
                            }
                        }]
                    });
                    winPart.show(/* this, function(){} */);
                } // endofhandler
            }
        });

        // 자재 계약
        this.showContractMtrlHisAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'font-awesome_4-7-0_sign-in_14_0_5395c4_none',
            text: '계약사 변경 내역',
            tooltip: '계약사 변경 내역',
            disabled: true,
            handler: function () {

                this.contractHistoryStore = Ext.create('Rfx.store.ContractMaterialStore', {});
                this.contractHistoryStore.getProxy().setExtraParam('fix_type', 'HI');

                this.contractHistoryGrid = Ext.create('Ext.grid.Panel', {
                    store: this.contractHistoryStore,
                    id: gu.id('contractHistoryGrid'),
                    cls: 'rfx-panel',
                    collapsible: false,
                    multiSelect: false,
                    autoScroll: true,
                    autoHeight: true,
                    selModel: 'checkboxmodel',
                    bbar: getPageToolbar(this.contractHistoryStore),
                    frame: false,
                    border: false,
                    layout: 'fit',
                    forceFit: true,
                    height: '100%',
                    columns: [
                        {text: '계약사', width: 200, style: 'text-align:center', dataIndex: 'supplier_name', sortable: false},
                        {text: '계약단가', width: 100, style: 'text-align:center', dataIndex: 'sales_price', sortable: false},
                        {text: '통화', width: 80, style: 'text-align:center', dataIndex: 'currency', sortable: false},
                        {text: '계약시작일', width: 100, style: 'text-align:center', dataIndex: 'start_date', sortable: false},
                        {text: '계약종료일', width: 100, style: 'text-align:center', dataIndex: 'end_date', sortable: false}
                    ],
                    autoScroll: true,
                    dockedItems: []
                });

                this.prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '계약사 변경 내역',
                    width: 800,
                    height: 600,
                    layout: 'fit',
                    plain: true,
                    items: [
                        this.contractHistoryGrid
                    ]/*,
                    buttons: [{
                        text: '닫기',
                        handler: function(btn) {
                            this.prWin.hide();
                        }
                    }]*/
                });


                this.contractHistoryStore.getProxy().setExtraParam('srcahd_uid',
                    gm.me().grid.getSelectionModel().getSelection()[0].get('srcahd_uid'));
                this.contractHistoryStore.load();

                this.prWin.show();
            }
        });

        //버튼 추가.
        buttonToolbar.insert(7, '-');
        if (vCompanyReserved4 != 'SKNH01KR' && vCompanyReserved4 != 'KWLM01KR') {
            buttonToolbar.insert(7, this.setSubMatView);
            buttonToolbar.insert(7, this.setSaMatView);
            buttonToolbar.insert(7, this.setRawMatView);
            buttonToolbar.insert(7, this.setAllMatView);
        }

        if (vCompanyReserved4 == 'SKNH01KR' || vCompanyReserved4 == 'APM01KR') {
            buttonToolbar.insert(3, this.addContractMatAction);
            buttonToolbar.insert(4, this.showContractMtrlHisAction);
        }

        buttonToolbar.insert(6, '-');

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                rec = selections[0];
                gm.me().vSELECTED_UNIQUE_ID = rec.get('unique_id');
                gm.me().addContractMatAction.enable();
                gm.me().showContractMtrlHisAction.enable();
            } else {
                gm.me().addContractMatAction.disable();
                gm.me().showContractMtrlHisAction.disable();
            }
        })

        //디폴트 로드
        gMain.setCenterLoading(false);

        this.store.getProxy().setExtraParam('fix_type', 'PR');

        this.store.load(function (records) {
            gm.me().storeLoadCallback(records, gm.me().store);
        });
    },
    items: [],
    matType: 'RAW',
    stockviewType: "ALL",
    refreshStandard_flag: function (record) {
        console_logs('val', record);
        var spcode = record.get('systemCode');
        var s_flag = spcode.substring(0, 1);
        console_logs('spcode', s_flag);


        var target = this.getInputTarget('standard_flag');
        target.setValue(s_flag);

    },

    addContractMat: function (val) {
        Ext.MessageBox.show({
            title: '계약',
            msg: '이 회사와 자재를 계약 처리 하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn: function (btn) {
                if (btn == 'yes') {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/purchase/material.do?method=addContractMat',
                        params: {
                            currency: val['currency'],
                            sales_price: val['sales_price'],
                            srcahd_uid: val['srcahd_uid'],
                            supast_uid: val['supast_uid'],
                            start_date: val['start_date'],
                            end_date: val['end_date']
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
                }
            },
            //animateTarget: 'mb4',
            icon: Ext.MessageBox.QUESTION
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
                gm.me().getStore().load(function () {
                });
        }
    }
});



