Ext.define('Rfx2.view.criterionInfo.BtnAccessSettingsView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'btn-access-settings-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id_long');
        this.addReadonlyField('create_date');

        //검색툴바 생성
        this.addSearchField('parent_display_name_ko');
        this.addSearchField('display_name_ko');
        this.addSearchField('code_name_kr');
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: [
                'REGIST', 'EDIT', 'COPY', 'REMOVE', 'EXCEL'
            ],
        });

        // 메인 스토어 생성
        this.createStore('Rfx.model.GeneralManualCode', [
                {
                    property: 'system_code',
                    direction: 'ASC'
                }],
            gm.pageSize,
            {},
            ['code']
        );

        // 오른쪽단 그리드
        this.roleCodeGrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('roleCodeGrid'),
            store: new Ext.data.Store(),
            viewConfig: {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            region: 'center',
            autoScroll: true,
            autoHeight: true,
            flex: 0.5,
            frame: true,
            border: true,
            layout: 'fit',
            forceFit: false,
            margin: '0 0 0 0',
            columns: [
                {text: '권한명', width: 130, style: 'text-align:center', dataIndex: 'role_name', sortable: false},
                {text: '권한코드', width: 130, style: 'text-align:center', dataIndex: 'role_code', sortable: false}
            ],
            title: '선택 하지 않은 권한',
            autoScroll: true
        });

        // 오른쪽단 그리드
        this.selectedRoleGrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('selectedRoleGrid'),
            store: new Ext.data.Store(),
            viewConfig: {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            region: 'center',
            autoScroll: true,
            autoHeight: true,
            flex: 0.5,
            frame: true,
            border: true,
            layout: 'fit',
            forceFit: false,
            margin: '0 0 0 0',
            columns: [
                {text: '권한명', width: 130, style: 'text-align:center', dataIndex: 'role_name', sortable: false},
                {text: '권한코드', width: 130, style: 'text-align:center', dataIndex: 'role_code', sortable: false}
            ],
            title: '적용중인 권한',
            autoScroll: true
        });

        //그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성
        this.createGrid(arr);
        this.createCrudTab();

        var leftAllBtn = Ext.create('Ext.Button', {
            width: '100%',
            height: '10%',
            margin: '20 20 20 20',
            text: '◀◀',
            enableToggle: true,
            listeners: {
                click: function () {
                    var store = gm.me().selectedRoleGrid.getStore();
                    var records = (store.getData().getSource() || store.getData()).getRange();
                    gm.me().roleCodeGrid.getStore().add(records);
                    gm.me().selectedRoleGrid.getStore().removeAll();
                }
            }
        });

        var leftBtn = Ext.create('Ext.Button', {
            width: '100%',
            height: '10%',
            margin: '20 20 20 20',
            text: '◀',
            enableToggle: true,
            listeners: {
                click: function () {
                    var rightSelection = gm.me().selectedRoleGrid.getSelectionModel().getSelection();

                    if (rightSelection.length > 0) {
                        var rec = rightSelection[0];
                        gm.me().roleCodeGrid.getStore().add(rec);
                        gm.me().selectedRoleGrid.getStore().remove(rec);
                    }
                }
            }
        });

        var rightBtn = Ext.create('Ext.Button', {
            width: '100%',
            height: '10%',
            margin: '20 20 20 20',
            text: '▶',
            enableToggle: true,
            listeners: {
                click: function () {
                    var leftSelection = gm.me().roleCodeGrid.getSelectionModel().getSelection();

                    if (leftSelection.length > 0) {
                        var rec = leftSelection[0];
                        gm.me().selectedRoleGrid.getStore().add(rec);
                        gm.me().roleCodeGrid.getStore().remove(rec);
                    }
                }
            }
        });

        var rightAllBtn = Ext.create('Ext.Button', {
            width: '100%',
            height: '10%',
            margin: '20 20 20 20',
            text: '▶▶',
            enableToggle: true,
            listeners: {
                click: function () {
                    var store = gm.me().roleCodeGrid.getStore();
                    var records = (store.getData().getSource() || store.getData()).getRange();
                    gm.me().selectedRoleGrid.getStore().add(records);
                    gm.me().roleCodeGrid.getStore().removeAll();
                }
            }
        });

        var saveBtn = Ext.create('Ext.Button', {
            width: '100%',
            height: '10%',
            margin: '20 20 20 20',
            text: '저장',
            enableToggle: true,
            listeners: {
                click: function () {
                    var create_ep_id = '';
                    var mainRec = gm.me().grid.getSelectionModel().getSelection()[0];

                    if (gm.me().roleCodeGrid.getStore().getCount() == 0) {
                        create_ep_id = '*';
                    } else {
                        var rStore = gm.me().selectedRoleGrid.getStore();
                        var records = (rStore.getData().getSource() || rStore.getData()).getRange();

                        for (var i = 0; i < records.length; i++) {
                            var role_code = records[i].get('role_code');
                            create_ep_id += create_ep_id.length == 0 ? role_code : ',' + role_code;
                        }
                    }

                    gm.editAjax('code', 'create_ep_id', create_ep_id, 'unique_id', mainRec.get('unique_id_long'), {type: ''});
                }
            }
        });

        // var resetBtn = Ext.create('Ext.Button', {
        //     renderTo: Ext.getBody(),
        //     width: '100%',
        //     height: '10%',
        //     margin: '20 20 20 20',
        //     text: 'RESET',
        //     enableToggle: true,
        //     listeners: {
        //         click: function () {
        //             gm.me().settingRoleCode();
        //         }
        //     }
        // });

        // 오른쪽 단

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

        // Ext.apply(this, {
        //     layout: 'border',
        //     items: [
        //         {
        //             collapsible: false,
        //             frame: false,
        //             region: 'west',
        //             layout: {
        //                 type: 'hbox',
        //                 pack: 'start',
        //                 align: 'stretch'
        //             },
        //             margin: '5 0 0 0',
        //             width: '40%',
        //             items: [{
        //                 region: 'west',
        //                 layout: 'fit',
        //                 margin: '0 0 0 0',
        //                 width: '100%',
        //                 items: [this.grid]
        //             }]
        //         }, {
        //             collapsible: false,
        //             frame: false,
        //             region: 'center',
        //             layout: {
        //                 type: 'hbox',
        //                 pack: 'start',
        //                 align: 'stretch'
        //             },
        //             margin: '5 0 0 0',
        //             width: '60%',
        //             items: [
        //                 {
        //                     region: 'west',
        //                     layout: 'fit',
        //                     margin: '0 0 0 0',
        //                     width: '45%',
        //                     items: [this.roleCodeGrid]
        //                 }, {
        //                     xtype: 'container',
        //                     width: '9.5%',
        //                     layout: {
        //                         type: 'vbox',
        //                         pack: 'center',
        //                         align: 'center'
        //                     },
        //                     items: [
        //                         leftAllBtn, leftBtn, rightBtn, rightAllBtn, saveBtn
        //                     ]
        //                 }, {
        //                     region: 'west',
        //                     layout: 'fit',
        //                     margin: '0 0 0 0',
        //                     width: '45%',
        //                     items: [this.selectedRoleGrid]
        //                 }
        //             ]
        //         }, this.crudTab
        //     ]
        // });

        this.callParent(arguments);

        // 그리드 선택 했을 시 콜백
        this.setGridOnCallback(function (selections) {
            if (selections.length == 1) {
                this.roleCodeGrid.setLoading(true);
                this.selectedRoleGrid.setLoading(true);
                gm.me().settingRoleCode();
            }
        });

        // 서브 그리드 선택 시
        this.roleCodeGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {

            }
        });

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function (records) {});

    },

    settingRoleCode: function() {
        gm.me().roleCodeGrid.getStore().removeAll();
        gm.me().selectedRoleGrid.getStore().removeAll();

        var rec = gm.me().grid.getSelectionModel().getSelection()[0];
        var create_ep_id = rec.get('create_ep_id');

        if (create_ep_id == '*') {
            gm.me().selectedRoleGrid.getStore().add(gu.roleCodes);
        } else {
            var create_ep_id_split = create_ep_id.split(',');

            for (var i = 0; i < gu.roleCodes.length; i++) {
                var roleCode = gu.roleCodes[i];
                var code = roleCode.role_code;

                for (var j = 0; j < create_ep_id_split.length; j++) {

                    var create_ep_id_member = create_ep_id_split[j];

                    if (code == create_ep_id_member) {
                        gm.me().selectedRoleGrid.getStore().add(roleCode);
                        break;
                    }

                    if (j == create_ep_id_split.length - 1) {
                        gm.me().roleCodeGrid.getStore().add(roleCode);
                    }
                }
            }
        }

        gm.me().roleCodeGrid.setLoading(false);
        gm.me().selectedRoleGrid.setLoading(false);
    }
});