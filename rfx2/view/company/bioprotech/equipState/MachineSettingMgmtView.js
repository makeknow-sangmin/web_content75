//설비현황
Ext.define('Rfx2.view.company.bioprotech.equipState.MachineSettingMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'machine-setting-mgmt-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        //검색툴바 추가
        this.addSearchField({
            type: 'checkbox',
            field_id: 'isMachineSetting',
            items: [
                {
                    boxLabel: '설정한 것만',
                    checked: true
                },
            ],
        });

        this.addSearchField('item_code');
        this.addSearchField('item_name');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: [
                'VIEW', 'EXCEL', /*'SEARCH',*/ 'REGIST', 'COPY', 'EDIT', 'REMOVE'
            ],
            RENAME_BUTTONS: []
        });

        this.createStore('Rfx2.model.company.bioprotech.ProductMgmt', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gm.pageSize
            , {
                item_code_dash: 's.item_code',
                comment: 's.comment1'
            },
            ['srcahd']
        );

        this.machineTemplateStore = Ext.create('Mplm.store.ClaastStore', {
            pageSize: 1000000,
            identification_code: 'MACHINE_SETTING'
        });

        this.bufferStore = new Ext.data.Store();

        // 템플릿 불러오기
        this.loadTemplateAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus-circle',
            text: gm.getMC('CMD_Copy_from_Templete', '템플릿 불러오기'),
            tooltip: '템플릿 불러오기',
            hidden: gu.setCustomBtnHiddenProp('loadTemplateAction'),
            handler: function () {

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
                            fieldLabel: '템플릿명',
                            xtype: 'combo',
                            name: 'class_code',
                            store: gm.me().machineTemplateStore,
                            displayField: 'class_name',
                            valueField: 'class_code',
                            hideLabel: false,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{code}">{class_name}</div>';
                                }
                            },
                            listeners: {
                                expand: function () {

                                    var rec = gm.me().grid.getSelectionModel().getSelection()[0];

                                    gm.me().machineTemplateStore.getProxy().setExtraParam('level1', 1);
                                    gm.me().machineTemplateStore.load();
                                }
                            }
                        }
                    ]
                });

                var winPart = Ext.create('ModalWindow', {
                    title: gm.getMC('CMD_Copy_from_Templete', '템플릿 불러오기'),
                    width: 500,
                    height: 130,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function () {
                            if (form.isValid()) {
                                var val = form.getValues(false);

                                var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                                var srcahd_uid = rec.get('unique_id_long');

                                Ext.MessageBox.show({
                                    title: '템플릿 추가',
                                    msg: '해당 템플릿으로 불러오시겠습니까?\n기존 템플릿 내용은 초기화 됩니다.',
                                    buttons: Ext.MessageBox.YESNO,
                                    fn: function (btn) {
                                        if (btn == 'yes') {
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/production/machine.do?method=loadMachineSettingTemplate',
                                                params: {
                                                    class_code: val['class_code'],
                                                    srcahd_uid: srcahd_uid
                                                },
                                                success: function (result, request) {
                                                    var jsonData = Ext.JSON.decode(result.responseText);

                                                    var store = gm.me().bufferStore;

                                                    store.removeAll();

                                                    for (var i = 0; i < jsonData.count; i++) {

                                                        var rec = jsonData.datas[i];

                                                        store.insert(store.getCount(), new Ext.data.Record({
                                                            'unique_id_long': rec.unique_id_long,
                                                            'seq': rec.seq,
                                                            'column_name': rec.column_name,
                                                            'column_value': rec.column_value
                                                        }));
                                                    }

                                                    if (winPart) {
                                                        winPart.close();
                                                    }
                                                },
                                                failure: extjsUtil.failureMessage
                                            });//endof ajax request
                                        }
                                    },
                                    icon: Ext.MessageBox.QUESTION
                                });
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
            }
        });

        // 템플릿 불러오기
        this.resetTemplateAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: CMD_INIT,
            tooltip: CMD_INIT,
            hidden: gu.setCustomBtnHiddenProp('resetTemplateAction'),
            handler: function () {


                Ext.MessageBox.show({
                    title: '초기화',
                    msg: '템플릿을 초기화 하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (btn) {
                        if (btn == 'yes') {

                            var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                            var srcahd_uid = rec.get('unique_id_long');

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/production/machine.do?method=resetMachineSettingTemplate',
                                params: {
                                    srcahd_uid: srcahd_uid
                                },
                                success: function (result, request) {
                                    var jsonData = Ext.JSON.decode(result.responseText);

                                    var store = gm.me().bufferStore;

                                    store.removeAll();
                                },
                                failure: extjsUtil.failureMessage
                            });//endof ajax request
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.gridTemplateBuffer = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('gridTemplateBuffer'),
            store: this.bufferStore,
            viewConfig: {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            region: 'center',
            autoScroll: true,
            autoHeight: true,
            flex: 1,
            frame: true,
            border: true,
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2
            },
            margin: '0 0 0 0',
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        this.loadTemplateAction,
                        this.resetTemplateAction
                    ]
                }
            ],
            columns: [
                {text: '순서', width: 50, style: 'text-align:center', dataIndex: 'seq', sortable: true},
                {text: '항목', width: 150, style: 'text-align:center', dataIndex: 'column_name', sortable: true},
                {
                    text: '값',
                    width: 150,
                    style: 'text-align:center',
                    editor: 'textfield',
                    dataIndex: 'column_value',
                    sortable: true
                }
            ],
            title: gm.getMC('CMD_Setting', '설비 Setting'),
            name: 'machine_setting',
            autoScroll: true,

            listeners: {
                cellkeydown: function (td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    if (eOpts.ctrlKey && eOpts.keyCode === 67) {
                        var tempTextArea = document.createElement("textarea");
                        document.body.appendChild(tempTextArea);
                        tempTextArea.value = eOpts.target.innerText;
                        tempTextArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(tempTextArea);
                    }
                },
                edit: function (editor, e, eOpts) {

                    var tableName = 'j3_buffer';
                    var unique_id = e.record.get('unique_id_long');

                    var seq = e.record.get('seq');
                    seq = seq - 1;

                    var columnName = 'v0' + (seq > 9 ? seq : '0' + seq);

                    var column_name = e.record.get('column_name');
                    var column_value = e.record.get('column_value');

                    var value = column_name + ':' + column_value;

                    gm.editAjax(tableName, columnName, value, 'unique_id', unique_id, {type: ''});
                }
            }
        });

        this.purListSrch = Ext.create('Ext.Action', {
            itemId: 'putListSrch',
            iconCls: 'af-search',
            text: CMD_SEARCH/*'검색'*/,
            disabled: false,
            handler: function (widget, event) {
                gm.me().clMachineSettingStore.load();
            }
        });

        this.clMachineSettingStore = Ext.create('Mplm.store.ClaastStore', {
            pageSize: 100,
            identification_code: 'MACHINE_SETTING'
        });
        this.clMachineSettingColumnStore = Ext.create('Mplm.store.ClaastStore', {
            pageSize: 100,
            identification_code: 'MACHINE_SETTING'
        });

        // 템플릿 추가
        this.addTemplateAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus-circle',
            text: '템플릿 추가',
            tooltip: '템플릿 추가',
            handler: function () {

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
                            fieldLabel: '템플릿명',
                            xtype: 'textfield',
                            id: gu.id('template_name'),
                            name: 'template_name',
                            flex: 1
                        },
                        {
                            fieldLabel: '설명',
                            xtype: 'textfield',
                            id: gu.id('comment'),
                            name: 'comment',
                            flex: 1
                        }
                    ]
                });

                var winPart = Ext.create('ModalWindow', {
                    title: '템플릿 추가',
                    width: 500,
                    height: 150,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function () {
                            if (form.isValid()) {
                                var val = form.getValues(false);
                                Ext.MessageBox.show({
                                    title: '템플릿 추가',
                                    msg: '템플릿을 추가하시겠습니까?',
                                    buttons: Ext.MessageBox.YESNO,
                                    fn: function (btn) {
                                        if (btn == 'yes') {
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/production/machine.do?method=addMachineSettingTemplate',
                                                params: {
                                                    template_name: val['template_name'],
                                                    comment: val['comment']
                                                },
                                                success: function (result, request) {
                                                    var resultText = result.responseText;
                                                    gm.me().clMachineSettingStore.load();
                                                    if (winPart) {
                                                        winPart.close();
                                                    }
                                                },
                                                failure: extjsUtil.failureMessage
                                            });//endof ajax request
                                        }
                                    },
                                    icon: Ext.MessageBox.QUESTION
                                });
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
            }
        });

        // 템플릿 수정
        this.editTemplateAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-edit',
            text: '템플릿 수정',
            tooltip: '템플릿 수정',
            handler: function () {

                var rec = gm.me().gridTemplateList.getSelectionModel().getSelection()[0];

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
                            xtype: 'hiddenfield',
                            name: 'unique_id_long',
                            value: rec.get('unique_id_long')
                        },
                        {
                            fieldLabel: '템플릿명',
                            xtype: 'textfield',
                            id: gu.id('template_name_edit'),
                            name: 'template_name',
                            value: rec.get('class_name'),
                            flex: 1
                        },
                        {
                            fieldLabel: '설명',
                            xtype: 'textfield',
                            id: gu.id('comment_edit'),
                            name: 'comment',
                            value: rec.get('comment'),
                            flex: 1
                        }
                    ]
                });

                var winPart = Ext.create('ModalWindow', {
                    title: '템플릿 수정',
                    width: 500,
                    height: 150,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function () {
                            if (form.isValid()) {
                                var val = form.getValues(false);
                                Ext.MessageBox.show({
                                    title: '템플릿 수정',
                                    msg: '템플릿을 수정하시겠습니까?',
                                    buttons: Ext.MessageBox.YESNO,
                                    fn: function (btn) {
                                        if (btn == 'yes') {
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/production/machine.do?method=editMachineSettingTemplate',
                                                params: {
                                                    unique_id_long: val['unique_id_long'],
                                                    template_name: val['template_name'],
                                                    comment: val['comment']
                                                },
                                                success: function (result, request) {
                                                    var resultText = result.responseText;
                                                    gm.me().clMachineSettingStore.load();
                                                    if (winPart) {
                                                        winPart.close();
                                                    }
                                                },
                                                failure: extjsUtil.failureMessage
                                            });//endof ajax request
                                        }
                                    },
                                    icon: Ext.MessageBox.QUESTION
                                });
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
            }
        });

        // 템플릿 삭제
        this.removeTemplateAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: '템플릿 삭제',
            tooltip: '템플릿 삭제',
            handler: function () {

                Ext.MessageBox.show({
                    title: '템플릿 삭제',
                    msg: '선택한 템플릿을 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (btn) {
                        if (btn == 'yes') {

                            var selections = gm.me().gridTemplateList.getSelectionModel().getSelection();

                            if (selections.length > 0) {

                                var arr = [];

                                for (var i = 0; i < selections.length; i++) {
                                    arr.push(selections[i].get('unique_id_long'));
                                }

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/index/generalData.do?method=delete',
                                    params: {
                                        DELETE_CLASS: 'claast',
                                        uids: arr,
                                        menuCode: gm.me().link
                                    },
                                    method: 'POST',
                                    success: function (rec, op) {
                                        gm.me().gridTemplateList.getStore().load();

                                    },
                                    failure: function (rec, op) {
                                        Ext.Msg.alert('안내', '삭제에 실패하였습니다.', function () {
                                        });
                                    }
                                });

                            }
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });


        this.addColumnAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus-circle',
            text: '추가',
            tooltip: '추가',
            handler: function () {

                var rec = gm.me().gridTemplateList.getSelectionModel().getSelection()[0];

                var class_code = rec.get('class_code');  // parent_class_code로 사용

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/production/machine.do?method=addMachineSettingColumn',
                    params: {
                        class_code: class_code
                    },
                    success: function (result, request) {
                        var resultText = result.responseText;
                        console_log('result:' + resultText);
                        gm.me().clMachineSettingColumnStore.load();
                    },
                    failure: extjsUtil.failureMessage
                });//endof ajax request
            }
        });

        this.removeColumnAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: gm.getMC('CMD_DELETE', '삭제'),
            tooltip: '삭제',
            handler: function () {
                var rec = gm.me().gridTemplateColumnList.getSelectionModel().getSelection()[0];

                var unique_id_long = rec.get('unique_id_long');
                var parent_class_code = rec.get('parent_class_code');
                var curPos = rec.get('display_order');

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/production/machine.do?method=removeMachineSettingColumn',
                    params: {
                        claast_uid: unique_id_long,
                        parent_class_code: parent_class_code,
                        curPos: curPos
                    },
                    success: function (result, request) {
                        var resultText = result.responseText;
                        console_log('result:' + resultText);
                        gm.me().clMachineSettingColumnStore.load();
                    },
                    failure: extjsUtil.failureMessage
                });//endof ajax request
            }
        });

        // 템플릿 리스트
        this.gridTemplateList = Ext.create('Rfx2.base.BaseGrid', {
            cls: 'rfx-panel',
            id: gu.id('gridTemplateList'),
            selModel: 'checkboxmodel',
            store: this.clMachineSettingStore,
            columns: [
                {text: '템플릿명', width: 150, style: 'text-align:center', dataIndex: 'class_name', sortable: true},
                {text: '생성자', width: 150, style: 'text-align:center', dataIndex: 'creator', sortable: true},
                {text: '생성일', width: 150, style: 'text-align:center', dataIndex: 'create_date', sortable: true},
                {text: '설명', width: 200, style: 'text-align:center', dataIndex: 'comment', sortable: true}
            ],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        this.purListSrch,
                        this.addTemplateAction,
                        this.editTemplateAction,
                        this.removeTemplateAction
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
                    items: [/*{
                        xtype: 'triggerfield',
                        emptyText: '공급사',
                        id: gu.id('supplier_name'),
                        width: 130,
                        fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                        name: 'query_sup',
                        listeners: {
                            specialkey: function (field, e) {
                                if (e.getKey() == Ext.EventObject.ENTER) {
                                    gm.me().supastStore.getProxy().setExtraParam('supplier_name', '%' + gu.getCmp('supplier_name').getValue() + '%');
                                    gm.me().supastStore.load(function () { });
                                }
                            }
                        },
                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                        'onTrigger1Click': function () {
                            gu.getCmp('supplier_name').setValue('');
                            this.supastStore.getProxy().setExtraParam('supplier_name', gu.getCmp('supplier_name').getValue());
                            this.supastStore.load(function () { });
                        }
                    }*/]
                }
            ],
            scrollable: true,
            flex: 1,
            bbar: Ext.create('Ext.PagingToolbar', {
                store: this.supastStore,
                displayInfo: true,
                displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                emptyMsg: "표시할 항목이 없습니다.",
                listeners: {
                    beforechange: function (page, currentPage) {
                        // console_logs('여기++++++++++++++++++++++++++++++++++++++++ : ', record);
                    }
                }

            }),
            viewConfig: {
                markDirty: false,
                stripeRows: true,
                enableTextSelection: false,
                preserveScrollOnReload: true,
                getRowClass: function (record, index) {
                    var recv_flag = record.get('recv_flag');
                    switch (recv_flag) {
                        case 'EM' :
                            return 'yellow-row';
                            break;
                        case 'SE':
                            return 'red-row';
                            break;
                    }
                }
            },
            listeners: {
                afterrender: function (grid) {
                    var elments = Ext.select(".x-column-header", true);
                    elments.each(function (el) {
                    }, this);
                },
                cellclick: function (iView, iCellEl, iColIdx, iRecord, iRowEl, iRowIdx, iEvent) {
                    this.selColIdx = iColIdx;
                    console_logs('iColIdx', this.selColIdx);
                },
                edit: function (editor, e, eOpts) {
                    console_logs('record', e.record);
                    var idx = this.selColIdx;
                    var pos = Math.trunc(idx / 2);
                    var type = idx % 2 == 1 ? 'time' : 'human';
                    var name = type + (pos + 1);
                    var val = e.record.get(name);
                    console.log(name, val);
                }
            }
        });

        this.clMachineSettingStore.getProxy().setExtraParam('level1', 1);
        this.clMachineSettingStore.load();

        this.gridTemplateColumnList = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('gridTemplateColumnList'),
            store: this.clMachineSettingColumnStore,
            viewConfig: {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            region: 'center',
            autoScroll: true,
            autoHeight: true,
            flex: 1,
            frame: true,
            border: true,
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2
            },
            margin: '0 0 0 0',
            dockedItems: [],
            columns: [
                {
                    text: '순서',
                    width: 50,
                    style: 'text-align:center',
                    align: 'center',
                    dataIndex: 'display_order',
                    sortable: true
                },
                {
                    text: '항목',
                    width: 180,
                    style: 'text-align:center',
                    editor: 'textfield',
                    dataIndex: 'class_name',
                    sortable: true
                }
            ],
            title: '항목',
            name: 'column',
            autoScroll: true,
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        this.addColumnAction,
                        {
                            text: '▲',
                            listeners: [{
                                click: function () {
                                    var direction = -1;
                                    var grid = gu.getCmp('gridTemplateColumnList');
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
                                        url: CONTEXT_PATH + '/production/machine.do?method=updateMachineSettingColumn',
                                        params: {
                                            direction: 'up',
                                            curPos: record.get('display_order'),
                                            parent_class_code: record.get('parent_class_code'),
                                            claast_uid: record.get('unique_id_long')
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
                                        record.set('display_order', i + 1);
                                    }
                                }
                            }]
                        },
                        {
                            text: '▼',
                            listeners: [{
                                click: function () {
                                    var direction = 1;
                                    var grid = gu.getCmp('gridTemplateColumnList');
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
                                        url: CONTEXT_PATH + '/production/machine.do?method=updateMachineSettingColumn',
                                        params: {
                                            direction: 'down',
                                            curPos: record.get('display_order'),
                                            parent_class_code: record.get('parent_class_code'),
                                            claast_uid: record.get('unique_id_long')
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
                                        record.set('display_order', i + 1);
                                    }
                                }
                            }]
                        },
                        this.removeColumnAction
                    ]
                }
            ],
            listeners: {
                cellkeydown: function (td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    if (eOpts.ctrlKey && eOpts.keyCode === 67) {
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
                    var tableName = 'claast';
                    var unique_id = e.record.getId();
                    var value = e.value;

                    gm.editAjax(tableName, columnName, value, 'unique_id', unique_id, {type: ''});
                    gm.me().clMachineSettingColumnStore.load();
                }
            }
        });

        this.setGridOnCallback(function (selections) {
            if (selections.length > 0) {
                var rec = selections[0];

                var srcahd_uid = rec.get('unique_id_long');

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/production/machine.do?method=getMachineSettingTemplate',
                    params: {
                        srcahd_uid: srcahd_uid
                    },
                    success: function (result, request) {
                        var jsonData = Ext.JSON.decode(result.responseText);

                        var store = gm.me().bufferStore;

                        store.removeAll();

                        for (var i = 0; i < jsonData.count; i++) {

                            var rec = jsonData.datas[i];

                            store.insert(store.getCount(), new Ext.data.Record({
                                'unique_id_long': rec.unique_id_long,
                                'seq': rec.seq,
                                'column_name': rec.column_name,
                                'column_value': rec.column_value
                            }));
                        }
                    },
                    failure: extjsUtil.failureMessage
                });//endof ajax request
            }
        });

        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr, function () {
        });

        var leftContainer = new Ext.container.Container({
            title: gm.getMC('CMD_Setting', '설비 Setting'),
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
                    flex: 1.5,
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
                    items: [this.gridTemplateBuffer]
                }
            ]
        });

        this.gridTemplateList.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    var rec = selections[0];
                    var class_code = rec.get('class_code');
                    gm.me().clMachineSettingColumnStore.getProxy().setExtraParam('parent_class_code', class_code);    // 판매용 단가 리스트 구분
                    gm.me().clMachineSettingColumnStore.load();
                    gm.me().editTemplateAction.enable();
                    gm.me().removeTemplateAction.enable();
                } else {
                    gm.me().editTemplateAction.disable();
                    gm.me().removeTemplateAction.disable();
                }
            }
        });

        var rightContainer = new Ext.container.Container({
            title: gm.getMC('CMD_Templete', '템플릿'),
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
                    flex: 1.5,
                    items: [this.gridTemplateList]
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
                    items: [this.gridTemplateColumnList]
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

        this.createCrudTab();

        this.grid.flex = 1;

        Ext.apply(this, {
            layout: 'border',
            items: mainTab
        });

        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.getProxy().setExtraParam('isMachineSetting', 'true');
        this.store.load(function (records) {
        });
    },
    items: []
});
