//설비현황
Ext.define('Rfx2.view.company.mjcm.equipState.VcmSettingMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'machine-setting-mgmt-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        //검색툴바 추가
        // this.addSearchField('item_code');
        // this.addSearchField('item_name');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS : [
                'VIEW', 'EXCEL', /*'SEARCH',*/ 'REGIST', 'COPY', 'EDIT', 'REMOVE'
            ],
            RENAME_BUTTONS : [
            ]
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

        this.machineTemplateStore = Ext.create('Mplm.store.ClaastStore', {pageSize: 1000000, identification_code: 'MACHINE_SETTING'});

        this.bufferStore = new Ext.data.Store();

        // 템플릿 불러오기
        this.loadTemplateAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus-circle',
            text: gm.getMC('CMD_Copy_from_Templete', '템플릿 불러오기'),
            tooltip: '템플릿 불러오기',
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
                            listConfig:{
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function(){
                                    return '<div data-qtip="{code}">{class_name}</div>';
                                }
                            },
                            listeners: {
                                expand: function() {

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
                                    title:'템플릿 추가',
                                    msg: '해당 템플릿으로 불러오시겠습니까?\n기존 템플릿 내용은 초기화 됩니다.',
                                    buttons: Ext.MessageBox.YESNO,
                                    fn: function(btn) {
                                        if(btn=='yes') {
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/production/machine.do?method=loadMachineSettingTemplate',
                                                params:{
                                                    class_code: val['class_code'],
                                                    srcahd_uid: srcahd_uid
                                                },
                                                success : function(result, request) {
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

                                                    if(winPart) {
                                                        winPart.close();
                                                    }
                                                },
                                                failure : extjsUtil.failureMessage
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

        this.bomListStore = Ext.create('Rfx2.store.company.bioprotech.BomRecipeStore', {not_pl_no: '---'});

        this.saveAction = Ext.create('Ext.Action', {
            iconCls: 'fa-save_14_0_5395c4_none',
            xtype : 'button',
            text : '저장',
            disabled: true,
            handler: function() {

                var parentRec = gm.me().grid.getSelectionModel().getSelection()[0];

                gm.editAjax('assymap', 'reserved10', gu.getCmp('reserved10').getValue(),
                    'unique_id', parentRec.get('assymap_uid'), {type: ''});

                var store = gm.me().bomListStore;

                for (var i = 0; i < store.getCount(); i++) {
                    var rec = store.getAt(i);
                    gm.editAjax('assymap', 'disp_order', rec.get('recipe_order'), 'unique_id', rec.get('unique_uid'), {type: ''});
                    gm.editAjax('assymap', 'reserved8', rec.get('reserved8'), 'unique_id', rec.get('unique_uid'), {type: ''});
                    //gm.editAjax('assymap', 'reserved9', rec.get('reserved9'), 'unique_id', rec.get('unique_uid'), {type: ''});
                    gm.editAjax('assymap', 'reserved11', rec.get('reserved11'), 'unique_id', rec.get('unique_uid'), {type: ''});
                    gm.editAjax('assymap', 'reserved12', rec.get('reserved12'), 'unique_id', rec.get('unique_uid'), {type: ''});
                }

                Ext.Msg.alert('완료', '레시피를 저장하였습니다.');

                gm.me().store.load();
            }
        });

        this.gridTemplateBuffer = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('gridTemplateBuffer'),
            store: this.bomListStore,
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
                        this.saveAction,
                        {
                            text: '▲',
                            listeners: [{
                                click: function () {
                                    var direction = -1;
                                    var grid = gu.getCmp('gridTemplateBuffer');
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

                                    grid.getStore().remove(record);
                                    grid.getStore().insert(index, record);
                                    grid.getSelectionModel().select(index, true);

                                    var cnt = grid.getStore().getCount();
                                    var p_price = 0;
                                    for (var i = 0; i < cnt; i++) {
                                        var record = grid.getStore().getAt(i);
                                        record.set('recipe_order', i + 1);
                                    }
                                }
                            }]
                        },
                        {
                            text: '▼',
                            listeners: [{
                                click: function () {
                                    var direction = 1;
                                    var grid = gu.getCmp('gridTemplateBuffer');
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

                                    grid.getStore().remove(record);
                                    grid.getStore().insert(index, record);
                                    grid.getSelectionModel().select(index, true);

                                    var cnt = grid.getStore().getCount();
                                    var p_price = 0;
                                    for (var i = 0; i < cnt; i++) {
                                        var record = grid.getStore().getAt(i);
                                        record.set('recipe_order', i + 1);
                                    }
                                }
                            }]
                        }
                    ]
                },
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [{
                        fieldLabel: '특이사항',
                        labelWidth: 60,
                        xtype: 'textarea',
                        rows: 1,
                        width: '100%',
                        id: gu.id('reserved10'),
                        name: 'reserved10'
                    }]
                }
            ],
            columns: [
                {text: 'NO', width: 50,  style: 'text-align:center', dataIndex: 'recipe_order', sortable: false},
                {text: '자재명', width: 250,  style: 'text-align:center', dataIndex: 'item_name', sortable: false},
                {text: 'RPM', width: 100,  style: 'text-align:center', editor: 'textfield', dataIndex: 'reserved8', sortable: false},
                {text: '기준량', width: 100,  style: 'text-align:center', /*editor: 'textfield', */dataIndex: 'bm_quan', sortable: false},
                {text: '기준단위', width: 80,  style: 'text-align:center', /*editor: 'textfield', */dataIndex: 'unit_code', sortable: false},
                {text: '투입단위', width: 80,  style: 'text-align:center', editor: 'textfield', dataIndex: 'reserved11',

                    editor: new Ext.form.ComboBox({
                        displayField: 'system_code',
                        editable: true,
                        forceSelection: true,
                        mode: 'local',
                        store: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'CONVERSION_UNIT' }),
                        triggerAction: 'all',
                        valueField: 'system_code',
                        listConfig: {
                            getInnerTpl: function() {
                                return '<div data-qtip="{unique_id}">{system_code}</div>';
                            },
                        },
                        listeners: {
                            // select: function(grid, data) {
                            //     var unique_id_long = data.get('unique_id_long');
                            //     gm.me().toTableStore.getProxy().setExtraParam('dbinfo_uid', unique_id_long);
                            //     gm.me().toTableStore.load();
                            // }
                        }
                    }),

                    sortable: false},
                {text: '환산비', width: 100,  style: 'text-align:center', editor: 'textfield', dataIndex: 'reserved12', sortable: false}
            ],
            title: '레시피 Setting',
            name: 'recipe_setting',
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

                    // var tableName = 'assymap';
                    // var unique_id = e.record.get('unique_uid');
                    //
                    // var seq = e.record.get('seq');
                    // seq = seq - 1;
                    //
                    // var columnName = e.field;
                    //
                    // var value = e.record.get(columnName);
                    //
                    // gm.editAjax(tableName, columnName, value, 'unique_id', unique_id, {type:''});
                }
            }
        });1

        this.setGridOnCallback(function (selections) {
            if (selections.length > 0) {
                var rec = selections[0];

                var assymap_uid = rec.get('assymap_uid');

                gm.me().bomListStore.getProxy().setExtraParam('reserved_integer2', assymap_uid);
                gm.me().bomListStore.getProxy().setExtraParam('ac_uid_minus_one', 'Y');
                gm.me().bomListStore.load();
                gu.getCmp('reserved10').setValue(rec.get('reserved10'));
                gm.me().saveAction.enable();
            } else {
                gm.me().saveAction.disable();
            }
        });

        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr, function () { });

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
                    items: [this.gridTemplateBuffer]
                }
            ]
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
            items: leftContainer
        });

        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);

        this.store.getProxy().setExtraParam('item_code', 'HHGL%');

        this.store.load(function (records) {
        });
    },
    items: []
});
