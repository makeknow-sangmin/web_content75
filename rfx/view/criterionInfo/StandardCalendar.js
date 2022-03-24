/**
 * This example shows how to create a grid from Array data. The grid is stateful so you
 * can move or hide columns, reload the page, and come back to the grid in the same state
 * you left it in.
 *
 * The cells are selectable due to use of the `enableTextSelection` option.
 */
Ext.define('Rfx.view.criterionInfo.StandardCalendar', {
    extend: 'Rfx.base.BaseView',
    xtype: 'calendar-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar2({
            REMOVE_BUTTONS: ["REGIST", "EDIT", "REMOVE", "COPY", "INITIAL", "UTYPE", "VIEW"],
        });

        //모델 정의
        this.createStore('Rfx.model.Calendar', [{
            property: 'create_date',
            direction: 'DESC'
        }],
            /*pageSize*/
            gMain.pageSize
            , {
                unique_id: 'b.unique_id',
                uid_comast: 'b.uid_comast',
                create_date: 'b.create_date',
                creator: 'b.creator',
                creator_uid: 'b.creator_uid',
                change_date: 'b.change_date',
                changer: 'b.changer',
                parentId: 'b.parentId',
                name: 'b.name',
                daysPerMonth: 'b.daysPerMonth',
                daysPerWeek: 'b.daysPerWeek',
                hoursPerDay: 'b.hoursPerDay',
                weekendFirstDay: 'b.weekendFirstDay',
                weekendSecondDay: 'b.weekendSecondDay',
                weekendFirstDayWorkday: 'b.weekendFirstDayWorkday',
                weekendSecondDayWorkday: 'b.weekendSecondDayWorkday'
            }
            , ['standardCalendar']
        );

        //그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);

        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        // OJT
        this.addStandardCalendarButton = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '신규 캘린더 등록',
            tooltip: '신규 캘린더 등록',
            disabled: false,
            hidden: gu.setCustomBtnHiddenProp('addStandardCalendarButton'),
            handler: function () {
                gm.me().addStandardCalendar();
            }
        });

        this.modifyStandardCalendarButton = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-edit',
            text: '캘린더 수정',
            tooltip: '캘린더 수정',
            disabled: false,
            hidden: gu.setCustomBtnHiddenProp('modifyStandardCalendarButton'),
            handler: function () {
                gm.me().modifyStandardCalendar();
            }
        });

        this.deleteStandardCalendarButton = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: gm.getMC('CMD_DELETE', '삭제'),
            tooltip: '삭제',
            disabled: false,
            hidden: gu.setCustomBtnHiddenProp('deleteStandardCalendarButton'),
            handler: function () {
                gm.me().deleteStandardCalendar();
            }
        });

        //OJT END

        buttonToolbar.items.each(function (item, index, length) {
            if (index == 1 || index == 2) {
                buttonToolbar.items.remove(item);
            }
        });

        buttonToolbar.insert(1, this.addStandardCalendarButton);
        buttonToolbar.insert(2, this.modifyStandardCalendarButton);
        buttonToolbar.insert(3, this.deleteStandardCalendarButton);

        this.setGridOnCallback(function (selections) {
            console_logs(">>>>callback", selections);
            if (selections != null && selections.length > 0) {
              this.modifyStandardCalendarButton.enable();
              this.deleteStandardCalendarButton.enable();
            } else {
              this.modifyStandardCalendarButton.disable();
              this.deleteStandardCalendarButton.disable();
            }
        });

        this.callParent(arguments);
        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.getProxy().setExtraParam('menuCode', this.link);
        this.store.load(function (records) { });
        this.loadStoreAlways = true;

    },
    items: [],
   
    addStandardCalendar: function () {
        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false,
            border: false,
            width: '100%',
            height: '100%',
            bodyPadding: '3 3 0',
            region: 'center',
            layout: 'column',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            
            items: [
                {
                    xtype: 'fieldset',
                    title: '신규 표준 캘린더 등록',
                    id: gu.id('standardCalendar'),
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '캘린더 이름',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: false,
                            id: 'name',
                            name: 'name'
                        }, {
                            fieldLabel: '모 캘린더',
                            xtype: 'combo',
                            anchor: '100%',
                            allowBlank: true,
                            fieldStyle: 'background-image: none;',
                            store: gm.me().standardCalendarComboStore,
                            emptyText: '선택해주세요.',
                            displayField: 'name',
                            valueField: 'unique_id',
                            typeAhead: false,
                            minChars: 1,
                            listConfig: {
                                loadingText: 'Searching...',
                                emptyText: 'No matching posts found.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">{name}</div>';
                                }
                            },
                            listeners: {
                                select: function (combo, record) {

                                }
                            },
                            id: 'parentId',
                            name: 'parentId'
                        }, {
                            fieldLabel: '월간 표준일수',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            id: 'daysPerMonth',
                            name: 'daysPerMonth'
                        }, {
                            fieldLabel: '주간 표준일수',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            id: 'daysPerWeek',
                            name: 'daysPerWeek'
                        }, {
                            fieldLabel: '일간 작업시간',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            id: 'hoursPerDay',
                            name: 'hoursPerDay'
                        }, {
                            fieldLabel: '주말시작요일',
                            xtype: 'textfield',
                            anchor: '100%',
                            id: 'weekendFirstDay',
                            name: 'weekendFirstDay'
                        }, {
                            fieldLabel: '주말종료일',
                            xtype: 'textfield',
                            anchor: '100%',
                            id: 'weekendSecondDay',
                            name: 'weekendSecondDay'
                        }, {
                            fieldLabel: '주말근무1',
                            xtype: 'textfield',
                            anchor: '100%',
                            id: 'weekendFirstDayWorkday',
                            name: 'weekendFirstDayWorkday'
                        }, {
                            fieldLabel: '주말근무2',
                            xtype: 'textfield',
                            anchor: '100%',
                            id: 'weekendSecondDayWorkday',
                            name: 'weekendSecondDayWorkday'
                        }
                    ]
                },

            ]
        });

        var myWidth = 310;
        var myHeight = 450;

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '신규 캘린더 등록',
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            prWin.setLoading(true);

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/admin/calendar.do?method=addCalendar',
                                params: val,
                                success: function (result, request) {
                                    prWin.setLoading(false);
                                    Ext.MessageBox.alert('알림','등록처리 되었습니다.')
                                    prWin.close();
                                    gm.me().store.load();
                                }, //endofsuccess
                                failure: function () {
                                    prWin.setLoading(false);
                                    extjsUtil.failureMessage();
                                    prWin.close();
                                    gm.me().store.load();
                                }
                            }); //endofajax


                        }
                    }
                }
            }, {
                text: CMD_CANCEL,
                handler: function () {
                    if (prWin) {
                        prWin.close();
                    }
                }
            }
            ]
        });
        prWin.show();
    },

    modifyStandardCalendar: function () {
        var rec = gm.me().grid.getSelectionModel().getSelection()[0];
        console_logs('>>>>>REC', rec);

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanelModify'),
            xtype: 'form',
            frame: false,
            border: false,
            width: '100%',
            height: '100%',
            bodyPadding: '3 3 0',
            region: 'center',
            layout: 'column',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side',
            },
            items: [
                {
                    xtype: 'fieldset',
                    id: gu.id('modification'),
                    title: '캘린더 수정',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2',
                    },
                    items: [
                        new Ext.form.Hidden({
                            name: 'unique_id',
                            id: 'unique_id',
                            value: rec.get('unique_id'),
                        }),
                        {
                            fieldLabel: "캘린더 이름",
                            xtype: "textfield",
                            anchor: "100%",
                            readOnly: false,
                            id: "Name",
                            name: "Name",
                            value: rec.get("name"),
                        },
                        {
                            fieldLabel: '모 캘린더',
                            xtype: 'textfield',
                            anchor: '100%',
                            readOnly: true,
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            id: 'parentId',
                            name: 'parentId',
                            value: rec.get('parentId')
                        }, 
                        {
                            fieldLabel: '월간 표준일수',
                            xtype: 'textfield',
                            anchor: '100%',
                            readOnly: false,
                            allowBlank: true,
                            id: 'daysPerMonth',
                            name: 'daysPerMonth',
                            value: rec.get('daysPerMonth')
                        }, {
                            fieldLabel: '주간 표준일수',
                            xtype: 'textfield',
                            anchor: '100%',
                            readOnly: false,
                            allowBlank: true,
                            id: 'daysPerWeek',
                            name: 'daysPerWeek',
                            value: rec.get('daysPerWeek')
                        }, {
                            fieldLabel: '일간 작업시간',
                            xtype: 'textfield',
                            anchor: '100%',
                            readOnly: false,
                            allowBlank: true,
                            id: 'hoursPerDay',
                            name: 'hoursPerDay',
                            value: rec.get('hoursPerDay')
                        // }, {
                        //     fieldLabel: '주말시작요일',
                        //     xtype: 'textfield',
                        //     anchor: '100%',
                        //     readOnly: false,
                        //     id: 'weekendFirstDay',
                        //     name: 'weekendFirstDay',
                        //     value: rec.get('weekendFirstDay')
                        // }, {
                        //     fieldLabel: '주말종료일',
                        //     xtype: 'textfield',
                        //     anchor: '100%',
                        //     readOnly: false,
                        //     id: 'weekendSecondDay',
                        //     name: 'weekendSecondDay',
                        //     value: rec.get('weekendSecondDay')
                        }, {
                            fieldLabel: '주말시작요일',
                            xtype: 'textfield',
                            anchor: '100%',
                            readOnly: false,
                            id: 'weekendFirstDay_string',
                            name: 'weekendFirstDay_string',
                            value: rec.get('weekendFirstDay_string')
                        }, {
                            fieldLabel: '주말종료요일',
                            xtype: 'textfield',
                            anchor: '100%',
                            readOnly: false,
                            id: 'weekendSecondDay_string',
                            name: 'weekendSecondDay_string',
                            value: rec.get('weekendSecondDay_string')
                        }, {
                            fieldLabel: '주말근무1',
                            xtype: 'textfield',
                            anchor: '100%',
                            readOnly: false,
                            id: 'weekendFirstDayWorkday',
                            name: 'weekendFirstDayWorkday',
                            value: rec.get('weekendFirstDayWorkday')
                        }, {
                            fieldLabel: '주말근무2',
                            xtype: 'textfield',
                            anchor: '100%',
                            readOnly: false,
                            id: 'weekendSecondDayWorkday',
                            name: 'weekendSecondDayWorkday',
                            value: rec.get('weekendSecondDayWorkday')
                        },
                    ],
                },
            ],
        });

        var myWidth = 310;
        var myHeight = 420;

        var prWin = Ext.create('Ext.Window', {
            modal : true,
            title: '수정',
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            buttons: [
                {
                    text: CMD_OK,
                    handler: function (btn) {
                        if (btn == 'no') {
                            prWin.close();
                        } else {
                            if (form.isValid()) {
                                var val = form.getValues(false);
                                prWin.setLoading(true);

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/admin/calendar.do?method=updateStandardCalendar',
                                    params: val,
                                    success: function (request, request) {
                                        if (prWin) {
                                            prWin.setLoading(false);
                                            Ext.MessageBox.alert('알림', '등록처리 되었습니다');
                                            prWin.close();
                                        }
                                        gm.me().store.load();
                                    },
                                    failure: function () {
                                        prWin.setLoading(false);
                                        extjsUtil.failureMessage();
                                    },
                                });
                            }
                        }
                    },
                },
                {
                    text: CMD_CANCEL,
                    handler: function () {
                        if (prWin) {
                            prWin.close();
                        }
                    },
                },
            ],
        });

        prWin.show();

    },   //EndOf modifyStandardCalendar function

    deleteStandardCalendar: function () {
        var confirmFlag = null;
        var rec = gm.me().grid.getSelectionModel().getSelection()[0];
        console_logs('>>>>>REC', rec);

        var uniqueId = rec['data']['id'];

        var confirmResult= Ext.MessageBox.confirm('삭제 알림', `${uniqueId}번 캘린더를 삭제하시겠습니까?`, 
            function(btn) {
                if(btn == 'yes') {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/admin/calendar.do?method=deleteStandardCalendar',
                        params: {'unique_id': uniqueId},
                        success: function (request, request) {
                            Ext.MessageBox.alert('알림', '삭제처리 되었습니다');
                            gm.me().store.load();
                        },
                        failure: function () {
                            extjsUtil.failureMessage();
                        },
                    });
                } else {
                    return;
                }
            }
        );

        
    },

    standardCalendarComboStore: Ext.create('Mplm.store.StandardCalendarComboStore'),
});