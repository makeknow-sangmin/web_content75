Ext.define('Rfx2.view.company.sejun.produceMgmt.ProductDispositionView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'inspect-category-def-view',

    //부서명store
    deptStore: Ext.create('Rfx2.store.company.sejun.DeptStore', {}),
    //팀원store
    teamStore: Ext.create('Rfx2.store.company.sejun.TeamStore', {}),
    //전체인원store
    userStore: Ext.create('Rfx2.store.company.sejun.UserStore', {}),
    //해당부서의 품목 store
    itemStore: Ext.create('Rfx2.store.company.sejun.ItemStore', {}),

    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();


        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        buttonToolbar.insert(4, '-');

        this.editbut = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-edit',
            text: '인원수정',
            tooltip: '인원수정',
            disabled: true,
            handler: function () {
                var grid2 = gu.getCmp('gridItemName');
                var record2 = grid2.getSelectionModel().getSelected().items[0];
                var form = Ext.create('Ext.form.Panel', {
                    id: 'editPoForm',
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '100%',
                    layout: 'column',
                    bodyPadding: 10,
                    items: [
                        {
                            xtype: 'fieldset',
                            collapsible: false,
                            title: '변경 인원수를 입력하십시오.',
                            width: '100%',
                            style: 'padding:10px',
                            defaults: {
                                labelStyle: 'padding:10px',
                                anchor: '100%',
                                layout: {
                                    type: 'column'
                                }
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    width: '100%',
                                    border: true,
                                    defaultMargins: {
                                        top: 0,
                                        right: 0,
                                        bottom: 0,
                                        left: 10
                                    },
                                    items: [
                                        {
                                            xtype: 'numberfield',
                                            id: 'before_qty',
                                            name: 'before_qty',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: false,
                                            fieldLabel: '기존 인원수',
                                            editable: false,
                                            hideTrigger: true,
                                            fieldStyle: 'background-color: #ebe8e8; background-image: none; font-weight: bold; text-align: right',
                                            keyNavEnabled: false,
                                            mouseWheelEnabled: false,
                                            value: record2.get('reserved_double1')
                                        },
                                        {
                                            xtype: 'numberfield',
                                            id: 'after_qty',
                                            name: 'after_qty',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: false,
                                            fieldLabel: '변경 인원수',
                                            value: record2.get('work_quan')
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'comment',
                                            name: 'comment',
                                            padding: '0 0 5px 30px',
                                            width: '95%',
                                            allowBlank: true,
                                            fieldLabel: '특이사항',
                                            value: record2.get('reserved_varchar1')
                                        },
                                    ]
                                },

                            ]
                        },
                    ]
                });

                var win = Ext.create('Ext.Window', {
                    modal: true,
                    title: gm.me().getMC('mes_order_edit_btn', '인원수정'),
                    width: 650,
                    height: 200,
                    plain: true,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function (btn) {
                            if (btn == "no") {
                                win.close();
                            } else {
                                var form = Ext.getCmp('editPoForm').getForm();
                                if (form.isValid()) {

                                    win.setLoading(true);

                                    var val = form.getValues(false);

                                    form.submit({
                                        url: CONTEXT_PATH + '/index/process.do?method=editMemberQty',
                                        params: {
                                            'unique_id': record2.get('unique_id_long')
                                        },
                                        success: function (val, action) {
                                            gm.me().deptStore.load();
                                            gm.me().teamStore.load();
                                            gm.me().userStore.load();
                                            gm.me().itemStore.load();

                                            // var store = grid2.getStore();
                                            // store.load();
                                            // gm.me().store.load();
                                            win.setLoading(false);
                                            win.close();
                                        },
                                        failure: function () {
                                            win.setLoading(false);
                                            extjsUtil.failureMessage();
                                        }
                                    });

                                }
                            }
                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function (btn) {
                            win.close();
                        }
                    }]
                });
                win.show()
                // var memberArr = [];
                // for(var i = 0; i<record3.length; i++) {
                //     var selections = record3[i];
                //     memberArr.push(selections.get('unique_id_long'));

                //     Ext.Ajax.request({
                //         url: CONTEXT_PATH + '/index/process.do?method=editMember',
                //         params: {
                //             memberArr: memberArr,
                //             member_count : member_count,
                //             plan_uid : plan_uid,
                //             dept_code : dept_code
                //         },
                //         success: function (result, request) {
                //             var resultText = result.responseText;
                //             console_log('result:' + resultText);
                //             if(resultText === 'true') {
                //                  Ext.MessageBox.alert('알림','반영처리 되었습니다.');
                //                  gm.me().teamStore.load();
                //                  gm.me().userStore.load();
                //             } else {
                //                  Ext.MessageBox.alert('알림','계획 인원수보다 더 많은 인원이 배치되었습니다.<br>다시 확인해주세요.');
                //             }
                //         },
                //         failure: extjsUtil.failureMessage
                //     });//endof ajax request
                // }
            }
        });

        


        this.addPerson = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus-circle',
            text: '팀원 추가',
            tooltip: '팀원 추가',
            disabled: true,
            handler: function () {
                var grid1 = gu.getCmp('gridDeptGrid');;
                var record1 = grid1.getSelectionModel().getSelected().items[0];
                var grid2 = gu.getCmp('gridItemName');
                var record2 = grid2.getSelectionModel().getSelected().items[0];
                console.log('테스트 : ', record2);
                var dept_code = record1.get('dept_code');
                var plan_uid = record2.get('unique_id_long');
                var member_count = record2.get('work_quan');

                var grid3 = gu.getCmp('people_list');
                var record3 = grid3.getSelectionModel().getSelection();
                var input_member_cnt = record3.length;

                if (input_member_cnt > member_count) {
                    Ext.MessageBox.alert('알림', '계획인원보다 추가 인원이 입력되었습니다.');
                    return;
                } else {
                    var memberArr = [];
                    for (var i = 0; i < record3.length; i++) {
                        var selections = record3[i];
                        memberArr.push(selections.get('unique_id_long'));
                    }

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/index/process.do?method=batchMemberWithProduct',
                        params: {
                            memberArr: memberArr,
                            member_count: member_count,
                            plan_uid: plan_uid,
                            dept_code: dept_code,
                            production_date : Ext.Date.format(gu.getCmp('production_date').getValue(), 'Y-m-d')
                        },
                        success: function (result, request) {
                            var resultText = result.responseText;
                            console_log('result:' + resultText);
                            if (resultText === 'true') {
                                Ext.MessageBox.alert('알림', '반영처리 되었습니다.');
                                gm.me().teamStore.load();
                                gm.me().userStore.load();
                            } else {
                                Ext.MessageBox.alert('알림', '계획 인원수보다 더 많은 인원이 배치되었습니다.<br>다시 확인해주세요.');
                            }
                        },
                        failure: extjsUtil.failureMessage
                    });//endof ajax request
                }
            }
        });

        this.deletePerson = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: '배치해제',
            tooltip: '배치해제',
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title: '배치해제',
                    msg: '선택한 팀원을 해당 제품의 생산인원에서 해제 하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        if (result == 'yes') {
                            var grid3 = gu.getCmp('grid_position');
                            var record3 = grid3.getSelectionModel().getSelection();
                            if (record3.length > 0) {
                                var usrastUids = [];
                                var pjMemberUids = [];
                                for (var i = 0; i < record3.length; i++) {
                                    var selections = record3[i];
                                    console_logs('>>>> sel', selections);
                                    pjMemberUids.push(selections.get('unique_id_long'));
                                    usrastUids.push(selections.get('usrast_uid'))
                                }

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/index/process.do?method=releaseMember',
                                    params: {
                                        pjmemberUids: pjMemberUids,
                                        usrastUids: usrastUids
                                    },
                                    success: function (result, request) {
                                        Ext.MessageBox.alert('알림', '처리되었습니다.');
                                        gm.me().deptStore.load(function () {
                                        });
                                        gm.me().teamStore.load(function () {
                                        });
                                        gm.me().userStore.load(function () {
                                        });
                                    },
                                    failure: extjsUtil.failureMessage
                                });
                            } else {

                            }

                        } else {
                            prWin.close();
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                })
            }
        });


        var gridDeptName = Ext.create('Ext.grid.Panel', {
            store: this.deptStore,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: false,
            id: gu.id('gridDeptGrid'),
            autoHeight: false,
            //bbar: getPageToolbar(this.deptStore),
            frame: false,
            layout: 'fit',
            forceFit: true,
            width: '100%',
            columns: [{
                text: '부서코드',
                width: 30,
                sortable: true,
                align: "center",
                dataIndex: 'dept_code'
            }, {
                text: '부서명',
                width: 70,
                sortable: true,
                align: "center",
                dataIndex: 'dept_name'
            }
            ]
        });

        this.deptStore.load();
        this.userStore.load();
        // this.crudMode = 'CREATE';

        gridDeptName.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                // gm.me().editbut.disabl
                console_logs('>?>?>?>?>?>', selections[0].get('unique_id_long'));
                gm.me().editbut.disable();
                gm.me().itemStore.getProxy().setExtraParam('comdst_uid', selections[0].get('unique_id_long'));
                gm.me().itemStore.getProxy().setExtraParam('production_date', Ext.Date.format(gu.getCmp('production_date').getValue(), 'Y-m-d'));
                gm.me().itemStore.load();


            }
        });

        var gridItemName = Ext.create('Ext.grid.Panel', {
            title: '해당 부서의 제품 LIST',
            store: this.itemStore,
            cls: 'rfx-panel',
            collapsible: false,
            id: gu.id('gridItemName'),
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            store: this.itemStore,
            //bbar: getPageToolbar(this.itemStore),
            reigon: 'south',
            layout: 'fit',
            forceFit: true,
            flex: 1,
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            frame: false,
            layout: 'fit',
            forceFit: true,
            width: '100%',
            columns: [{
                text: '제품코드',
                width: 20,
                sortable: true,
                style: 'text-align:center',
                align: "left",
                dataIndex: 'item_code'
            }, {
                text: '제품명',
                width: 55,
                sortable: true,
                style: 'text-align:center',
                align: "left",
                dataIndex: 'item_name'
            },
            {
                text: '계획수량',
                width: 20,
                sortable: true,
                style: 'text-align:center',
                align: "right",
                dataIndex: 'item_quan',
                renderer: function (value, context, tmeta) {
                    if (context.field == 'item_quan') {
                        context.record.set('item_quan', Ext.util.Format.number(value, '0,00/i'));
                    }
                    return Ext.util.Format.number(value, '0,00/i');
                },
            },
            {
                text: '인원수',
                width: 20,
                sortable: true,
                style: 'text-align:center',
                align: "right",
                dataIndex: 'work_quan_compare'

            },
            {
                text: '특이사항',
                width: 35,
                css: 'edit-cell',
                dataIndex: 'reserved_varchar1',
                style: 'text-align:center',
                editor: 'textfield',
                sortable: false
            }],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: '',
                    items: [this.editbut]
                }
            ]
        });

        this.deptStore.load();
        this.userStore.load();
        // this.crudMode = 'CREATE';

        gridItemName.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                var grid = gu.getCmp('gridDeptGrid');
                var record = grid.getSelectionModel().getSelected().items[0];
                console_logs('>>>', record);
                gu.getCmp('dept_name').setValue(record.get('unique_id'));

                gm.me().userStore.getProxy().setExtraParam('dept_uid', record.get('unique_id'));
                // gm.me().userStore.getProxy().setExtraParam('orderBy', 'dept_code');
                gm.me().userStore.load();

                var grid2 = gu.getCmp('gridItemName');
                var record2 = grid2.getSelectionModel().getSelected().items[0];
                console_logs('>>>> record', record2);
                if (record2 !== undefined) {
                    gm.me().teamStore.getProxy().setExtraParam('pj_uid', record2.get('unique_id'));
                    gm.me().userStore.getProxy().setExtraParam('pj_uid', record2.get('unique_id'));
                    gm.me().itemStore.getProxy().setExtraParam('production_date', Ext.Date.format(gu.getCmp('production_date').getValue(), 'Y-m-d'));
                    console_logs('unique_id', record2.get('unique_id'));
                    gm.me().teamStore.getProxy().setExtraParam('orderBy', 'dept_code');
                    gm.me().teamStore.load();
                }


                gm.me().editbut.enable();
            }
        });

        var temp = {
            title: '부서',
            collapsible: false,
            frame: true,
            region: 'west',
            layout: {
                type: 'vbox',
                pack: 'start',
                align: 'stretch'
            },
            margin: '0 0 0 0',
            flex: 1.0,
            items: [gridDeptName, gridItemName],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        {
                            xtype: 'datefield',
                            name: 'production_date',
                            format: 'Y-m-d',
                            id: gu.id('production_date'),
                            // minValue : '2022-01-14', 
                            format   : 'Y-m-d',
                            maxValue : new Date(), 
                            value : new Date(), 
                            emptyText: '생산일자',
                            // fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '시작일자',
                            hideTrigger: false,
                            width: 200,
                            keyNavEnabled: true,
                            mouseWheelEnabled: true,
                            editable: true,
                            listeners: {
                                select: function () {

                                }

                            },
                        },
                        // '~',
                        // {
                        //     xtype: 'datefield',
                        //     name: 'end_plan_date',
                        //     format: 'Y-m-d',
                        //     id: gu.id('end_date'),
                        //     format   : 'Y-m-d',
                        //     // minValue : '2022-01-14', 
                        //     emptyText: '종료일자',
                        //     // fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '시작일자',
                        //     hideTrigger: false,
                        //     width: 200,
                        //     keyNavEnabled: true,
                        //     mouseWheelEnabled: true,
                        //     editable: true,
                        //     listeners: {
                        //         select: function () {

                        //         }

                        //     },
                        // },
                        // this.analysisPsi
                    ]
                },
            ]

        };

        

        var gridDisposition = Ext.create('Ext.grid.Panel', {
            store: this.teamStore,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            id: gu.id('grid_position'),
            autoHeight: true,
            bbar: getPageToolbar(this.teamStore),
            frame: false,
            reigon: 'center',
            layout: 'fit',
            forceFit: true,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1,
            },
            flex: 1,
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            columns: [{
                text: '부서코드',
                width: 15,
                align: 'center',
                dataIndex: 'pj_code'
            }, {
                text: '부서명',
                width: 20,
                align: 'center',
                dataIndex: 'dept_name'
            }, {
                text: '팀원명',
                width: 30,
                align: 'center',
                dataIndex: 'user_name'
            }, {
                text: '직급',
                width: 20,
                sortable: true,
                align: "center",
                dataIndex: 'position1'
            }, {
                text: '역할',
                width: 20,
                sortable: true,
                align: "center",
                dataIndex: 'role_name',
                css: 'edit-cell',
                // dataIndex: 'item_name',
                style: 'text-align:center',
                editor: {
                    xtype: 'combo',
                    id: gu.id('role'),
                    displayField: 'code_name_kr',
                    editable: true,
                    forceSelection: true,
                    mode: 'local',
                    store: Ext.create('Mplm.store.WorkerRoleStore', {}),
                    triggerAction: 'all',
                    typeAhead: false,
                    minChars: 1,
                    valueField: 'system_code',
                    listConfig: {
                        loadingText: 'Searching...',
                        emptyText: 'No matching posts found.',
                    },
                    listeners: {
                        select: function (combo, rec) {
                            var store = gu.getCmp('grid_position').getStore();
                            var record = gu.getCmp('grid_position').getSelectionModel().getSelected().items[0];
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/production/schdule.do?method=changeRoleType',
                                params: {
                                    role_code: rec.get('system_code'),
                                    unique_id_long: record.get('unique_id_long')
                                },
                                success: function (result, request) {
                                    var result = result.responseText;
                                    store.load();
                                }, //endofsuccess
                                failure: function (result, request) {
                                    var result = result.responseText;
                                },
                            });
                        },
                    },
                },
                // listeners: {
                //     select: function (combo, rec) {
                //         var store = gu.getCmp('grid_position').getStore();
                //         var record = gu.getCmp('grid_position').getSelectionModel().getSelected().items[0];
                //         Ext.Ajax.request({
                //             url: CONTEXT_PATH + '/production/schdule.do?method=changeRoleType',
                //             params: {
                //                 role_code: rec.get('system_code'),
                //                 unique_id_long : record.get('unique_id_long')
                //             },
                //             success: function (result, request) {
                //                 var result = result.responseText;
                //                 store.load();
                //             }, //endofsuccess
                //             failure: function (result, request) {
                //                 var result = result.responseText;
                //             },
                //         });                       
                //     },
                // },
                sortable: false
            }]
        });

        gridDisposition.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    var rec = selections[0];
                    console_logs('>>>> rec', rec);
                    gm.me().deletePerson.enable();
                }
            }
        });

        var gridAllpeople = Ext.create('Ext.grid.Panel', {
            title: '전체인원',
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            id: gu.id('people_list'),
            store: this.userStore,
            //bbar: getPageToolbar(this.userStore),
            reigon: 'south',
            layout: 'fit',
            forceFit: true,
            flex: 1,
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            columns: [{
                text: '부서코드',
                width: 10,
                align: 'center',
                dataIndex: 'dept_code'
            }, {
                text: '부서명',
                width: 20,
                align: 'center',
                dataIndex: 'dept_name'
            }, {
                text: '팀원명',
                width: 30,
                align: 'center',
                dataIndex: 'user_name'
            }, {
                text: '직급',
                width: 20,
                align: 'center',
                dataIndex: 'position'
            }],
            dockedItems: [

                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        {
                            xtype: 'combobox',
                            emptyText: '부서',
                            id: gu.id('dept_name'),
                            store: this.deptStore,
                            displayField: 'dept_name',
                            valueField: 'unique_id',
                            typeAhead: false,
                            minChars: 1,
                            fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                            listConfig: {
                                loadingText: 'Searching...',
                                emptyText: 'No matching posts found.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">[{dept_code}] {dept_name}</div>';
                                }
                            },

                            listeners: {
                                select: function (combo, record) {
                                    var value = gu.getCmp('dept_name').getValue();
                                    gm.me().userStore.getProxy().setExtraParam('dept_uid', value);
                                    gm.me().userStore.getProxy().setExtraParam('production_date', gu.getCmp('production_date'));
                                    gm.me().userStore.load(function () { });
                                }
                            },
                        },

                        // listeners: {
                        //     specialkey: function (field, e) {
                        //         if (e.getKey() == Ext.EventObject.ENTER) {
                        //             gm.me().deptStore.getProxy().setExtraParam('dept_name', '%' + gu.getCmp('dept_name').getValue() + '%');
                        //             gm.me().deptStore.load(function () { });
                        //         }
                        //     }
                        // },
                        // trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                        // 'onTrigger1Click': function () {
                        //     gu.getCmp('dept_name').setValue('');
                        //     gm.me().deptStore.getProxy().setExtraParam('dept_name', gu.getCmp('dept_name').getValue());
                        //     gm.me().deptStore.load(function () { });
                        // }
                        //},
                        {
                            xtype: 'triggerfield',
                            emptyText: '팀원명',
                            id: gu.id('user_name'),
                            fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                            name: 'user_name',
                            listeners: {
                                specialkey: function (field, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().userStore.getProxy().setExtraParam('user_name', '%' + gu.getCmp('user_name').getValue() + '%');
                                        gm.me().userStore.load(function () { });
                                    }
                                }
                            },
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            'onTrigger1Click': function () {
                                gu.getCmp('user_name').setValue('');
                                gm.me().userStore.getProxy().setExtraParam('user_name', gu.getCmp('user_name').getValue());
                                gm.me().userStore.load(function () { });
                            }
                        },
                        this.addPerson
                    ]
                },
            ]
        });

        gridAllpeople.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    var rec = selections[0];
                    console_logs('>>>> rec', rec);
                    gm.me().addPerson.enable();
                }
            }
        });

        var temp2 = {
            title: '해당팀원',
            collapsible: false,
            frame: true,
            region: 'center',
            layout: {
                type: 'vbox',
                pack: 'start',
                align: 'stretch'
            },
            margin: '0 0 0 0',
            flex: 1,
            items: [gridDisposition, gridAllpeople],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [this.deletePerson]
                }
            ]
        };

        Ext.apply(this, {
            layout: 'border',
            bodyBorder: false,
            defaults: {
                collapsible: false,
                split: true
            },
            items: [temp, temp2, arr]
        });
        this.callParent(arguments);
    },

    bodyPadding: 10,

    defaults: {
        frame: true,
        bodyPadding: 10
    },

    autoScroll: true,
    fieldDefaults: {
        labelWidth: 300
    },
    items: null,
    productStore: Ext.create('Rfx2.store.company.sejun.ProductListStore', {}),
});