Ext.define('Rfx2.view.company.chmr.equipState.MachineCheckListMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype : 'recv-po-ver-view',

    initComponent: function () {
        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;
        useMultitoolbar = false;
        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.addSearchField('name_ko');
        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');

        //명령툴바 생성
        let buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE', 'EXCEL']
        });


        this.checkListInsert = Ext.create('Ext.Action', {
            iconCls: 'af-plus',
            disabled: true,
            text    : '항목등록',
            handler : function (widget, event) {
                gm.me().checkPeriodStore.load();
                let checkListGrid = Ext.create('Ext.grid.Panel', {
                    store      : new Ext.data.Store(),
                    cls        : 'rfx-panel',
                    id         : gu.id('checkListGrid'),
                    collapsible: false,
                    multiSelect: false,
                    width      : 680,
                    height     : 480,
                    autoScroll : true,
                    autoHeight : true,
                    frame      : false,
                    border     : true,
                    layout     : 'fit',
                    forceFit   : false,
                    viewConfig : {
                        markDirty: false
                    },
                    columns    : [
                        {
                            text     : '순서',
                            width    : '10%',
                            style    : 'text-align:center',
                            dataIndex: 'sort_order',
                            name     : 'sort_order',
                            // editor   : 'textfield',
                            sortable: false
                        },
                        {
                            text     : '점검/급유개소',
                            width    : '15%',
                            dataIndex: 'machine_place',
                            style    : 'text-align:center',
                            align    : 'left',
                            editor   : 'textfield',
                            listeners: {},
                            sortable : false
                        },
                        {
                            text     : '점검/급유항목',
                            width    : '15%',
                            dataIndex: 'machine_section',
                            style    : 'text-align:center',
                            align    : 'left',
                            editor   : 'textfield',
                            listeners: {},
                            sortable : false
                        },

                        {
                            text     : '점검/급유기준',
                            width    : '15%',
                            dataIndex: 'machine_baseline',
                            style    : 'text-align:center',
                            align    : 'left',
                            editor   : 'textfield',
                            listeners: {},
                            sortable : false
                        },
                        {
                            text     : '점검/급유방법',
                            width    : '13%',
                            dataIndex: 'check_method',
                            style    : 'text-align:center',
                            align    : 'left',
                            editor   : 'textfield',
                            listeners: {},
                            sortable : false
                        },
                        {
                            text     : '점검시기',
                            width    : '15%',
                            dataIndex: 'check_period',
                            style    : 'text-align:center',
                            align    : 'left',
                            editor   : {
                                xtype         : 'combobox',
                                displayField  : 'codeName',
                                editable      : false,
                                forceSelection: true,
                                store         : gm.me().checkPeriodStore,
                                triggerAction : 'all',
                                valueField    : 'systemCode'
                            },
                            listeners: {},
                            renderer: function (val) {
                                let recordIndex = gm.me().checkPeriodStore.find('systemCode', val);
                                if (recordIndex === -1) {
                                    return '';
                                }
                                return gm.me().checkPeriodStore.getAt(recordIndex).get('codeName');
                            },
                            sortable : false
                        },
                        {
                            text     : '점검주기',
                            width    : '13%',
                            dataIndex: 'check_duration',
                            style    : 'text-align:center',
                            align    : 'left',
                            editor   : 'textfield',
                            listeners: {},
                            sortable : false
                        },
                    ],
                    selModel   : 'cellmodel',
                    plugins    : {
                        ptype       : 'cellediting',
                        clicksToEdit: 2
                    },
                    listeners  : {},
                    autoScroll : true,
                    dockedItems: [
                        Ext.create('widget.toolbar', {
                            plugins: {
                                boxreorderer: false
                            },
                            cls    : 'my-x-toolbar-default2',
                            margin : '0 0 0 0',
                            items  : [
                                {
                                    text     : '추가',
                                    listeners: [{
                                        click: function () {
                                            let store_cnt = gu.getCmp('checkListGrid').getStore().getCount();
                                            if (store_cnt > 0) {
                                                gu.getCmp('checkListGrid').getStore().insert(store_cnt + 1, new Ext.data.Record({
                                                    'sort_order'      : store_cnt + 1,
                                                    'machine_place'   : '',
                                                    'machine_section' : '',
                                                    'machine_baseline': '',
                                                    'check_method'    : '',
                                                    'check_period'    : '',
                                                    'check_duration'  : ''
                                                }));
                                            } else {
                                                gu.getCmp('checkListGrid').getStore().insert(0, new Ext.data.Record({
                                                    'sort_order'      : 1,
                                                    'machine_place'   : '',
                                                    'machine_section' : '',
                                                    'machine_baseline': '',
                                                    'check_method'    : '',
                                                    'check_period'    : '',
                                                    'check_duration'  : ''
                                                }));
                                            }
                                        }
                                    }]
                                },
                                {
                                    text     : '삭제',
                                    listeners: [{
                                        click: function () {
                                            let record = gu.getCmp('checkListGrid').getSelectionModel().getSelected().items[0];
                                            if (record === undefined) {
                                                let store = gu.getCmp('checkListGrid').getStore();
                                                gu.getCmp('checkListGrid').getStore().remove(store.last());
                                            } else {
                                                gu.getCmp('checkListGrid').getStore().removeAt(gu.getCmp('checkListGrid').getStore().indexOf(record));
                                            }
                                        }
                                    }]
                                }

                            ]
                        })
                    ]
                });

                let form = Ext.create('Ext.form.Panel', {
                    xtype        : 'form',
                    frame        : false,
                    border       : false,
                    region       : 'left',
                    layout       : 'form',
                    autoScroll   : true,
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget : 'side'
                    },
                    items        : [
                        {
                            xtype   : 'fieldset',
                            layout  : 'column',
                            flex    : 0.5,
                            title   : '아래 추가버튼을 클릭하여 점검항목을 작성하십시오.',
                            defaults: {
                                margin: '3 3 3 3'
                            },
                            items   : [
                                checkListGrid
                            ]
                        }
                    ]
                });

                let prWin = Ext.create('Ext.Window', {
                    modal  : true,
                    title  : '점검항목 등록',
                    width  : 700,
                    height : 660,
                    items  : form,
                    buttons: [
                        {
                            text   : CMD_OK,
                            scope  : this,
                            handler: function () {
                                let selection = gm.me().grid.getSelectionModel().getSelection()[0];
                                let store_cnt = gu.getCmp('checkListGrid').getStore().getCount();
                                if (store_cnt === 0) {
                                    Ext.MessageBox.alert('알림', '항목이 추가되지 않았습니다.<br>다시 확인해주세요.');
                                    return;
                                } else {
                                    Ext.MessageBox.show({
                                        title  : '확인',
                                        msg    : '입력한 점검항목을 등록하시겠습니까?',
                                        buttons: Ext.MessageBox.YESNO,
                                        fn     : function (result) {
                                            if (result == 'yes') {
                                                prWin.setLoading(true);
                                                let objs1 = [];
                                                let obj1 = {};
                                                let columns1 = [];
                                                let store = gu.getCmp('checkListGrid').getStore();
                                                let isEmptyMachinePlace = false;
                                                let isEmptyMachineSection = false;
                                                let isEmptyMachineBaseline = false;
                                                let isEmptyCheckMethod = false;
                                                let isEmptyCheckPeriod = false;
                                                let isEmptyCheckDuration = false;
                                                for (let i = 0; i < store_cnt; i++) {
                                                    let vo = store.data.items[i];
                                                    let machine_place = vo.get('machine_place');
                                                    let machine_section = vo.get('machine_section');
                                                    let machine_baseline = vo.get('machine_baseline');
                                                    let check_method = vo.get('check_method');
                                                    let check_period = vo.get('check_period');
                                                    let check_duration = vo.get('check_duration');

                                                    if (machine_place === undefined || machine_place === null || (machine_place.replace(/(\s*)/g, "")).length === 0) {
                                                        isEmptyMachinePlace = true;
                                                        break;
                                                    }

                                                    if (machine_section === undefined || machine_section === null || (machine_section.replace(/(\s*)/g, "")).length === 0) {
                                                        isEmptyMachineSection = true;
                                                        break;
                                                    }

                                                    if (machine_baseline === undefined || machine_baseline === null || (machine_baseline.replace(/(\s*)/g, "")).length === 0) {
                                                        isEmptyMachineBaseline = true;
                                                        break;
                                                    }

                                                    if (check_method === undefined || check_method === null || (check_method.replace(/(\s*)/g, "")).length === 0) {
                                                        isEmptyCheckMethod = true;
                                                        break;
                                                    }

                                                    if (check_period === undefined || check_period === null || (check_period.replace(/(\s*)/g, "")).length === 0) {
                                                        isEmptyCheckPeriod = true;
                                                        break;
                                                    }

                                                    if (check_duration === undefined || check_duration === null || (check_duration.replace(/(\s*)/g, "")).length === 0) {
                                                        isEmptyCheckDuration = true;
                                                        break;
                                                    }
                                                }

                                                if (isEmptyMachinePlace === true || isEmptyMachineSection === true || isEmptyMachineBaseline === true || isEmptyCheckMethod === true || isEmptyCheckPeriod === true || isEmptyCheckDuration === true) {
                                                    Ext.MessageBox.alert('알림', '입력한 정보에 공란이 있습니다.<br>다시 확인해주세요.');
                                                    prWin.setLoading(false);
                                                    return;
                                                } else {
                                                    let store = gu.getCmp('checkListGrid').getStore();
                                                    for (let i = 0; i < store_cnt; i++) {
                                                        let item = store.data.items[i];
                                                        let objv1 = {};
                                                        objv1['sort_order'] = item.get('sort_order');
                                                        objv1['machine_place'] = item.get('machine_place');
                                                        objv1['machine_section'] = item.get('machine_section');
                                                        objv1['machine_baseline'] = item.get('machine_baseline');
                                                        objv1['check_method'] = item.get('check_method');
                                                        objv1['check_period'] = item.get('check_period');
                                                        objv1['check_duration'] = item.get('check_duration');
                                                        columns1.push(objv1);
                                                    }
                                                }

                                                obj1['machine_check'] = columns1;
                                                objs1.push(obj1);
                                                let jsonData = Ext.util.JSON.encode(objs1);
                                                if (jsonData != null) {
                                                    Ext.Ajax.request({
                                                        url    : CONTEXT_PATH + '/production/machine.do?method=addMachineCheckBaseLine',
                                                        params : {
                                                            machine_uid: selection.get('unique_id_long'),
                                                            jsonData   : jsonData
                                                        },
                                                        success: function (result, request) {
                                                            prWin.setLoading(false);
                                                            gm.me().store.load();
                                                            gu.getCmp('gridContractCompany').getStore().load();
                                                            prWin.close();
                                                            Ext.Msg.alert('안내', '등록되었습니다.', function () {});
                                                        },//endofsuccess
                                                        failure: extjsUtil.failureMessage
                                                    });//endofajax
                                                }
                                            }
                                        },
                                        icon   : Ext.MessageBox.QUESTION
                                    });
                                }
                            }
                        },
                        {
                            text   : CMD_CANCEL,
                            scope  : this,
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



        this.deleteCheckList = Ext.create('Ext.Action', {
            xtype   : 'button',
            iconCls : 'af-remove',
            text    : CMD_DELETE,
            tooltip : '금형삭제',
            disabled: true,
            handler : function () {
                Ext.MessageBox.show({
                    title  : '삭제',
                    msg    : '선택한 항목을 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn     : function (btn) {
                        if (btn == 'yes') {
                            let mainSel = gm.me().grid.getSelectionModel().getSelection()[0];
                            let record = gm.me().gridContractCompany.getSelectionModel().getSelection();
                            console_logs('>>>. let record', record);
                            let uniqueIds = [];
                            for(let i = 0; i <record.length; i++) {
                                let rec = record[i];
                                uniqueIds.push(rec.get('unique_id_long'));
                            }
                            Ext.Ajax.request({
                                url    : CONTEXT_PATH + '/production/machine.do?method=deleteCheckList',
                                params : {
                                    uniqueIds: uniqueIds,
                                    pcsmchn_uid : mainSel.get('unique_id_long')
                                },
                                success: function (result, request) {
                                    let resultText = result.responseText;
                                    console_log('result:' + resultText);
                                    gm.me().store.load();
                                    Ext.Msg.alert('안내', '삭제되었습니다.', function () {});
                                    gu.getCmp('gridContractCompany').getStore().load();
                                },
                                failure: extjsUtil.failureMessage
                            });//endof ajax request
                        }
                    },
                    icon   : Ext.MessageBox.QUESTION
                });
            }
        });

        this.downloadSheetAction = Ext.create('Ext.Action', {
            xtype   : 'button',
            iconCls : 'af-excel',
            text    : 'Excel',
            disabled: false,
            handler : function () {
                gm.setCenterLoading(true);
                let store = Ext.create('Rfx2.store.company.chmr.MoldDetailByUidStore', {});
                store.getProxy().setExtraParam("srch_type", 'excelPrint');
                store.getProxy().setExtraParam("srch_fields", 'major');
                store.getProxy().setExtraParam("srch_rows", 'all');
                store.getProxy().setExtraParam("is_excel_print", 'Y');
                store.getProxy().setExtraParam("menuCode", 'EMC8_EXL');

                let items = searchToolbar.items.items;
                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    store.getProxy().setExtraParam(item.name, item.value);
                }
                let arrField = gm.me().gSearchField;
                try {
                    Ext.each(arrField, function (fieldObj, index) {
                        console_log(typeof fieldObj);
                        let dataIndex = '';
                        if (typeof fieldObj == 'string') { //text search
                            dataIndex = fieldObj;
                        } else {
                            dataIndex = fieldObj['field_id'];
                        }
                        let srchId = gm.getSearchField(dataIndex);
                        let value = Ext.getCmp(srchId).getValue();
                        if (value != null && value != '') {
                            if (dataIndex == 'unique_id' || typeof fieldObj == 'object') {
                                store.getProxy().setExtraParam(dataIndex, value);
                            } else {
                                let enValue = Ext.JSON.encode('%' + value + '%');
                                console_info(enValue);
                                store.getProxy().setExtraParam(dataIndex, enValue);
                            }//endofelse
                        }//endofif

                    });
                } catch (noError) {
                }

                store.load({
                    scope   : this,
                    callback: function (records, operation, success) {
                        Ext.Ajax.request({
                            url    : CONTEXT_PATH + '/filedown.do?method=myExcelPath',
                            params : {
                                mc_codes: gUtil.getMcCodes()
                            },
                            success: function (response, request) {
                                gm.setCenterLoading(false);
                                store.getProxy().setExtraParam("srch_type", null);
                                let excelPath = response.responseText;
                                if (excelPath != null && excelPath.length > 0) {
                                    let url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
                                    top.location.href = url;
                                } else {
                                    Ext.Msg.alert('경고', '엑셀 다운로드 경로를 찾을 수 없습니다.<br>엑셀 출력정책이 정의되지 않았습니다.');
                                }
                            }
                        });

                    }
                });
            }
        });

        this.createStore('Rfx.model.CuringMchn', [{
                property : 'unique_id',
                direction: 'DESC'
            }],
            gm.pageSize
            , {
                creator  : 'a.creator',
                unique_id: 'a.unique_id'
            }
            , ['pcsmchn']
        );
        let arr = [];
        arr.push(buttonToolbar);

        //검색툴바 생성
        let searchToolbar = this.createSearchToolbar();
        arr.push(searchToolbar);


        this.poPrdDetailStore = Ext.create('Rfx2.store.company.chmr.MachineCheckListStore', {});

        this.checkEditAction = Ext.create('Ext.Action', {
            iconCls : 'af-edit',
            text    : '수정',
            disabled: true,
            handler : function () {
                let record = gm.me().gridContractCompany.getSelectionModel().getSelected().items[0];
                gm.me().checkPeriodStore.load();

                let form = Ext.create('Ext.form.Panel', {
                    id : 'addPoForm',
                    xtype : 'form',
                    frame : false,
                    border : false,
                    width : '100%',
                    layout : 'column',
                    bodyPadding: 10,
                    items : [
                        {
                            xtype      : 'fieldset',
                            collapsible: false,
                            title      : '수정정보를 입력해주시기 바랍니다.',
                            width      : '99%',
                            style      : 'padding:10px',
                            defaults   : {
                                labelStyle: 'padding:10px',
                                anchor    : '100%',
                                layout    : {
                                    type: 'column'
                                }
                            },
                            items      : [
                                {
                                    xtype         : 'container',
                                    width         : '100%',
                                    border        : true,
                                    defaultMargins: {
                                        top   : 0,
                                        right : 0,
                                        bottom: 0,
                                        left  : 10
                                    },
                                    items         : [
                                        {
                                            fieldLabel: 'UID',
                                            xtype     : 'hiddenfield',
                                            anchor    : '100%',
                                            width     : '99%',
                                            name      : 'unique_id_long',
                                            value     : record.get('unique_id_long')
                                        },
                                        {
                                            xtype     : 'textfield',
                                            id        : gu.id('machine_place'),
                                            name      : 'machine_place',
                                            padding   : '0 0 5px 30px',
                                            width     : '90%',
                                            anchor    : '100%',
                                            format    : 'Y-m-d',
                                            allowBlank: true,
                                            fieldLabel: '점검/급유개소',
                                            value     : record.get('machine_place')
                                        },
                                        {
                                            xtype     : 'textfield',
                                            id        : gu.id('machine_section'),
                                            name      : 'machine_section',
                                            padding   : '0 0 5px 30px',
                                            width     : '90%',
                                            anchor    : '100%',
                                            allowBlank: true,
                                            fieldLabel: '점검/급유항목',
                                            value     : record.get('machine_section')
                                        },
                                        {
                                            xtype     : 'textfield',
                                            id        : gu.id('machine_baseline'),
                                            name      : 'machine_baseline',
                                            padding   : '0 0 5px 30px',
                                            width     : '90%',
                                            anchor    : '100%',
                                            allowBlank: true,
                                            fieldLabel: '점검/급유기준',
                                            value     : record.get('machine_baseline')
                                        },
                                        {
                                            xtype     : 'textfield',
                                            id        : gu.id('check_method'),
                                            name      : 'check_method',
                                            padding   : '0 0 5px 30px',
                                            width     : '90%',
                                            anchor    : '100%',
                                            allowBlank: true,
                                            fieldLabel: '점검/급유방법',
                                            value     : record.get('check_method')
                                        },
                                        {
                                            xtype : 'combo',
                                            id        : gu.id('check_period'),
                                            name      : 'check_period',
                                            padding   : '0 0 5px 30px',
                                            width     : '90%',
                                            anchor    : '100%',
                                            displayField: 'code_name_kr',
                                            valueField: 'system_code',
                                            store:  gm.me().checkPeriodStore,
                                            allowBlank: true,
                                            fieldLabel: '시기',
                                            value     : record.get('check_period')
                                        },
                                        {
                                            xtype     : 'textfield',
                                            id        : gu.id('check_duration'),
                                            name      : 'check_duration',
                                            padding   : '0 0 5px 30px',
                                            width     : '90%',
                                            anchor    : '100%',
                                            format    : 'Y-m-d',
                                            allowBlank: true,
                                            fieldLabel: '주기',
                                            value     : record.get('check_duration')
                                        },
                                    ]
                                },

                            ]
                        }
                    ]
                });

                let win = Ext.create('Ext.Window', {
                    modal  : true,
                    title  : '수정',
                    width  : 500,
                    height : 350,
                    plain  : true,
                    items  : form,
                    buttons: [{
                        text   : CMD_OK,
                        handler: function (btn) {
                            if (btn == "no") {
                                win.close();
                            } else {
                                let form = Ext.getCmp('addPoForm').getForm();
                                if (form.isValid()) {
                                    win.setLoading(true);
                                    let val = form.getValues(false);
                                    form.submit({
                                        submitEmptyText: false,
                                        url : CONTEXT_PATH + '/production/machine.do?method=editMcBaseline',
                                        success : function (val, action) {
                                            win.setLoading(false);
                                            gm.me().store.load();
                                            gu.getCmp('gridContractCompany').getStore().load();
                                            win.close();
                                        },
                                        failure        : function () {
                                            win.setLoading(false);
                                            extjsUtil.failureMessage();
                                            gm.me().store.load();
                                        }
                                    });
                                } else {

                                }
                            }
                        }
                    }, {
                        text   : CMD_CANCEL,
                        handler: function (btn) {
                            win.close();
                        }
                    }]
                });
                win.show();
            }
        });

        this.gridContractCompany = Ext.create('Ext.grid.Panel', {
            cls        : 'rfx-panel',
            id         : gu.id('gridContractCompany'),
            store      : this.poPrdDetailStore,
            viewConfig : {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            region     : 'center',
            autoScroll : true,
            autoHeight : true,
            flex       : 1,
            frame      : true,
            bbar       : getPageToolbar(this.poPrdDetailStore),
            border     : true,
            layout     : 'fit',
            forceFit   : false,
            plugins    : {
                ptype       : 'cellediting',
                clicksToEdit: 1
            },
            selModel   : Ext.create("Ext.selection.CheckboxModel", {}),
            margin     : '0 0 0 0',
            dockedItems: [
                {
                    dock : 'top',
                    xtype: 'toolbar',
                    cls  : 'my-x-toolbar-default1',
                    items: [
                        {
                            xtype: 'component',
                            id   : gu.id('selectedMtrl'),
                            html : '좌측 설비리스트를 선택하여 확인하십시오.',
                            width: 700,
                            style: 'color:white;font-weight:normal;text-align:left;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;'
                        }
                    ]
                },
                {
                    dock : 'top',
                    xtype: 'toolbar',
                    items: [
                        this.checkListInsert,
                        this.checkEditAction,
                        this.deleteCheckList,
                    ]
                }
            ],
            columns    : [
                {
                    text     : 'No',
                    width    : 50,
                    style    : 'text-align:center',
                    dataIndex: 'sort_order',
                    sortable : false
                },
                {
                    text     : '점검/급유개소',
                    width    : 100,
                    style    : 'text-align:center',
                    dataIndex: 'machine_place',
                    sortable : false
                },
                {
                    text     : '점검/급유항목',
                    width    : 100,
                    style    : 'text-align:center',
                    dataIndex: 'machine_section',
                    sortable : false
                },
                {
                    text     : '점검/급유기준',
                    width    : 100,
                    style    : 'text-align:center',
                    dataIndex: 'machine_baseline',
                    sortable : false
                },
                {
                    text     : '점검/급유방법',
                    width    : 100,
                    style    : 'text-align:center',
                    dataIndex: 'check_method',
                    sortable : false
                },
                {
                    text     : '시기',
                    width    : 100,
                    style    : 'text-align:center',
                    dataIndex: 'check_period_kr',
                    sortable : false
                },
                {
                    text     : '주기',
                    width    : 100,
                    style    : 'text-align:center',
                    dataIndex: 'check_duration',
                    sortable : false
                },

            ],
            title      : '설비점검 기준관리',
            name       : 'po',
            autoScroll : true,
            listeners  : {}
        });

        this.gridContractCompany.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                console_logs('>>>>>>> rec', selections);
                if (selections.length) {
                    gm.me().deleteCheckList.enable();
                    gm.me().checkEditAction.enable();
                } else {
                    gm.me().deleteCheckList.disable();
                    gm.me().checkEditAction.disable();
                }
            }
        });

        //grid 생성.
        this.createGrid(searchToolbar, buttonToolbar/**, option**/);
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items : [
                {
                    collapsible: false,
                    frame      : false,
                    region     : 'west',
                    layout     : {
                        type : 'hbox',
                        pack : 'start',
                        align: 'stretch'
                    },
                    margin     : '5 0 0 0',
                    width      : '50%',
                    items      : [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width : '100%',
                        items : [this.grid]
                    }]
                }, this.gridContractCompany
            ]
        });

        this.callParent(arguments);
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                let rec = selections[0];
                let name_ko = rec.get('name_ko');
                let maker = rec.get('maker');
                gu.getCmp('selectedMtrl').setHtml(name_ko + ' [' + maker + ']');
                this.poPrdDetailStore.getProxy().setExtraParam('pcsmchn_uid', rec.get('unique_id_long'));
                this.poPrdDetailStore.getProxy().setExtraParam('orderBy', 'pcscheck.sort_order');
                this.poPrdDetailStore.getProxy().setExtraParam('limit', '100');
                this.poPrdDetailStore.load();
                this.checkListInsert.enable();
            } else {
                this.checkListInsert.disable();
            }
        })

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function (records) {
        });
    },
    checkPeriodStore : Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'CHECK_PERIOD'}),
});



