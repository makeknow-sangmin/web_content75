Ext.define('Rfx2.view.company.bioprotech.stockMgmt.CapaView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'capa-view',


    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField({
            type: 'checkbox',
            field_id: 'isOnlyCapa',
            items: [
                {
                    boxLabel: 'Capa 품목만',
                    checked: true
                },
            ],
        });

        // 제품군 검색조건
        this.addSearchField({
            field_id: 'class_name'
            , store: 'ClassNameStore'
            , displayField: 'class_name'
            , valueField: 'class_name'
            , value: 'class_name'
            , innerTpl: '<div data-qtip="{class_name}">{class_name}</div>'
        });

        // 소분류 검색조건
        this.addSearchField({
            type: 'combo'
            , field_id: 'sg_code'
            , store: "SubclassStore"
            , displayField: 'class_code'
            , valueField: 'class_code'
            , value: 'class_code'
            , innerTpl: '<div data-qtip="{class_code}">{class_code}</div>'
        });

        // 품번 검색조건
        this.addSearchField('item_code');

        // 품명 검색조건
        this.addSearchField('item_name');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE']
        });

        //모델을 통한 스토어 생성
        this.createStore('Rfx2.store.company.bioprotech.ProductCapaStore', [{
                property: 'unique_id',
                direction: 'ASC'
            }],
            gm.pageSize
            , {}
            , ['']
        );

        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        //grid 생성.
        this.createGrid(arr);
        this.createCrudTab();

        // CAPAMAP 스토어
        this.cpapListStore = Ext.create('Rfx2.store.company.bioprotech.CapaListStore', {pageSize: 100});

        // ---------------------------버튼
        // 등록
        this.addCapaMap = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus-circle',
            text: gm.getMC('CMD_Enrollment', '등록'),
            tooltip: this.getMC('msg_btn_prd_add', '제품별 라인 CAPA 등록'),
            hidden: gu.setCustomBtnHiddenProp('addCapaMap'),
            disabled: true,
            handler: function () {
                // 라인 스토어 
                var mchn_store = Ext.create('Mplm.store.MachineStore', {});
                mchn_store.getProxy().setExtraParam('mchn_types', 'LINE|GROUP');

                // 메인그리드에서 선택한 한행의 정보를 다 가져오는 것
                var selections = gm.me().grid.getSelectionModel().getSelection();
                var srcahdUids = [];
                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];
                    var srcahdUid = rec.get('unique_id_long');
                    srcahdUids.push(srcahdUid);
                }
                if (selections.length > 0) {
                    var rec = selections[0];

                    var form = Ext.create('Ext.form.Panel', {
                        xtype: 'form',
                        width: 330,
                        bodyPadding: 15,
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        }, defaults: {
                            allowBlank: true,
                            msgTarget: 'side',
                            labelWidth: 80
                        }, items: [
                            {
                                fieldLabel: '라인 명',
                                xtype: 'combo',
                                store: mchn_store,
                                id: gu.id('line_np'),
                                name: 'line_np',
                                flex: 1,
                                emptyText: '선택해주세요.',
                                displayField: 'name_ko',
                                valueField: 'mchn_code',
                                typeAhead: false,
                                minChars: 1,
                                listConfig: {
                                    loadingText: 'Searching...',
                                    emptyText: 'No matching posts found.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{mchn_code}">{name_ko}</div>';
                                    }
                                },
                                listeners: {
                                    select: function (combo, record) {
                                    },
                                },
                            },
                            {
                                fieldLabel: 'CAPA(UPH)',
                                xtype: 'numberfield',
                                id: gu.id('capa'),
                                name: 'capa',
                                flex: 1
                            }
                        ]

                    });

                    var winPart = Ext.create('ModalWindow', {
                        title: '추가',
                        width: 350,
                        height: 150,
                        items: form,
                        buttons: [{
                            text: '확인',
                            handler: function () {
                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                    var srcahd_uid = rec.get('unique_id_long');
                                    console_logs('srcahd_uid ???????', srcahd_uid);
                                    var item_code = rec.get('item_code');
                                    gm.me().addCapaFnc(val, srcahdUids, item_code, winPart);
                                } else {
                                    Ext.MessageBox.alert(rror_msg_prompt, error_msg_content)
                                }
                            }
                        }, {
                            text: '취소',
                            handler: function () {
                                if (winPart) {
                                    winPart.close();
                                }
                            }
                        }]
                    });
                    winPart.show();
                }
            }

        });

        // 수정
        this.updateCapaMap = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-edit',
            text: gm.getMC('CMD_MODIFY', '수정'),
            tooltip: this.getMC('msg_btn_prd_add', '제품별 라인 CAPA 수정'),
            hidden: gu.setCustomBtnHiddenProp('updateCapaMap'),
            disabled: true,
            handler: function () {
                // 라인 스토어
                var mchn_store = Ext.create('Mplm.store.MachineStore', {});
                mchn_store.getProxy().setExtraParam('mchn_types', 'LINE|GROUP');

                // 메인그리드에서 선택한 한행의 정보를 다 가져오는 것
                var selections = gm.me().grid.getSelectionModel().getSelection();

                // 서브 그리드에서 선택한 한행의 정보를 다 가져오는 것
                var selectionsCapa = gm.me().gridCapaList.getSelectionModel().getSelection()[0];

                mchn_store.load();

                if (selections.length > 0) {
                    var form = Ext.create('Ext.form.Panel', {
                        xtype: 'form',
                        width: 330,
                        bodyPadding: 15,
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        }, defaults: {
                            allowBlank: true,
                            msgTarget: 'side',
                            labelWidth: 80
                        }, items: [
                            {
                                fieldLabel: '라인 명',
                                xtype: 'combo',
                                store: mchn_store,
                                id: gu.id('line_np'),
                                name: 'line_np',
                                flex: 1,
                                emptyText: '선택해주세요.',
                                displayField: 'name_ko',
                                valueField: 'mchn_code',
                                value: selectionsCapa.get('line_np'),
                                typeAhead: false,
                                minChars: 1,
                                listConfig: {
                                    loadingText: 'Searching...',
                                    emptyText: 'No matching posts found.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{mchn_code}">{name_ko}</div>';
                                    }
                                },
                                listeners: {
                                    select: function (combo, record) {
                                    },
                                },
                            },
                            {
                                fieldLabel: 'CAPA(UPH)',
                                xtype: 'numberfield',
                                id: gu.id('capa'),
                                name: 'capa',
                                value: selectionsCapa.get('capa'),
                                flex: 1
                            }
                        ]

                    });

                    var winPart = Ext.create('ModalWindow', {
                        title: '수정',
                        width: 350,
                        height: 150,
                        items: form,
                        buttons: [{
                            text: '확인',
                            handler: function () {
                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                    var unique_id = selectionsCapa.get('unique_id_long');
                                    gm.me().saveCapaFnc(val, winPart, unique_id);
                                } else {
                                    Ext.MessageBox.alert(rror_msg_prompt, error_msg_content)
                                }
                            }
                        }, {
                            text: '취소',
                            handler: function () {
                                if (winPart) {
                                    winPart.close();
                                }
                            }
                        }]
                    });
                    winPart.show();

                }


            }
        });

        // 삭제
        this.deleteCapaMap = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: gm.getMC('CMD_DELETE', '삭제'),
            tooltip: this.getMC('msg_btn_prd_add', '제품별 라인 CAPA 삭제'),
            hidden: gu.setCustomBtnHiddenProp('deleteCapaMap'),
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title: 'CAPA 삭제',
                    msg: 'CAPA 를 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (btn) {
                        if (btn == 'yes') {

                            var selectionsCapa = gm.me().gridCapaList.getSelectionModel().getSelection()[0];

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/production/capa.do?method=capaDelete',
                                params: {
                                    unique_id: selectionsCapa.get('unique_id_long')
                                },
                                success: function (result, request) {
                                    var resultText = result.responseText;
                                    console_log('result:' + resultText);
                                    gm.me().store.load();
                                    gm.me().cpapListStore.load();
                                },
                                failure: extjsUtil.failureMessage
                            });

                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        //CAPAMAP GRID
        this.gridCapaList = Ext.create('Ext.grid.Panel', {
            store: this.cpapListStore,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            bbar: getPageToolbar(this.cpapListStore),
            border: true,
            region: 'center',
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '5 0 0 0',
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [this.addCapaMap, this.updateCapaMap, this.deleteCapaMap]
                }
            ],
            columns: [
                {text: '라인번호', width: 150, style: 'text-align:center', align: 'left', dataIndex: 'line_np'},
                {text: '라인명', width: 150, style: 'text-align:center', align: 'left', dataIndex: 'name_ko'},
                {text: 'CAPA(UPH)', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'capa'},
            ],
            title: '상세정보',
            name: 'capa',
            autoScroll: true,
            listeners: {
                edit: function (editor, e, eOpts) {

                    var columnName = e.field;
                    var tableName = 'capamap';
                    var unique_id = e.record.getId();
                    var value = e.value;

                    switch (columnName) {
                        case 'static_sales_price':
                            columnName = 'sales_price';
                            break;
                        default:
                            break;
                    }

                    var cStore = gm.me().cpapListStore;
                    var rec = cStore.getAt(0);
                    var _quan = rec.get('quan') / rec.get('bm_quan');

                    var assymap_uid = e.record.get('coord_key3');

                    gm.editAjax(tableName, columnName, value, 'unique_id', unique_id, {type: ''});
                    gm.editAjax(tableName, 'pr_quan', value * _quan, 'unique_id', unique_id, {type: ''});
                    gm.editAjax('assymap', 'bm_quan', value, 'unique_id', assymap_uid, {type: ''});
                    gm.me().cpapListStore.getProxy().setExtraParam('update_qty', 'Y');
                    gm.me().cpapListStore.load();
                }
            }
        });


        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    collapsible: false,
                    frame: true,
                    region: 'west',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    width: '70%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        flex: 0,
                        items: [this.grid]
                    }]
                }, this.gridCapaList
            ]
        });

        this.callParent(arguments);

        //디폴트 로드
        gm.setCenterLoading(false);
        this.store.getProxy().setExtraParam('isOnlyCapa', 'true');
        this.storeLoad();

        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                console_logs('rec ??????', selections);
                this.addCapaMap.enable();
                var rec = selections[0];
                var srcahd_uid = rec.get('unique_id_long');
                this.gridCapaList.getStore().getProxy().setExtraParam('srcahd_uid', srcahd_uid);
                this.gridCapaList.getStore().load(function (record) {
                });
            } else {
                this.addCapaMap.disable();
            }
        });

        this.gridCapaList.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections) {
                    gm.me().updateCapaMap.enable();
                    gm.me().deleteCapaMap.enable();
                    gm.me().gridCapaList.getStore().load(function (record) {
                    });
                } else {
                    gm.me().updateCapaMap.disable();
                    gm.me().deleteCapaMap.disable();
                }
            }
        });
    },

    addCapaFnc: function (val, srcahdUids, item_code, win) {
        Ext.MessageBox.show({
            title: '등록',
            msg: '제품별 라인 CAPA를 등록하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn: function (btn) {
                if (btn == 'yes') {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/production/capa.do?method=capaInsert',
                        params: {
                            line_np: val['line_np'],
                            capa: val['capa'],
                            srcahdUids: srcahdUids,
                            item_code: item_code
                        },
                        success: function (result, request) {
                            var resultText = result.responseText;
                            console_log('result:' + resultText);
                            gm.me().store.load();
                            gm.me().cpapListStore.load();
                            if (win) {
                                win.close();
                            }
                        },
                        failure: extjsUtil.failureMessage
                    });//endof ajax request
                }
            },
            icon: Ext.MessageBox.QUESTION
        });
    },

    saveCapaFnc: function (val, win, unique_id) {
        Ext.MessageBox.show({
            title: '수정',
            msg: '제품별 라인 CAPA를 수정하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn: function (btn) {
                if (btn == 'yes') {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/production/capa.do?method=capaUpdate',
                        params: {
                            line_np: val['line_np'],
                            capa: val['capa'],
                            unique_id: unique_id
                        },
                        success: function (result, request) {
                            var resultText = result.responseText;
                            console_log('result:' + resultText);
                            gm.me().store.load();
                            gm.me().cpapListStore.load();
                            if (win) {
                                win.close();
                            }
                        },
                        failure: extjsUtil.failureMessage
                    });//endof ajax request
                }
            },
            icon: Ext.MessageBox.QUESTION
        });
    }

});