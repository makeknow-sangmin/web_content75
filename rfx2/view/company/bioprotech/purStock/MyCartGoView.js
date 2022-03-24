//출고요청 카트
Ext.define('Rfx2.view.company.bioprotech.purStock.MyCartGoView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'my-cart-go-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        //this.addSearchField('unique_id');
        this.setDefComboValue('standard_flag', 'valueField', 'R');

        Ext.each(this.columns, function (columnObj) {
            let dataIndex = columnObj["dataIndex"];

            if (dataIndex === 'pr_quan') {
                columnObj["editor"] = {};
                columnObj["css"] = 'edit-cell';
                columnObj["renderer"] = function (value, meta) {
                    meta.css = 'custom-column';

                    return value;
                };
            }
        });

        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');
        this.addSearchField(
            {
                type: 'combo'
                , width: 175
                , field_id: 'supplier_information'
                , store: "SupastStore"
                , displayField: 'supplier_name'
                , valueField: 'supplier_code'
                , emptyText: '공급사'
                , innerTpl: '<div data-qtip="{unique_id}">{supplier_name}|{supplier_code}</div>'

            });

        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');

        //검색툴바 생성
        let searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        let buttonToolbar = this.createCommandToolbar();

        // remove the items
        (buttonToolbar.items).each(function (item, index) {
            if (index === 3 || index === 1 || index === 2) {
                buttonToolbar.items.remove(item);
            }

        });

        //부자재 선택시 구분(sg_code) disabled로 이벤트처리
        this.addCallback('GET_OLD_VALUE', function (record) {

            gm.me().getValue = record; // 이전 값
            let old_value = record.value;
            gm.me().getValue = old_value;
        });
        this.localSize = gm.unlimitedPageSize;
        this.createStore('Rfx2.model.company.bioprotech.MyCartNstock', [{
                property: 'unique_id',
                direction: 'DESC',
            }],
            this.localSize,
            {
                item_code_dash: 's.item_code',
                comment: 's.comment1'
            },
            ['mycart']
        );

        //grid 생성.
        this.createGrid(searchToolbar, buttonToolbar);

        this.createCrudTab();

        this.mtrlStore = Ext.create('Rfx2.store.company.kbtech.ExtendSrcahdStore', {});

        this.mtrlStore.getProxy().setExtraParam('notify_flag_use', '%false%');
        this.mtrlStore.getProxy().setExtraParam('not_sg_code_list', 'CS');
        this.mtrlStore.load();

        this.itemSearchAction = Ext.create('Ext.Action', {
            iconCls: 'af-search',
            text: CMD_SEARCH/*'검색'*/,
            tooltip: CMD_SEARCH/*'검색'*/,
            disabled: false,
            handler: function () {
                let item_code = gu.getCmp('srch_item_code').getValue();

                let item_name = gu.getCmp('srch_item_name').getValue();
                let specification = gu.getCmp('srch_specification').getValue();


                if (item_code.length === 0) {
                    gm.me().mtrlStore.getProxy().setExtraParam('item_code', '');
                } else {
                    gm.me().mtrlStore.getProxy().setExtraParam('item_code', '%' + item_code + '%');
                }

                if (item_name.length === 0) {
                    gm.me().mtrlStore.getProxy().setExtraParam('item_name', '');
                } else {
                    gm.me().mtrlStore.getProxy().setExtraParam('item_name', '%' + item_name + '%');
                }
                if (specification.length === 0) {
                    gm.me().mtrlStore.getProxy().setExtraParam('specification', '');
                } else {
                    gm.me().mtrlStore.getProxy().setExtraParam('specification', '%' + specification + '%');
                }

                gm.me().mtrlStore.getProxy().setExtraParam('notify_flag_use', '%false%');

                gm.me().mtrlStore.getProxy().setExtraParam('not_sg_code_list', 'CS');
                gm.me().mtrlStore.load();
            }
        });

        this.addCartAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'fa-cart-arrow-down_14_0_5395c4_none',
            text: gm.getMC('CMD_Add_List', '목록추가'),
            tooltip: gm.getMC('CMD_Add_List_Exp', '목록을 추가합니다'),
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('addCartAction'),
            handler: function () {
                let srcahd_uids = [];
                let stoqty_uids = [];
                let item_codes = [];
                let selections = gm.me().gridMtrl.getSelectionModel().getSelection();

                for (let rec of selections) {
                    let srcahd_uid = rec.get('unique_id_long');
                    let item_code = rec.get('item_code');

                    srcahd_uids.push(srcahd_uid);
                    stoqty_uids.push(-1);
                    item_codes.push(item_code);
                }

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/purchase/request.do?method=addMyCartGo',
                    params: {
                        srcahd_uids: srcahd_uids,
                        item_codes: item_codes,
                        stoqty_uids: stoqty_uids,
                        reserved1: 'N'
                    },
                    success: function () {
                        gm.me().store.load();
                    },
                });
            }
        });

        this.gridMtrl = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('gridMtrl'),
            store: this.mtrlStore,
            viewConfig: {
                markDirty: false
            },
            selModel: 'checkboxmodel',
            collapsible: false,
            multiSelect: false,
            region: 'center',
            autoHeight: true,
            flex: 0.5,
            frame: false,
            bbar: getPageToolbar(this.mtrlStore),
            border: true,
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            margin: '0 0 0 0',
            columns: [],
            name: 'po',
            autoScroll: true,
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        this.itemSearchAction,
                        this.addCartAction
                    ]
                },
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    layout: 'column',
                    items: [
                        {
                            xtype: 'triggerfield',
                            emptyText: '품번',
                            id: gu.id('srch_item_code'),
                            width: 130,
                            fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                            listeners: {
                                specialkey: function (field, e) {
                                    if (e.getKey() === Ext.EventObject.ENTER) {
                                        gm.me().mtrlStore.getProxy().setExtraParam('item_code', gm.me().vaildSearchParam(gu.getCmp('srch_item_code').getValue()));
                                        gm.me().mtrlStore.getProxy().setExtraParam('item_name', gm.me().vaildSearchParam(gu.getCmp('srch_item_name').getValue()));
                                        gm.me().mtrlStore.getProxy().setExtraParam('specification', gm.me().vaildSearchParam(gu.getCmp('srch_specification').getValue()));
                                        gm.me().mtrlStore.load();
                                    }
                                }
                            },
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            'onTrigger1Click': function () {
                                gu.getCmp('srch_item_code').setValue('');
                                gm.me().mtrlStore.getProxy().setExtraParam('item_code', gu.getCmp('srch_item_code').getValue());
                                gm.me().mtrlStore.load();
                            },

                        },
                        {
                            xtype: 'triggerfield',
                            emptyText: '품명',
                            id: gu.id('srch_item_name'),
                            width: 130,
                            fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                            listeners: {
                                specialkey: function (field, e) {
                                    if (e.getKey() === Ext.EventObject.ENTER) {
                                        gm.me().mtrlStore.getProxy().setExtraParam('item_code', gm.me().vaildSearchParam(gu.getCmp('srch_item_code').getValue()));
                                        gm.me().mtrlStore.getProxy().setExtraParam('item_name', gm.me().vaildSearchParam(gu.getCmp('srch_item_name').getValue()));
                                        gm.me().mtrlStore.getProxy().setExtraParam('specification', gm.me().vaildSearchParam(gu.getCmp('srch_specification').getValue()));
                                        gm.me().mtrlStore.load();
                                    }

                                }
                            },
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            'onTrigger1Click': function () {
                                gu.getCmp('srch_item_name').setValue('');
                                gm.me().mtrlStore.getProxy().setExtraParam('item_name', gu.getCmp('srch_item_name').getValue());
                                gm.me().mtrlStore.load();
                            }
                        },

                        {
                            xtype: 'triggerfield',
                            emptyText: '규격',
                            id: gu.id('srch_specification'),
                            width: 130,
                            fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                            listeners: {
                                specialkey: function (field, e) {
                                    if (e.getKey() === Ext.EventObject.ENTER) {
                                        gm.me().mtrlStore.getProxy().setExtraParam('item_code', gm.me().vaildSearchParam(gu.getCmp('srch_item_code').getValue()));
                                        gm.me().mtrlStore.getProxy().setExtraParam('item_name', gm.me().vaildSearchParam(gu.getCmp('srch_item_name').getValue()));
                                        gm.me().mtrlStore.getProxy().setExtraParam('specification', gm.me().vaildSearchParam(gu.getCmp('srch_specification').getValue()));
                                        gm.me().mtrlStore.load();
                                    }
                                }
                            },
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            'onTrigger1Click': function () {
                                gu.getCmp('srch_specification').setValue('');
                                gm.me().mtrlStore.getProxy().setExtraParam('specification', gu.getCmp('srch_specification').getValue());
                                gm.me().mtrlStore.load();
                            }
                        }
                    ]
                }
            ]
        });

        gm.extFieldColumnStore.load({
            params: {menuCode: 'PMT1_CARG_SUB'},


            direction: 'ASC',

            callback: function (records, operation, success) {
                if (success) {
                    let obj = gm.parseGridRecord(records, gu.id('gridMtrl'));
                    gm.me().gridMtrl.reconfigure(gm.me().mtrlStore, obj['columns']);
                }
            },
            scope: this
        });

        this.gridMtrl.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    gm.me().addCartAction.enable();
                } else {
                    gm.me().addCartAction.disable();
                }
            }
        });

        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    collapsible: false,
                    frame: false,
                    region: 'west',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    width: '45%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        items: [this.gridMtrl]
                    }]
                },
                this.grid
            ]
        });

        this.reReceiveAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '출고요청',
            hidden: gu.setCustomBtnHiddenProp('reReceiveAction'),
            disabled: true,
            handler: function () {

                let receiveForm = Ext.create('Ext.form.Panel', {
                    id: gu.id('formPanelReceive'),
                    defaultType: 'textfield',
                    border: false,
                    bodyPadding: 15,
                    region: 'center',
                    defaults: {
                        anchor: '100%',
                        allowBlank: false,
                        msgTarget: 'side',
                        labelWidth: 100
                    },
                    items: [
                        {
                            fieldLabel: '출고유형',
                            xtype: 'combo',
                            width: 550,
                            id: gu.id('mat_release_category'),
                            name: 'reserved_varchar4',
                            store: Ext.create('Rfx2.store.company.bioprotech.CommonCodeStore',
                                {parentCode: 'MAT_RELEASE_CATEGORY', excludeCode: ['GAA']}),
                            displayField: 'code_name_kr',
                            valueField: 'system_code',
                            emptyText: '선택',
                            allowBlank: false,
                            value: 'GAB',
                            sortInfo: {field: 'code_order', direction: 'DESC'},
                            typeAhead: false,
                            minChars: 1,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">{code_name_kr}</div>';
                                }
                            }
                        },
                        {
                            fieldLabel: '출고요청일',
                            name: 'req_date',
                            allowBlank: false,
                            xtype: 'datefield',
                            value: new Date(),
                            format: 'Y-m-d',// 'Y-m-d H:i:s',
                            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                            dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                            anchor: '100%'
                        }
                    ]
                });

                gu.getCmp('mat_release_category').store.load();

                let win = Ext.create('ModalWindow', {
                    title: '',
                    width: 350,
                    height: 160,
                    items: receiveForm,
                    buttons: [{
                        text: CMD_OK,
                        handler: function () {
                            let form = gu.getCmp('formPanelReceive').getForm();
                            if (form.isValid()) {
                                let val = form.getValues(false);
                                let selections = gm.me().grid.getSelectionModel().getSelection();
                                if (selections.length) {
                                    gm.me().rec = selections[0];
                                    let stoqty_uids = [];
                                    let pr_quans = [];
                                    let req_date = val['req_date'];
                                    let reserved_varchar4 = val['reserved_varchar4'];
                                    let whs = [];
                                    let item_names = [];
                                    let childs = [];
                                    let mycart_uids = [];
                                    let pl_nos = [];

                                    for (let obj of selections) {
                                        mycart_uids.push(obj.get('id'));
                                        stoqty_uids.push(obj.get('stoqty_uid'));
                                        childs.push(obj.get('child'));
                                        whs.push(obj.get('wh_qty'));
                                        pr_quans.push(obj.get('pr_quan'));
                                        item_names.push(obj.get('item_name'));
                                        pl_nos.push(obj.get('pl_no'));
                                    }

                                    Ext.MessageBox.show({
                                        title: '확인',
                                        msg: '요청 하시겠습니까?',
                                        buttons: Ext.MessageBox.YESNO,
                                        fn: function (result) {
                                            if (result === 'yes') {
                                                if (pr_quans.length > 0) {

                                                    Ext.Ajax.request({
                                                        url: CONTEXT_PATH + '/purchase/request.do?method=createBuyingRequestGoAttr',
                                                        params: {
                                                            childs: childs,
                                                            item_name: item_names[0],
                                                            mycart_uids: mycart_uids,
                                                            pl_nos: pl_nos,
                                                            pr_quans: pr_quans,
                                                            req_date: req_date,
                                                            reserved_varchar4: reserved_varchar4,
                                                            reserved1: 'Y',
                                                            stoqty_uids: stoqty_uids,
                                                            wh_qtys: whs
                                                        },
                                                        success: function () {
                                                            gm.me().store.load();
                                                            if (win) {
                                                                win.close();
                                                            }
                                                            Ext.Msg.alert('안내', '요청하었습니다.');
                                                        },//endofsuccess
                                                        failure: extjsUtil.failureMessage
                                                    });//endofajax
                                                } else {
                                                    Ext.Msg.alert('다시 입력', '요청수량을 입력해주세요.');
                                                }
                                            }
                                        },
                                        //animateTarget: 'mb4',
                                        icon: Ext.MessageBox.QUESTION
                                    });
                                }//endof if selectios
                            } else {
                                Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                            }
                        }//endofhandler
                    }, {
                        text: CMD_CANCEL,
                        handler: function () {
                            if (win) {
                                win.close();
                            }
                        }
                    }
                    ],
                    icon: Ext.MessageBox.QUESTION
                });
                win.show();
            }
        });

        buttonToolbar.insert(3, this.reReceiveAction);
        buttonToolbar.insert(3, '-');
        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                let rec = selections[0];
                gm.me().rec = rec;
                let q = [];
                let whArr = [];

                for (let obj of selections) {

                    let pr_quans = obj.get('pr_quan');
                    let wh_qty = obj.get('wh_qty');
                    q.push(pr_quans);
                    whArr.push(wh_qty);
                    gm.me().vSELECTED_WH_QTYS = whArr;
                    gm.me().vSELECTED_PR_QUANS = q;
                }
                gm.me().vSELECTED_UNIQUE_ID = rec.get('unique_id');
                gm.me().vSELECTED_item_code = rec.get('item_code');    // 품번
                gm.me().vSELECTED_item_name = rec.get('item_name');    // 품명
                gm.me().vSELECTED_SRCAHD_UID = rec.get('child');
                gm.me().vSELECTED_STOQTY_UID = rec.get('stoqty_uid');
                gm.me().vSELECTED_STOCK_QTY = rec.get('stock_qty');

                gm.me().reReceiveAction.enable();
            } else {

                gm.me().reReceiveAction.disable();
            }
        })

        //디폴트 로드
        gMain.setCenterLoading(false);

        this.store.getProxy().setExtraParam('cart_type', 'GO');
        this.store.getProxy().setExtraParam('order_by', 'order by pl_no asc');
        this.store.load();
    },
    items: [],
    matType: 'RAW',
    stockviewType: "ALL",
    editRedord: function (field, rec) {
        if (field === 'pr_quan') {
            this.updateDesinComment(rec);
        }
    },
    updateDesinComment: function (rec) {
        let child = rec.get('child');
        let pr_quan = rec.get('pr_quan');//새로 입력된 수량
        let assymap_uid = rec.get('assymap_uid');

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/request.do?method=updateMyCartQty',
            params: {
                child: child,
                assymap_uid: assymap_uid,
                pr_quan: pr_quan
            },
            success: function (result) {
                console_logs('result', result.responseText);
            },
            failure: extjsUtil.failureMessage
        });
    },
    nextRow: true,

    vaildSearchParam: function (a) {
        if (a != null && a != '') {
            var c = '%' + a + '%';
            return c;
        } else {
            return null;
        }
    }
});



