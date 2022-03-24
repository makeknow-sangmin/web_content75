Ext.define('Rfx2.view.company.hanjung.purStock.ContractMaterialView', {
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

        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');
        this.addSearchField('maker_name');

        this.addCallback('CHECK_SP_CODE', function (combo, record) {

            gMain.selPanel.refreshStandard_flag(record);

        });

        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            switch(index) {
                case 1:case 2:case 3:case 4:case 5:
                buttonToolbar.items.remove(item);
                break;
                default:
                    break;
            }
        });

        //부자재 선택시 구분(sg_code) disabled로 이벤트처리
        this.addCallback('STANDARD_FLAG', function (o) {
            console_logs('addCallback>>>>>>>>>', o);
        });

        //console_logs('this.fields', this.fields);
        this.createStore('Rfx2.model.company.hanjung.ContractMaterial', [{
                property: 'unique_id',
                direction: 'DESC'
            }], gm.pageSize
            , {},
            ['srcahd']
        );

        var arr = [];
        arr.push(buttonToolbar);

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        arr.push(searchToolbar);

        this.contractMaterialStore = Ext.create('Rfx2.store.company.kbtech.ContractMaterialStore', {});

        // 자재 계약
        this.addContractMatAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus',
            text: '계약사 추가',
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
                                fieldLabel: gm.me().getColName('unique_id'),
                                xtype: 'textfield',
                                id: gu.id('unique_id'),
                                name: 'unique_id',
                                emptyText: '자재 UID',
                                value: rec.get('unique_id'),
                                flex: 1,
                                readOnly: true,
                                hidden: true,
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
                                fieldLabel: '공급사',
                                labelWidth: 80,
                                xtype: 'combo',
                                anchor: '100%',
                                name: 'supast_uid',
                                //id: 'mola',
                                mode: 'local',
                                displayField: 'supplier_name',
                                store: mStore,
                                sortInfo: {field: 'pj_name', direction: 'DESC'},
                                valueField: 'unique_id',
                                typeAhead: false,
                                minChars: 1,
                                flex: 1,
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{unique_id}">[{supplier_code}] {supplier_name}</div>';
                                    }
                                }
                            }, {
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
                                format: 'Y-m-d',
                                submitFormat: 'Y-m-d',
                                dateFormat: 'Y-m-d',
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
                        height: 350,
                        items: form,
                        buttons: [{
                            text: CMD_OK,
                            handler: function () {
                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                    console_logs('form val', val);
                                    gm.me().addContractMat(val, winPart);
                                } else {
                                    Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
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
        this.removeContractMatAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: '계약사 삭제',
            tooltip: '계약 삭제',
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title:'계약 삭제',
                    msg: '계약사를 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function(btn) {
                        if(btn=='yes') {

                            var grid = gu.getCmp('gridContractCompany');
                            var record = grid.getSelectionModel().getSelected().items[0];

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/material.do?method=removeContractMat',
                                params:{
                                    srcmapUid: record.get('unique_id_long')
                                },
                                success : function(result, request) {
                                    var resultText = result.responseText;
                                    console_log('result:' + resultText);
                                    gu.getCmp('gridContractCompany').getStore().load();
                                },
                                failure : extjsUtil.failureMessage
                            });//endof ajax request
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.gridContractCompany = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('gridContractCompany'),
            store: this.contractMaterialStore,
            viewConfig:{
                markDirty:false
            },
            collapsible: false,
            multiSelect: false,
            region: 'center',
            autoScroll: true,
            autoHeight: true,
            flex: 1,
            frame: true,
            //bbar: getPageToolbar(this.poCartListStore),
            border: true,
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            //selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '0 0 0 0',
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [
                        {
                            xtype: 'component',
                            id: gu.id('selectedMtrl'),
                            html: "자재를 선택하시기 바랍니다",
                            width: 700,
                            style: 'color:white;font-weight:normal;text-align:left;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;'
                        }
                    ]
                },
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [
                        this.addContractMatAction,
                        {
                            text: '▲',
                            listeners: [{
                                click: function () {
                                    var direction = -1;
                                    var grid = gu.getCmp('gridContractCompany');
                                    var record = grid.getSelectionModel().getSelected().items[0];
                                    if (!record) {
                                        return;
                                    }

                                    var index = grid.getStore().indexOf(record);
                                    if (direction < 0) {
                                        index--;
                                        if (index < 0) {
                                            return;
                                        }
                                    } else {
                                        index++;
                                        if (index >= grid.getStore().getCount()) {
                                            return;
                                        }
                                    }

                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/purchase/material.do?method=updateSortOrder',
                                        params: {
                                            srcmap_uid: record.get('unique_id'),
                                            srcahd_uid: record.get('srcahd_uid'),
                                            sort_order: record.get('sort_order') - 1
                                        },
                                        success: function (result, request) {
                                            var resultText = result.responseText;
                                            console_log('result:' + resultText);
                                        },
                                        failure: extjsUtil.failureMessage
                                    });//endof ajax request

                                    grid.getStore().remove(record);
                                    grid.getStore().insert(index, record);
                                    grid.getSelectionModel().select(index, true);

                                    var cnt = grid.getStore().getCount();
                                    var p_price = 0;
                                    for (var i = 0; i < cnt; i++) {
                                        var record = grid.getStore().getAt(i);
                                        record.set('sort_order', i + 1);
                                    }
                                }
                            }]
                        },
                        {
                            text: '▼',
                            listeners: [{
                                click: function () {
                                    var direction = 1;
                                    var grid = gu.getCmp('gridContractCompany');
                                    var record = grid.getSelectionModel().getSelected().items[0];
                                    if (!record) {
                                        return;
                                    }

                                    var index = grid.getStore().indexOf(record);
                                    if (direction < 0) {
                                        index--;
                                        if (index < 0) {
                                            return;
                                        }
                                    } else {
                                        index++;
                                        if (index >= grid.getStore().getCount()) {
                                            return;
                                        }
                                    }

                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/purchase/material.do?method=updateSortOrder',
                                        params: {
                                            srcmap_uid: record.get('unique_id'),
                                            srcahd_uid: record.get('srcahd_uid'),
                                            sort_order: record.get('sort_order') + 1
                                        },
                                        success: function (result, request) {
                                            var resultText = result.responseText;
                                            console_log('result:' + resultText);
                                        },
                                        failure: extjsUtil.failureMessage
                                    });//endof ajax request

                                    grid.getStore().remove(record);
                                    grid.getStore().insert(index, record);
                                    grid.getSelectionModel().select(index, true);

                                    var cnt = grid.getStore().getCount();
                                    var p_price = 0;
                                    for (var i = 0; i < cnt; i++) {
                                        var record = grid.getStore().getAt(i);
                                        record.set('sort_order', i + 1);
                                    }
                                }
                            }]
                        },
                        this.removeContractMatAction
                    ]
                }
            ],
            columns: [
                {text: '순위', width: 50,  style: 'text-align:center', dataIndex: 'sort_order', sortable: false},
                {text: '계약업체', width: 250,  style: 'text-align:center', dataIndex: 'supplier_name', sortable: false},
                {text: '계약단가', width: 100,  style: 'text-align:center', dataIndex: 'sales_price', sortable: false,
                    editor: 'textfield'
                },
                {text: '계약시작일', width: 100,  style: 'text-align:center', dataIndex: 'start_date', sortable: false,
                    renderer : Ext.util.Format.dateRenderer('Y-m-d')
                },
                {text: '계약종료일', width: 100,  style: 'text-align:center', dataIndex: 'end_date', sortable: false,
                    renderer : Ext.util.Format.dateRenderer('Y-m-d')
                },
            ],
            title: '계약 업체 리스트',
            name: 'po',
            autoScroll: true,
            listeners: {
                cellkeydown: function (td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    if(eOpts.ctrlKey && eOpts.keyCode === 67) {
                        var tempTextArea = document.createElement("textarea");
                        document.body.appendChild(tempTextArea);
                        tempTextArea.value = eOpts.target.innerText;
                        tempTextArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(tempTextArea);
                    }
                },
                edit: function (editor, e, eOpts) {

                    var columnName = e.field;
                    var tableName = 'srcmap';
                    var unique_id = e.record.getId();

                    var value = e.value;
                    var sort_order = e.record.get('sort_order');

                    gm.editAjax(tableName, columnName, value, 'unique_id', unique_id, {type:''});

                    if (columnName === 'sales_price' && sort_order === 1) {
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/purchase/material.do?method=updateSortOrder',
                            params: {
                                srcmap_uid: e.record.get('unique_id'),
                                srcahd_uid: e.record.get('srcahd_uid'),
                                sort_order: e.record.get('sort_order')
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

                    gm.me().store.load();
                }
            }
        });

        Ext.each(this.gridContractCompany.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            switch (dataIndex) {
                case 'sales_price':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
            }

            switch (dataIndex) {
                case 'sales_price':
                    columnObj["renderer"] = function (value, meta) {
                        if (meta != null) {
                            meta.css = 'custom-column';
                        }
                        return value;
                    };
                    break;
                default:
                    break;
            }

        });

        this.gridContractCompany.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                gm.me().removeContractMatAction.enable();
            }
        });

        //grid 생성.
        this.createGrid(arr);

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    //title: '제품 및 템플릿 선택',
                    collapsible: false,
                    frame: false,
                    region: 'west',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    width: '60%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        items: [this.grid]
                    }]
                },this.gridContractCompany
            ]
        });

        this.setAllMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '전체',
            tooltip: '전체',
            toggleGroup: 'matType',
            handler: function () {
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.load(function () {
                });
            }
        });
        // this.setAssyMatView = Ext.create('Ext.Action', {
        //     xtype: 'button',
        //     text: 'ASSY',
        //     tooltip: 'ASSEMBLY',
        //     toggleGroup: 'matType',
        //     handler: function () {
        //         gm.me().store.getProxy().setExtraParams({});
        //         gm.me().store.getProxy().setExtraParam('standard_flag', 'A');
        //         gm.me().store.getProxy().setExtraParam('sg_code', 'AASSY');
        //         gm.me().store.load(function () {
        //         });
        //     }
        // });
        // this.setSetMatView = Ext.create('Ext.Action', {
        //     xtype: 'button',
        //     text: 'SET',
        //     tooltip: 'SET',
        //     toggleGroup: 'matType',
        //     handler: function () {
        //         gm.me().store.getProxy().setExtraParams({});
        //         gm.me().store.getProxy().setExtraParam('standard_flag', 'A');
        //         gm.me().store.getProxy().setExtraParam('sg_code', 'SET00');
        //         gm.me().store.load(function () {
        //         });
        //     }
        // });
        this.setSaMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '원자재',
            tooltip: '원자재',
            toggleGroup: 'matType',
            handler: function () {
                this.matType = 'RAW';
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'S');
                gm.me().store.load(function () {
                });
            }
        });
        this.setMROView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: 'MRO',
            tooltip: '소모성',
            toggleGroup: 'matType',
            handler: function () {
                this.matType = 'SUB';
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'M');
                gm.me().store.load(function () {
                });
            }
        });
        this.setSubMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '부자재',
            tooltip: '부자재',
            toggleGroup: 'matType',
            handler: function () {
                this.matType = 'SUB';
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'B');
                gm.me().store.load(function () {
                });
            }
        });
        this.setUsedMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '상품',
            tooltip: '상품',
            toggleGroup: 'matType',
            handler: function () {
                this.matType = 'SUB';
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'P');
                gm.me().store.load(function () {
                });
            }
        });

        //버튼 추가.
        buttonToolbar.insert(6, '-');
        buttonToolbar.insert(6, this.setUsedMatView);
        buttonToolbar.insert(6, this.setMROView);
        buttonToolbar.insert(6, this.setSubMatView);
        buttonToolbar.insert(6, this.setSaMatView);
        // buttonToolbar.insert(6, this.setSetMatView);
        // buttonToolbar.insert(6, this.setAssyMatView);
        buttonToolbar.insert(6, this.setAllMatView);

        buttonToolbar.insert(6, '-');

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            this.removeContractMatAction.disable();
            if (selections.length) {
                var rec = selections[0];

                var itemCode = rec.get('item_code');
                var itemName = rec.get('item_name');
                var specification = rec.get('specification');

                gu.getCmp('selectedMtrl').setHtml('[' + itemCode + '] ' + itemName + ' / ' + specification);
                this.contractMaterialStore.getProxy().setExtraParam('srcahd_uid', rec.get('unique_id_long'));
                this.contractMaterialStore.load();
                this.addContractMatAction.enable();
            } else {
                this.addContractMatAction.disable();
            }
        })

        //디폴트 로드
        gMain.setCenterLoading(false);

        this.store.load(function (records) {

        });
    },

    addContractMat: function(val, win) {
        Ext.MessageBox.show({
            title:'계약',
            msg: '이 회사와 자재를 계약 처리 하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn: function(btn) {
                if(btn=='yes') {

                    win.setLoading(true);

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/purchase/material.do?method=addContractMat',
                        params:{
                            currency: val['currency'],
                            sales_price: val['sales_price'],
                            srcahd_uid: val['unique_id'],
                            supast_uid: val['supast_uid'],
                            start_date: val['start_date'],
                            end_date: val['end_date']
                        },
                        success : function(result, request) {
                            var resultText = result.responseText;
                            console_log('result:' + resultText);
                            gu.getCmp('gridContractCompany').getStore().load();
                            gm.me().store.load();
                            if(win) {
                                win.setLoading(false);
                                win.close();
                            }
                        },
                        failure : function() {
                            win.setLoading(false);
                            extjsUtil.failureMessage();
                        }
                    });//endof ajax request
                }
            },
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
        }
    }
});



