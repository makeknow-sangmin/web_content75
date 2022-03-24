//생산완료 현황
Ext.define('Rfx2.view.company.bioprotech.produceMgmt.GongsuWasteMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'stock-ino-view',
    inputBuyer: null,
    preValue: 0,
    initComponent: function () {
        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;
        useMultitoolbar = false;
        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');

        this.addSearchField({
            type: 'dateRange',
            field_id: 'start_time',
            text: '일자',
            sdate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            edate: new Date()
        });

        // Site
        this.addSearchField({
            type: 'combo'
            , field_id: 'jobtoday_detail'
            , store: "ProductionSiteStore"
            , displayField: 'codeName'
            , valueField: 'systemCode'
            , innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
        });

        //  주/야간 구분 콤보
        this.addSearchField({
            type: 'combo',
            emptyText: '조'
            , field_id: 'work_type'
            , store: "ProductionWorkTypeStore"
            , displayField: 'codeName'
            , valueField: 'systemCode'
            , innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
        });

        this.addSearchField('name_ko');

        // this.addSearchField('item_name');

        // this.addSearchField({
        //     type: 'text',
        //     field_id: 'wa_name',
        //     emptyText: '고객명'
        // });

        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        // remove the items
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: [
                'REGIST', 'COPY', 'EDIT'
            ]
        });

        this.createStore('Rfx2.model.company.bioprotech.LineGongsu', [{
                property: 'item_code',
                direction: 'ASC'
            }],
            gMain.pageSize/*pageSize*/
            //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
            , {
                item_code_dash: 's.item_code',
                comment: 's.comment1'
            },
            ['pjtgongsu']
        );

        this.createGrid(arr);
        this.createGrid(searchToolbar, buttonToolbar, null
            , [
                {
                    locked: false,
                    arr: [0, 1, 2, 3, 4, 5]
                },
                {
                    text: gm.getMC('CMD_PEOPLE', '인원현황(명)'),
                    locked: false,
                    arr: [6, 7, 8, 9]
                },
                {
                    text: gm.getMC('CMD_WORKING_TIME', '작업시간(분)'),
                    locked: false,
                    arr: [10, 11, 12, 13]
                },
                {
                    text: gm.getMC('CMD_OPERATION_TIME', '공수현황(분)'),
                    locked: false,
                    arr: [14, 15, 16, 17, 18, 19]
                },
                {
                    locked: false,
                    arr: [20, 21, 22]
                },
            ]);

        var arr = [];
        arr.push(buttonToolbar);


        this.poPrdDetailStore = Ext.create('Rfx2.store.company.bioprotech.WastetimeListStore', {});

        this.editWasteInfo = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-edit',
            text: '수정',
            tooltip: '유실공수 수정',
            disabled: true,
            handler: function () {
                var selection = gm.me().grid.getSelectionModel().getSelected().items[0];

            }
        });

        this.addWasteInfo = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus',
            text: gm.getMC('CMD_WASTE_REG_EDIT', '추가/수정'),
            tooltip: '유실공수 추가, 수정',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('addWasteInfo'),
            handler: function () {
                var selection = gm.me().grid.getSelectionModel().getSelected().items[0];
                gm.me().wasteTypeStore.getProxy().setExtraParam('parent_uid', selection.get('unique_id_long'));
                gm.me().wasteTypeStore.load();
                this.wasteTypeGrid = Ext.create('Ext.grid.Panel', {
                    store: gm.me().wasteTypeStore,
                    cls: 'rfx-panel',
                    multiSelect: false,
                    autoScroll: true,
                    viewConfig: {
                        markDirty: false
                    },
                    height: 350,
                    border: true,
                    padding: '0 0 0 0',
                    width: 420,
                    layout: 'fit',
                    forceFit: true,
                    plugins: {
                        ptype: 'cellediting',
                        clicksToEdit: 2
                    },
                    columns: [
                        {
                            text: gm.getMC('WASTE_CODE', '유형코드'),
                            style: 'text-align:center',
                            flex: 0.5,
                            dataIndex: 'system_code'
                        },
                        {
                            text: gm.getMC('WASTE_NAME', '유형'),
                            style: 'text-align:center',
                            flex: 1.0,
                            dataIndex: 'code_name_kr'
                        },
                        {
                            text: gm.getMC('WASTE_NAME_CN', '유형(중국어)'),
                            style: 'text-align:center',
                            flex: 1.0,
                            dataIndex: 'code_name_zh'
                        },
                        {
                            text: gm.getMC('WASTE_TIME', '시간(분'),
                            flex: 0.5,
                            dataIndex: 'waste_time',
                            style: 'text-align:center',
                            align: 'right',
                            editor: {
                                xtype: 'numberfield'
                            },
                            renderer: function (value, context, tmeta) {
                                if (value == null) {
                                    return 0;
                                }
                                return Ext.util.Format.number(value, '0,00/i');
                            }
                        }
                    ]
                });

                var form = Ext.create('Ext.form.Panel', {
                    xtype: 'form',
                    frame: false,
                    border: false,
                    bodyPadding: 5,
                    region: 'center',
                    layout: 'form',
                    autoScroll: true,
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget: 'side'
                    },
                    items: [
                        {
                            xtype: 'fieldset',
                            layout: 'column',
                            flex: 1,
                            title: '(실제 적용인원 * 해당시간)을 계산하여 입력하시기 바랍니다.',
                            defaults: {
                                margin: '2 2 2 2'
                            },
                            items: [
                                this.wasteTypeGrid

                            ]
                        },
                    ]
                });


                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '유실공수 입력/수정',
                    width: 450,
                    height: 550,
                    items: form,
                    buttons: [
                        {
                            text: CMD_OK,
                            scope: this,
                            handler: function () {
                                var select = gm.me().grid.getSelectionModel().getSelection()[0];
                                var msg = '유실공수를 처리하시겠습니까?';
                                var waste_detail_arr = [];
                                var waste_time_arr = [];
                                for (var i = 0; i < gm.me().wasteTypeStore.getCount(); i++) {
                                    var rec = gm.me().wasteTypeStore.getAt(i);
                                    var waste_time = rec.get('waste_time');
                                    var waste_code = rec.get('system_code');
                                    if (waste_time >= 0) {
                                        waste_time_arr.push(waste_time);
                                        waste_detail_arr.push(waste_code);
                                    }
                                }
                                if (waste_time_arr.length > 0) {
                                    Ext.MessageBox.show({
                                        title: '확인',
                                        msg: msg,
                                        buttons: Ext.MessageBox.YESNO,
                                        fn: function (result) {
                                            if (result == 'yes') {
                                                prWin.setLoading(true);
                                                Ext.Ajax.request({
                                                    url: CONTEXT_PATH + '/production/schdule.do?method=addWastetimeInfo',
                                                    params: {
                                                        'waste_time_arr': waste_time_arr,
                                                        'waste_detail_arr': waste_detail_arr,
                                                        'parent_uid': select.get('unique_id_long'),
                                                        'regular_work': select.get('regular_work'),
                                                        'ext_work': select.get('ext_work'),
                                                        'over_work': select.get('over_work'),
                                                        'all_worker_qty': select.get('all_worker_qty'),
                                                        'work_qty': select.get('work_qty'),
                                                        'go_worker_qty': select.get('go_worker_qty'),
                                                        'vacation_worker_qty': select.get('vacation_worker_qty'),
                                                        'etc_worker_qty': select.get('etc_worker_qty'),
                                                        'monitor_qty': select.get('monitor_qty'),
                                                        'receive_qty': select.get('receive_qty'),
                                                        'send_qty': select.get('send_qty'),
                                                        'machine_uid': select.get('machine_uid'),

                                                    },
                                                    success: function (result, request) {
                                                        prWin.setLoading(false);
                                                        gm.me().store.load();
                                                        gm.me().poPrdDetailStore.load();
                                                        if (prWin) {
                                                            prWin.close();
                                                            Ext.MessageBox.alert('', '처리완료 되었습니다.');
                                                        }
                                                    },//endofsuccess
                                                    failure: extjsUtil.failureMessage
                                                });//endofajax
                                            }
                                        },
                                        icon: Ext.MessageBox.QUESTION
                                    });
                                } else {
                                    Ext.Msg.alert('', '최소 한 개의 유실시간의 시간이 1 이상이어야 합니다.');
                                }
                            }
                        },
                        {
                            text: CMD_CANCEL,
                            scope: this,
                            handler: function () {
                                if (prWin) {
                                    prWin.close();
                                }
                            }
                        }
                    ]
                });
                prWin.show();
            }
        });

        this.removeWasteInfo = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: gm.getMC('CMD_DELETE', '삭제'),
            tooltip: '삭제',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('removeWasteInfo'),
            handler: function () {
                var selection = gm.me().gridContractCompany.getSelectionModel().getSelected().items[0];
                var unique_id_long = selection.get('unique_id_long');
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/production/schdule.do?method=deleteWasteTime',
                    params: {
                        'unique_id_long': unique_id_long,
                    },
                    success: function (result, request) {
                        gm.me().store.load();
                        gm.me().poPrdDetailStore.load();
                        Ext.MessageBox.alert('', '처리완료 되었습니다.');
                    },//endofsuccess
                    failure: extjsUtil.failureMessage
                });//endofajax
            }
        });

        this.gridContractCompany = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('gridContractCompany'),
            store: this.poPrdDetailStore,
            viewConfig: {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            simpleSelect: false,
            region: 'center',
            autoScroll: true,
            autoHeight: true,
            flex: 1,
            frame: true,
            // bbar: getPageToolbar(this.poPrdDetailStore),
            border: true,
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },

            selModel: Ext.create('Ext.selection.CheckboxModel', {
                mode: 'SINGLE'
            }),

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
                            html: this.getMC('msg_reg_prd_info_detail', '등록된 실동공수정보를 선택하십시오.'),
                            width: 700,
                            style: 'color:white;font-weight:normal;text-align:left;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;'
                        }
                    ]
                },
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [
                        this.addWasteInfo,
                        // this.editWasteInfo,
                        this.removeWasteInfo,
                        // this.rejectDeliveryOrder,
                        // this.adjustRequestQuan,
                        // this.palletLoadList,
                        // this.palletDelete,
                        // this.printShippingMark
                    ]
                }

            ],
            columns: [

                {
                    text: gm.getMC('WASTE_CODE', '유실코드'),
                    width: 120,
                    style: 'text-align:center',
                    dataIndex: 'waste_type',
                    sortable: true
                },
                {
                    text: gm.getMC('WASTE_NAME', '유형명(한국)'),
                    width: 200,
                    style: 'text-align:center',
                    dataIndex: 'waste_type_kr',
                    sortable: true
                },
                {
                    text: gm.getMC('WASTE_NAME_CN', '유형명(중국)'),
                    width: 200,
                    style: 'text-align:center',
                    dataIndex: 'waste_type_zh',
                    sortable: true
                },
                {
                    text: gm.getMC('WASTE_TIME', '유실시간(분)'),
                    width: 150,
                    style: 'text-align:center',
                    dataIndex: 'waste_time',
                    sortable: true,
                    align: 'right',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'sales_amount') {
                            context.record.set('sales_amount', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },

            ],
            viewConfig: {
                // getRowClass: function (record, index) {
                //     var c = record.get('ctr_flag');
                //     if (c == 'Y') {
                //         return 'yellow-row'
                //     }
                //     if (c == 'D') {
                //         return 'red-row'
                //     }
                // }
            },
            listeners: {
                cellkeydown: function (td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    if (eOpts.ctrlKey && eOpts.keyCode === 67) {
                        // var tempTextArea = document.createElement("textarea");
                        // document.body.appendChild(tempTextArea);
                        // tempTextArea.value = eOpts.target.innerText;
                        // tempTextArea.select();
                        // document.execCommand('copy');
                        // document.body.removeChild(tempTextArea);
                    }
                }
            },
            title: this.getMC('mes_reg_prd_info_msg', '유실상세목록'),
            name: 'po',
        });
        this.gridContractCompany.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length) {
                    gm.me().removeWasteInfo.enable();
                    // gm.me().rejectDeliveryOrder.enable();
                    // gm.me().printShippingMark.enable();
                    // gm.me().adjustRequestQuan.enable();

                    // gm.me().palletDelete.enable();
                } else {
                    gm.me().removeWasteInfo.disable();
                    // gm.me().rejectDeliveryOrder.disable();
                    // gm.me().printShippingMark.disable();
                    // gm.me().adjustRequestQuan.disable();
                    // gm.me().palletDelete.disable();
                }
            }
        });

        //grid 생성.
        // this.usePagingToolbar = false;

        // this.createGrid(arr);
        // this.createCrudTab();
        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    collapsible: false,
                    frame: false,
                    region: 'north',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    flex: 1,
                    // width: '100%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        // height : '50%',
                        items: [this.grid]
                    }]
                },
                {
                    collapsible: false,
                    frame: false,
                    region: 'center',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    flex: 1,
                    items: [
                        // region: 'west',
                        // layout: 'fit',
                        // margin: '0 0 0 0',
                        // width: '50%',
                        this.gridContractCompany
                    ]

                }
            ]
        });

        this.addWorkGongsu = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            text: gm.getMC('CMD_REGISTER', '등록'),
            tooltip: '실동공수 입력',
            disable: true,
            hidden: gu.setCustomBtnHiddenProp('addWorkGongsu'),
            handler: function () {
                var today = new Date();
                var hours = today.getHours();
                var site = vCUR_DIVISION_CODE;
                if (hours < 10) {
                    console_logs('>>> 상태', '어제날짜');
                    reference_date = new Date(today.setDate(today.getDate() - 1));
                } else {
                    console_logs('>>> 상태', '오늘날짜');
                    reference_date = today;
                }

                var week = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
                var week_kr = week[reference_date.getDay()];
                console_logs('>>>> 요일??', week_kr);
                var normal_work = 0;
                var over_work = 0;
                var weekend_work = 0;
                if (week_kr === 'Sat' || week_kr === 'Sun') {
                    normal_work = 0;
                    over_work = 0;
                    weekend_work = 480;
                } else {
                    normal_work = 480;
                    over_work = 150;
                    weekend_work = 0;
                }

                gm.me().machineStore.getProxy().setExtraParam('mchn_types', 'LINE|GROUP');
                gm.me().machineStore.getProxy().setExtraParam('reserved_varchar2', site);
                gm.me().machineStore.load();

                var form = Ext.create('Ext.form.Panel', {
                    id: 'addPoForm',
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '100%',
                    layout: 'column',
                    // overflowY: 'scroll',
                    bodyPadding: 10,
                    items: [
                        {
                            xtype: 'fieldset',
                            collapsible: false,
                            title: gm.me().getMC('CMD_COMMON_INFO', '공통정보'),
                            width: '100%',
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
                                            xtype: 'datefield',
                                            id: 'start_date',
                                            name: 'start_date',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: false,
                                            fieldLabel: gm.getMC('CMD_Work_Date', '생산일자'),
                                            format: 'Y-m-d',
                                            value: reference_date,
                                            listeners: {
                                                change: function () {
                                                    console_logs('>>> date', this.getValue());
                                                    var week = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
                                                    var week_kr = week[this.getValue().getDay()];
                                                    console_logs('>>>> 요일 재선택 ??', week_kr);
                                                    // var kkkk = gu.getCmp('jobtoday_detail').getValue();

                                                    if (week_kr === 'Sat' || week_kr === 'Sun') {
                                                        var normal_work = 0;
                                                        var over_work = 0;
                                                        var weekend_work = 480;
                                                        gu.getCmp('regular_work').setValue(normal_work);
                                                        gu.getCmp('ext_work').setValue(over_work);
                                                        gu.getCmp('over_work').setValue(weekend_work);

                                                    } else {
                                                        var normal_work = 480;
                                                        var over_work = 150;
                                                        var weekend_work = 0;

                                                        gu.getCmp('regular_work').setValue(normal_work);
                                                        gu.getCmp('ext_work').setValue(over_work);
                                                        gu.getCmp('over_work').setValue(weekend_work);

                                                    }

                                                }// endofselect
                                            }
                                        },
                                        {

                                            xtype: 'combo',
                                            id: gu.id('jobtoday_detail'),
                                            name: 'jobtoday_detail',
                                            width: '45%',
                                            fieldLabel: 'Site',
                                            padding: '0 0 5px 30px',
                                            allowBlank: false,
                                            fieldStyle: 'background-image: none;',
                                            store: gm.me().comcstStore,
                                            emptyText: '선택해주세요.',
                                            displayField: 'division_code',
                                            valueField: 'division_code',
                                            typeAhead: false,
                                            value: site,
                                            minChars: 1,
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{division_code}">{division_code}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {
                                                    gm.me().machineStore.getProxy().setExtraParam('mchn_types', 'LINE|GROUP');
                                                    gm.me().machineStore.getProxy().setExtraParam('reserved_varchar2', record.get('division_code'));
                                                    gm.me().machineStore.load();
                                                }// endofselect
                                            }
                                        },
                                        {
                                            xtype: 'combo',
                                            name: 'machine_uid',
                                            id: gu.id('machine_uid'),
                                            fieldLabel: gm.getMC('CMD_PRODUCT_LINE', '라인'),
                                            width: '45%',
                                            padding: '0 0 5px 30px',
                                            allowBlank: false,
                                            fieldStyle: 'background-image: none;',
                                            store: gm.me().machineStore,
                                            emptyText: '선택해주세요.',
                                            displayField: 'name_ko',
                                            valueField: 'unique_id_long',
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{unique_id_long}">{name_ko}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {
                                                    // var work_type = gu.getCmp().getValue('work_type');
                                                    Ext.Ajax.request({
                                                        url: CONTEXT_PATH + '/production/schdule.do?method=getLastPeopleState',
                                                        params: {
                                                            machine_uid: gu.getCmp('machine_uid').getValue(),
                                                            work_type: gu.getCmp('work_type').getValue(),
                                                        },
                                                        success: function (result, request) {
                                                            var result = result.responseText;
                                                            console_logs('>>>>> result', result);
                                                            var result_split = result.split('|', 4);
                                                            var all_go = result_split[0];
                                                            var go_work = result_split[1];
                                                            var vacation = result_split[2];
                                                            var etc_work = result_split[3];
                                                            console_logs('>>>> etc', etc_work);

                                                            gu.getCmp('all_worker').setValue(all_go);
                                                            gu.getCmp('go_worker').setValue(go_work);
                                                            gu.getCmp('vacation_worker').setValue(vacation);
                                                            gu.getCmp('etc_worker').setValue(etc_work);
                                                        }, //endofsuccess
                                                        failure: function (result, request) {
                                                            var result = result.responseText;
                                                            Ext.MessageBox.alert('알림', result);
                                                        },
                                                    });
                                                }// endofselect
                                            }
                                        },
                                        {
                                            xtype: 'combo',
                                            id: gu.id('work_type'),
                                            name: 'work_type',
                                            fieldLabel: gm.getMC('CMD_DAY_NIGHT', '조'),
                                            width: '45%',
                                            padding: '0 0 5px 30px',
                                            allowBlank: false,
                                            fieldStyle: 'background-image: none;',
                                            store: gm.me().workTypeStore,
                                            emptyText: '선택해주세요.',
                                            displayField: 'codeName',
                                            valueField: 'systemCode',
                                            value: 'day',
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{systemCode}">{codeName}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {
                                                    // var work_type = gu.getCmp().getValue('work_type');
                                                    Ext.Ajax.request({
                                                        url: CONTEXT_PATH + '/production/schdule.do?method=getLastPeopleState',
                                                        params: {
                                                            machine_uid: gu.getCmp('machine_uid').getValue(),
                                                            work_type: record.get('systemCode'),
                                                        },
                                                        success: function (result, request) {
                                                            var result = result.responseText;
                                                            console_logs('>>>>> result', result);
                                                            var result_split = result.split('|', 4);
                                                            var all_go = result_split[0];
                                                            var go_work = result_split[1];
                                                            var vacation = result_split[2];
                                                            var etc_work = result_split[3];
                                                            console_logs('>>>> etc', etc_work);

                                                            gu.getCmp('all_worker').setValue(all_go);
                                                            gu.getCmp('go_worker').setValue(go_work);
                                                            gu.getCmp('vacation_worker').setValue(vacation);
                                                            gu.getCmp('etc_worker').setValue(etc_work);
                                                        }, //endofsuccess
                                                        failure: function (result, request) {
                                                            var result = result.responseText;
                                                            Ext.MessageBox.alert('알림', result);
                                                        },
                                                    });
                                                }// endofselect
                                            }
                                        },

                                    ]
                                },


                            ]
                        },

                        {
                            xtype: 'fieldset',
                            collapsible: false,
                            title: gm.me().getMC('CMD_WORKING_TIME', '인원현황(명)'),
                            width: '100%',
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
                                            id: gu.id('all_worker'),
                                            xtype: 'numberfield',
                                            name: 'all_worker',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: false,
                                            fieldLabel: gm.getMC('CMD_REGISTER', '재적'),
                                            value: 0,
                                            minValue: 0
                                        },
                                        {
                                            id: gu.id('go_worker'),
                                            xtype: 'numberfield',
                                            name: 'go_worker',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: false,
                                            fieldLabel: gm.getMC('CMD_WORK', '출근'),
                                            value: 0,
                                            minValue: 0
                                        },
                                        {
                                            id: gu.id('vacation_worker'),
                                            xtype: 'numberfield',
                                            name: 'vacation_worker',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: false,
                                            fieldLabel: gm.getMC('CMD_VACATION', '휴가'),
                                            value: 0,
                                            minValue: 0
                                        },
                                        {
                                            id: gu.id('etc_worker'),
                                            xtype: 'numberfield',
                                            name: 'etc_worker',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: false,
                                            fieldLabel: gm.getMC('CMD_ETC', '기타'),
                                            value: 0,
                                            minValue: 0
                                        },
                                    ]
                                },


                            ]
                        },
                        {
                            xtype: 'fieldset',
                            collapsible: false,
                            title: gm.me().getMC('CMD_OPERATION_TIME', '작업시간(분)'),
                            width: '100%',
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
                                            id: gu.id('regular_work'),
                                            name: 'regular_work',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: false,
                                            fieldLabel: gm.getMC('CMD_NORMAL', '정규'),
                                            value: normal_work,
                                            minValue: 0,
                                        },
                                        {
                                            xtype: 'numberfield',
                                            id: gu.id('ext_work'),
                                            name: 'ext_work',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: false,
                                            fieldLabel: gm.getMC('CMD_OVERTIME', '연장'),
                                            value: over_work,
                                            minValue: 0,
                                        },
                                        {
                                            xtype: 'numberfield',
                                            id: gu.id('over_work'),
                                            name: 'over_work',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: false,
                                            fieldLabel: gm.getMC('CMD_WEEKEND', '특근'),
                                            value: weekend_work,
                                            minValue: 0,
                                        },

                                    ]
                                },


                            ]
                        },
                        {
                            xtype: 'fieldset',
                            collapsible: false,
                            title: gm.me().getMC('CMD_OPERATION_TIME', '공수현황(분)'),
                            width: '100%',
                            // style: 'padding:10px',
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
                                    // margin: '0 10 10 1',
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
                                            name: 'monitor_qty',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: false,
                                            fieldLabel: gm.getMC('CMD_LEAD', '조반장'),
                                            value: 0,
                                            minValue: 0
                                        },
                                        {
                                            xtype: 'numberfield',
                                            name: 'receive_qty',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: false,
                                            fieldLabel: gm.getMC('CMD_RECEIVED', '받음'),
                                            value: 0,
                                            minValue: 0
                                        },
                                        {
                                            xtype: 'numberfield',
                                            name: 'send_qty',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: false,
                                            fieldLabel: gm.getMC('CMD_SEND', '보냄'),
                                            value: 0,
                                            minValue: 0
                                        },
                                    ]
                                },


                            ]
                        },
                        {
                            xtype: 'fieldset',
                            collapsible: false,
                            // title: gm.me().getMC('CMD_OPERATION_TIME', '기타'),
                            width: '100%',
                            // style: 'padding:10px',
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
                                    // margin: '0 10 10 1',
                                    border: true,
                                    defaultMargins: {
                                        top: 0,
                                        right: 0,
                                        bottom: 0,
                                        left: 10
                                    },
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            name: 'overtime_type',
                                            padding: '0 0 5px 30px',
                                            width: '93%',
                                            allowBlank: true,
                                            fieldLabel: gm.me().getMC('msg_remarks', '기타'),
                                        },
                                    ]
                                },


                            ]
                        }
                    ]
                });

                var win = Ext.create('Ext.Window', {
                    modal: true,
                    title: gm.me().getMC('mes_order_recv_btn', '실동공수 입력'),
                    width: 1200,
                    height: 550,
                    plain: true,
                    items: form,
                    overflowY: 'scroll',
                    buttons: [{
                        text: CMD_OK,
                        handler: function (btn) {
                            if (btn == "no") {
                                win.close();
                            } else {
                                var form = Ext.getCmp('addPoForm').getForm();
                                if (form.isValid()) {
                                    // win.setLoading(true);
                                    var val = form.getValues(false);

                                    var regular_work = gu.getCmp('regular_work').getValue();
                                    var ext_work = gu.getCmp('ext_work').getValue();
                                    var over_work = gu.getCmp('over_work').getValue();

                                    var all_worker = gu.getCmp('all_worker').getValue();
                                    var go_worker = gu.getCmp('go_worker').getValue();
                                    var vacation_worker = gu.getCmp('vacation_worker').getValue();
                                    var etc_worker = gu.getCmp('etc_worker').getValue();

                                    var compare_val = go_worker + vacation_worker + etc_worker;

                                    if (regular_work > 700 || ext_work > 700 || over_work > 700) {
                                        Ext.MessageBox.show({
                                            title: '알림',
                                            msg: '작업시간 입력값 중 기준시간<b>(700 min)</b>을 초과한 값이 있습니다.<br>계속 등록을 진행하시겠습니까?',
                                            buttons: Ext.MessageBox.YESNO,
                                            icon: Ext.MessageBox.QUESTION,
                                            fn: function (btn) {
                                                if (btn == "no" || btn == "cancel") {
                                                    winPart.close();
                                                    return;
                                                } else {
                                                    form.submit({
                                                        submitEmptyText: false,
                                                        url: CONTEXT_PATH + '/production/schdule.do?method=inputGongsuInfo',
                                                        success: function (val, action) {
                                                            win.setLoading(false);
                                                            gm.me().store.load();
                                                            win.close();
                                                        },
                                                        failure: function () {
                                                            win.setLoading(false);
                                                            extjsUtil.failureMessage();
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    } else if (compare_val > all_worker) {
                                        Ext.MessageBox.alert('알림', '(출근 + 휴가 + 기타)의 값이 재적 수보다 클 수 없습니다.<br>다시 확인해주세요.');
                                        return;
                                    } else {
                                        Ext.MessageBox.show({
                                            title: '실동공수 입력',
                                            msg: '입력한 정보로 실동공수 입력을 하시겠습니까?',
                                            buttons: Ext.MessageBox.YESNO,
                                            fn: function (btn) {
                                                win.setLoading(true);
                                                if (btn == 'yes') {
                                                    form.submit({
                                                        submitEmptyText: false,
                                                        url: CONTEXT_PATH + '/production/schdule.do?method=inputGongsuInfo',
                                                        success: function (val, action) {
                                                            win.setLoading(false);
                                                            gm.me().store.load();
                                                            win.close();
                                                        },
                                                        failure: function () {
                                                            win.setLoading(false);
                                                            extjsUtil.failureMessage();
                                                        }
                                                    });
                                                } else {
                                                    win.setLoading(false);
                                                }
                                            },
                                            icon: Ext.MessageBox.QUESTION
                                        });
                                    }
                                } else {
                                    Ext.MessageBox.alert('알림', '필수 입력항목 미기재 또는 부적한 값이 입력되었습니다.<br>다시 확인해주세요.');
                                    return;
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
                win.show();
            }
        });

        this.editWorkGongsu = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: gm.getMC('edit_text', '수정'),
            tooltip: '실동공수 정보 수정',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('editWorkGongsu'),
            handler: function () {
                var select = gm.me().grid.getSelectionModel().getSelection()[0];
                gm.me().workTypeStore.load();
                gm.me().comcstStore.load();
                gm.me().machineStore.getProxy().setExtraParam('mchn_types', 'LINE|GROUP');
                gm.me().machineStore.getProxy().setExtraParam('reserved_varchar2', select.get('jobtoday_detail'));
                gm.me().machineStore.load();
                var form = Ext.create('Ext.form.Panel', {
                    id: 'editForm',
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '100%',
                    layout: 'column',
                    // overflowY: 'scroll',
                    bodyPadding: 10,
                    items: [
                        {
                            xtype: 'fieldset',
                            collapsible: false,
                            title: gm.me().getMC('CMD_COMMON_INFO', '공통정보'),
                            width: '100%',
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
                                            xtype: 'datefield',
                                            id: 'start_date',
                                            name: 'start_date',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: false,
                                            fieldLabel: gm.getMC('CMD_Work_Date', '생산일자'),
                                            format: 'Y-m-d',
                                            value: select.get('start_time')
                                        },
                                        {
                                            // id: gu.id('jobtoday_detail'),
                                            name: 'jobtoday_detail',
                                            fieldLabel: 'Site',
                                            xtype: 'combo',
                                            width: '45%',
                                            padding: '0 0 5px 30px',
                                            allowBlank: false,
                                            fieldStyle: 'background-image: none;',
                                            value: select.get('jobtoday_detail'),
                                            store: gm.me().comcstStore,
                                            emptyText: '선택해주세요.',
                                            displayField: 'division_code',
                                            valueField: 'division_code',
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{division_code}">{division_code}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {
                                                    gm.me().machineStore.getProxy().setExtraParam('mchn_types', 'LINE|GROUP');
                                                    gm.me().machineStore.getProxy().setExtraParam('reserved_varchar2', record.get('division_code'));
                                                    gm.me().machineStore.load();
                                                }// endofselect
                                            }
                                        },
                                        {
                                            // id: gu.id('work_type'),
                                            name: 'work_type',
                                            fieldLabel: gm.getMC('CMD_DAY_NIGHT', '조'),
                                            xtype: 'combo',
                                            width: '45%',
                                            padding: '0 0 5px 30px',
                                            allowBlank: false,
                                            value: select.get('work_type'),
                                            fieldStyle: 'background-image: none;',
                                            store: gm.me().workTypeStore,
                                            emptyText: '선택해주세요.',
                                            displayField: 'codeName',
                                            valueField: 'systemCode',
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{systemCode}">{codeName}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {

                                                }// endofselect
                                            }
                                        },
                                        {
                                            xtype: 'combo',
                                            name: 'machine_uid',
                                            id: gu.id('machine_uid'),
                                            fieldLabel: gm.getMC('CMD_PRODUCT_LINE', '라인'),
                                            width: '45%',
                                            padding: '0 0 5px 30px',
                                            allowBlank: false,
                                            value: select.get('name_ko'),
                                            fieldStyle: 'background-image: none;',
                                            store: gm.me().machineStore,
                                            emptyText: '선택해주세요.',
                                            displayField: 'name_ko',
                                            valueField: 'name_ko',
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{unique_id_long}">{name_ko}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {

                                                }// endofselect
                                            }
                                        }

                                    ]
                                },


                            ]
                        },
                        {
                            xtype: 'fieldset',
                            collapsible: false,
                            title: gm.me().getMC('CMD_PEOPLE', '인원현황(명)'),
                            width: '100%',
                            // style: 'padding:10px',
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
                                    // margin: '0 10 10 1',
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
                                            id: gu.id('all_worker_edit'),
                                            name: 'all_worker',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: false,
                                            minValue: 0,
                                            value: select.get('all_worker_qty'),
                                            fieldLabel: gm.getMC('CMD_REGISTER', '재적')
                                        },
                                        {
                                            xtype: 'numberfield',
                                            id: gu.id('go_worker_edit'),
                                            name: 'go_worker',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: false,
                                            minValue: 0,
                                            value: select.get('go_worker_qty'),
                                            fieldLabel: gm.getMC('CMD_WORK', '출근')
                                        },
                                        {
                                            xtype: 'numberfield',
                                            id: gu.id('vacation_worker_edit'),
                                            name: 'vacation_worker',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            minValue: 0,
                                            allowBlank: false,
                                            value: select.get('vacation_worker_qty'),
                                            fieldLabel: gm.getMC('CMD_VACATION', '휴가')
                                        },
                                        {
                                            xtype: 'numberfield',
                                            id: gu.id('etc_worker_edit'),
                                            name: 'etc_worker',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            minValue: 0,
                                            allowBlank: false,
                                            value: select.get('etc_worker_qty'),
                                            fieldLabel: gm.getMC('CMD_ETC', '기타')
                                        },
                                    ]
                                },


                            ]
                        },
                        {
                            xtype: 'fieldset',
                            collapsible: false,
                            title: gm.me().getMC('CMD_WORKING_TIME', '작업시간(분)'),
                            width: '100%',
                            // style: 'padding:10px',
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
                                    // margin: '0 10 10 1',
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
                                            id: gu.id('regular_work_edit'),
                                            name: 'regular_work',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            minValue: 0,
                                            allowBlank: false,
                                            value: select.get('regular_work'),
                                            fieldLabel: gm.getMC('CMD_NORMAL', '정규')
                                        },
                                        {
                                            xtype: 'numberfield',
                                            id: gu.id('ext_work_edit'),
                                            name: 'ext_work',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            minValue: 0,
                                            allowBlank: false,
                                            value: select.get('ext_work'),
                                            fieldLabel: gm.getMC('CMD_OVERTIME', '연장')
                                        },
                                        {
                                            xtype: 'numberfield',
                                            id: gu.id('over_work_edit'),
                                            name: 'over_work',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            minValue: 0,
                                            allowBlank: false,
                                            value: select.get('over_work'),
                                            fieldLabel: gm.getMC('CMD_WEEKEND', '특근')
                                        },

                                    ]
                                },


                            ]
                        },

                        {
                            xtype: 'fieldset',
                            collapsible: false,
                            title: gm.me().getMC('CMD_OPERATION_TIME', '공수현황 입력(분)'),
                            width: '100%',
                            // style: 'padding:10px',
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
                                    // margin: '0 10 10 1',
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
                                            name: 'monitor_qty',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            minValue: 0,
                                            allowBlank: false,
                                            fieldLabel: gm.getMC('CMD_LEAD', '조반장'),
                                            value: select.get('monitor_qty'),

                                        },
                                        {
                                            xtype: 'numberfield',
                                            name: 'receive_qty',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            minValue: 0,
                                            allowBlank: false,
                                            fieldLabel: gm.getMC('CMD_RECEIVED', '받음'),
                                            value: select.get('receive_qty')
                                        },
                                        {
                                            xtype: 'numberfield',
                                            name: 'send_qty',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            minValue: 0,
                                            allowBlank: false,
                                            fieldLabel: gm.getMC('CMD_SEND', '보냄'),
                                            value: select.get('send_qty')
                                        },
                                    ]
                                },


                            ]
                        },
                        {
                            xtype: 'fieldset',
                            collapsible: false,
                            // title: gm.me().getMC('CMD_OPERATION_TIME', '기타'),
                            width: '100%',
                            // style: 'padding:10px',
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
                                    // margin: '0 10 10 1',
                                    border: true,
                                    defaultMargins: {
                                        top: 0,
                                        right: 0,
                                        bottom: 0,
                                        left: 10
                                    },
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            name: 'overtime_type',
                                            padding: '0 0 5px 30px',
                                            width: '93%',
                                            allowBlank: true,
                                            fieldLabel: gm.me().getMC('msg_remarks', '기타'),
                                            value: select.get('overtime_type')
                                        },
                                    ]
                                },


                            ]
                        }
                    ]
                });

                var win = Ext.create('Ext.Window', {
                    modal: true,
                    title: gm.me().getMC('mes_order_recv_btn', '실동공수 정보 수정'),
                    width: 1200,
                    height: 550,
                    plain: true,
                    items: form,
                    overflowY: 'scroll',
                    buttons: [{
                        text: CMD_OK,
                        handler: function (btn) {
                            if (btn == "no") {
                                win.close();
                            } else {
                                var form = Ext.getCmp('editForm').getForm();
                                if (form.isValid()) {
                                    // win.setLoading(true);
                                    var val = form.getValues(false);
                                    var regular_work = gu.getCmp('regular_work_edit').getValue();
                                    var ext_work = gu.getCmp('ext_work_edit').getValue();
                                    var over_work = gu.getCmp('over_work_edit').getValue();

                                    var all_worker = gu.getCmp('all_worker_edit').getValue();
                                    var go_worker = gu.getCmp('go_worker_edit').getValue();
                                    var vacation_worker = gu.getCmp('vacation_worker_edit').getValue();
                                    var etc_worker = gu.getCmp('etc_worker_edit').getValue();

                                    var compare_val = go_worker + vacation_worker + etc_worker;
                                    console_logs('compare_value', compare_val);

                                    if (regular_work > 700 || ext_work > 700 || over_work > 700) {
                                        Ext.MessageBox.show({
                                            title: '알림',
                                            msg: '작업시간 입력값 중 기준시간<b>(700 min)</b>을 초과한 값이 있습니다.<br>계속 수정을 진행하시겠습니까?',
                                            buttons: Ext.MessageBox.YESNO,
                                            icon: Ext.MessageBox.QUESTION,
                                            fn: function (btn) {
                                                if (btn == "no" || btn == "cancel") {
                                                    winPart.close();
                                                    return;
                                                } else {
                                                    form.submit({
                                                        submitEmptyText: false,
                                                        url: CONTEXT_PATH + '/production/schdule.do?method=editGongsuInfo',
                                                        params: {
                                                            unique_id_long: select.get('unique_id_long'),
                                                        },
                                                        success: function (val, action) {
                                                            win.setLoading(false);
                                                            gm.me().store.load();
                                                            win.close();
                                                        },
                                                        failure: function () {
                                                            win.setLoading(false);
                                                            extjsUtil.failureMessage();
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    } else if (compare_val > all_worker) {
                                        Ext.MessageBox.alert('알림', '(출근 + 휴가 + 기타)의 값이 재적 수보다 클 수 없습니다.<br>다시 확인해주세요.');
                                        return;
                                    } else {
                                        Ext.MessageBox.show({
                                            title: '실동공수 수정',
                                            msg: '입력한 공수 정보를 수정 하시겠습니까?',
                                            buttons: Ext.MessageBox.YESNO,
                                            fn: function (btn) {
                                                win.setLoading(true);
                                                if (btn == 'yes') {
                                                    form.submit({
                                                        submitEmptyText: false,
                                                        url: CONTEXT_PATH + '/production/schdule.do?method=editGongsuInfo',
                                                        params: {
                                                            unique_id_long: select.get('unique_id_long'),
                                                        },
                                                        success: function (val, action) {
                                                            win.setLoading(false);
                                                            gm.me().store.load();
                                                            win.close();
                                                        },
                                                        failure: function () {
                                                            win.setLoading(false);
                                                            extjsUtil.failureMessage();
                                                        }
                                                    });
                                                } else {
                                                    win.setLoading(false);
                                                }
                                            },
                                            icon: Ext.MessageBox.QUESTION
                                        });
                                    }

                                    // Ext.MessageBox.show({
                                    //     title: '실동공수 수정',
                                    //     msg: '입력한 공수 정보를 수정 하시겠습니까?',
                                    //     buttons: Ext.MessageBox.YESNO,
                                    //     fn: function (btn) {
                                    //         win.setLoading(true);
                                    //         if (btn == 'yes') {
                                    //             form.submit({
                                    //                 submitEmptyText: false,
                                    //                 url: CONTEXT_PATH + '/production/schdule.do?method=editGongsuInfo',
                                    //                 params: {
                                    //                     // assymapUid: sloastUid,
                                    //                     unique_id_long: select.get('unique_id_long'),
                                    //                     // before_machine_uid : select.get('machine_uid'),
                                    //                     // change_machine_uid : gu.getCmp('machine_uid').getValue()
                                    //                 },
                                    //                 success: function (val, action) {
                                    //                     win.setLoading(false);
                                    //                     gm.me().store.load();
                                    //                     win.close();
                                    //                 },
                                    //                 failure: function () {
                                    //                     win.setLoading(false);
                                    //                     extjsUtil.failureMessage();
                                    //                 }
                                    //             });
                                    //         }
                                    //     },
                                    //     icon: Ext.MessageBox.QUESTION
                                    // });
                                } else {
                                    Ext.MessageBox.alert('알림', '필수 입력항목 미기재 또는 부적한 값이 입력되었습니다.<br>다시 확인해주세요.');
                                    return;
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
                win.show();
            }
        });

        //버튼 추가.
        buttonToolbar.insert(1, this.addWorkGongsu);
        buttonToolbar.insert(2, this.editWorkGongsu);

        this.callParent(arguments);
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length > 0) {
                console_logs('>>>> selections', selections);
                var rec = selections[0];
                console_logs('rec ???', rec);
                gu.getCmp('selectedMtrl').setHtml('<font color=yellow>[' + rec.get('start_time') + ' / ' + rec.get('jobtoday_detail') + ']' + '</font>  ' + rec.get('name_ko') + ' (' + rec.get('work_type_kr') + ')');
                this.poPrdDetailStore.getProxy().setExtraParam('job_map', 'W');
                this.poPrdDetailStore.getProxy().setExtraParam('parent_uid', rec.get('unique_id_long'));
                this.poPrdDetailStore.load();

                this.editWorkGongsu.enable();
                this.addWasteInfo.enable();
            } else {
                this.editWorkGongsu.disable();
                this.addWasteInfo.disable();
            }
        })
        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.getProxy().setExtraParam('job_map', 'G')
        this.store.load(function (records) {
        });
    },

    comcstStore: Ext.create('Mplm.store.ComCstStore'),
    machineStore: Ext.create('Mplm.store.MachineStore', {}),
    workTypeStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'DAYNIGHT'}),
    wasteTypeStore: Ext.create('Mplm.store.WasteCodeStore'),
    selMode: 'SINGLE',
});