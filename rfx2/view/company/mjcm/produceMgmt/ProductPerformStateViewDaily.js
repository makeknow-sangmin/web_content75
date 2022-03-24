Ext.define('Rfx2.model.instantModel', {
    extend: 'Rfx.model.Base',
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/production/machine.do?method=readDailyMchnOpr',
        },
        reader: {
            type: 'json',
            root: 'datas',
            totalProperty: 'count',
            successProperty: 'success',
            excelPath: 'excelPath'
        },
    }
})
Ext.define('Rfx2.view.company.mjcm.produceMgmt.ProductPerformStateViewDaily', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'machine-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField({
            type: 'date',
            field_id: 'production_date',
            text: gm.getMC('CMD_Work_Date', '생산일자'),
            date: new Date()
        });

        //  라인명 검색조건
        this.addSearchField('name_ko');
        this.addSearchField('pcs_desc_group');

        this.addSearchField('item_name');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE']
        });

        this.createStore('Rfx2.model.instantModel', [{
            property: 'name_ko',
            direction: 'ASC'
        }],
            gMain.pageSize
            , {}
            , ['pcsmchn']
        );

        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr, function () { });


        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.createEast()]
        });

        this.callParent(arguments);

        this.store.on('load', function (params) {
            var dateWidgetId = gm.me().link + '-' + gMain.getSearchField('production_date');
            var dateWidget = gm.me().getSearchWidget(dateWidgetId);
            // console.log('동명', dateWidget.getValue());
            gm.me().production_date = dateWidget.getValue();
            // console.log('동명', gm.me().production_date);
            gm.me().mchnOprStore.getProxy().setExtraParams({
                productionDate: gm.me().production_date,
                notMchnOpr: 'Y'
            });
            gm.me().mchnOprStore.load();
        })
        var todayYyyymmdd = gu.yyyymmdd(new Date, '-');
        this.store.getProxy().setExtraParam('production_date', todayYyyymmdd);

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load();
    },
    items: [],
    production_date: null,
    // mchnOprModel: Ext.create('Rfx2.model.MachineOperation', {}),
    // mchnOprStore: Ext.create('Ext.data.Store', {
    //     model: Ext.create('Rfx2.model.MachineOperation', {}),
    //     model: this.mchnOprModel,
    //     autoLoad: false,
    //     pageSize: 50
    // }),
    mchnOprStore: null,
    popUpExcelHandler: function () {

        var myWidth = 600;
        var myHeight = 80;

        // var store = this.storeCubeDim;;
        // var menuCode = gm.me().link + '_SUB';
        // var columnList = [];

        var store = null;
        var menuCode = null;
        var columnList = [];

        function subExcelCallback() {
            store.getProxy().setExtraParam("srch_type", 'excelPrint');
            store.getProxy().setExtraParam("srch_fields", 'major');
            store.getProxy().setExtraParam("srch_rows", 'all');
            store.getProxy().setExtraParam("menuCode", menuCode);

            var checkboxItems = [];
            for (var i = 0; i < columnList.length; i++) {
                if (i % 4 == 0) {
                    myHeight += 30;
                }
                checkboxItems.push({
                    xtype: 'checkbox',
                    // checked: gm.me().columns[i]['excel_set'] === 'Y' ? true : false,
                    checked: true,
                    fieldLabel: columnList[i]['text'],
                    name: columnList[i]['id'],
                    margin: '5 20 0 5',
                    allowBlank: false,
                    codeName: columnList[i]['codeName'],
                    stateId: columnList[i]['stateId'],
                    listeners: {
                        change: function (checkbox, newVal, oldVal) {
                            for (var i = 0; i < columnList.length; i++) {
                                if (checkbox.name === columnList[i]['id']) {
                                    columnList[i]['excel_set'] = newVal ? 'Y' : 'N';
                                }
                            }
                        }
                    }
                });
            }
            var formPanel = Ext.create('Ext.form.Panel', {
                bodyPadding: 5,
                width: myWidth,
                vertical: false,
                layout: 'column',
                defaults: {
                    anchor: '100%'
                },
                defaultType: 'textfield',
                items: checkboxItems
            });

            var prWin = Ext.create('Ext.Window', {
                modal: true,
                title: '엑셀을 출력할 항목을 선택하세요',
                width: myWidth,
                height: myHeight,
                items: formPanel,
                buttons: [
                    {
                        text: CMD_OK,
                        scope: this,
                        handler: function () {

                            var formItems = formPanel.items.items;
                            var code_uids = [];
                            var system_codes = [];

                            for (var i = 0; i < formItems.length; i++) {
                                var formItem = formItems[i];
                                if (formItem['name'] === undefined) {
                                    continue;
                                }

                                var formUidArr = formItem['name'].split('-');
                                var formUid = formUidArr[1];
                                if (formItem.checked) {
                                    var system_code = formItem['codeName'];
                                    var stateId = formItem['stateId'];
                                    if (system_code !== undefined && system_code !== null) {
                                        system_codes.push(system_code + ':' + stateId);
                                    }
                                    code_uids.push(formUid);
                                }
                            }

                            store.getProxy().setExtraParam("code_uids", code_uids);
                            store.getProxy().setExtraParam("system_codes", system_codes);
                            prWin.setLoading(true);
                            store.load({
                                scope: this,
                                callback: function (records, operation, success) {
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/filedown.do?method=myExcelPath',
                                        success: function (response, request) {
                                            store.getProxy().setExtraParam("srch_type", null);
                                            var excelPath = response.responseText;
                                            if (excelPath != null && excelPath.length > 0) {
                                                var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
                                                top.location.href = url;
                                            } else {
                                                Ext.Msg.alert('경고', '엑셀 다운로드 경로를 찾을 수 없습니다.<br>엑셀 출력정책이 정의되지 않았습니다.');
                                            }
                                            prWin.setLoading(false);

                                            if (prWin) {
                                                prWin.close();
                                            }
                                        }
                                    });
                                }
                            });
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
            })
            prWin.show();
        }
        store = this.mchnOprStore;
        menuCode = gm.me().link + '_SUB';
        var subCodeStore = Ext.create('Rfx.store.ExtFieldColumnStore', {});
        subCodeStore.getProxy().setExtraParam('menuCode', menuCode);
        subCodeStore.load(function (data) {
            data.forEach(element => {
                if (!!element.data['text']) {
                    element.data['id'] = 'uid-' + element.data['unique_id_long'];
                    columnList.push(element.data);
                }
            });
            subExcelCallback();
        });
    },
    excelAction: Ext.create('Ext.Action', {
        iconCls: 'af-excel',
        text: 'Excel',
        disabled: false,
        handler: function () {
            // this.popUpExcelHandler();
            var myWidth = 600;
            var myHeight = 80;

            // var store = this.storeCubeDim;;
            // var menuCode = gm.me().link + '_SUB';
            // var columnList = [];

            var store = null;
            var menuCode = null;
            var columnList = [];
            // store = this.mchnOprStore;
            function subExcelCallback() {
                store = gm.me().mchnOprStore;
                console.log('동명동명', store);
                store.getProxy().setExtraParam("srch_type", 'excelPrint');
                store.getProxy().setExtraParam("srch_fields", 'major');
                store.getProxy().setExtraParam("srch_rows", 'all');
                store.getProxy().setExtraParam("menuCode", menuCode);

                var checkboxItems = [];
                for (var i = 0; i < columnList.length; i++) {
                    if (i % 4 == 0) {
                        myHeight += 30;
                    }
                    checkboxItems.push({
                        xtype: 'checkbox',
                        // checked: gm.me().columns[i]['excel_set'] === 'Y' ? true : false,
                        checked: true,
                        fieldLabel: columnList[i]['text'],
                        name: columnList[i]['id'],
                        margin: '5 20 0 5',
                        allowBlank: false,
                        codeName: columnList[i]['codeName'],
                        stateId: columnList[i]['stateId'],
                        listeners: {
                            change: function (checkbox, newVal, oldVal) {
                                for (var i = 0; i < columnList.length; i++) {
                                    if (checkbox.name === columnList[i]['id']) {
                                        columnList[i]['excel_set'] = newVal ? 'Y' : 'N';
                                    }
                                }
                            }
                        }
                    });
                }
                var formPanel = Ext.create('Ext.form.Panel', {
                    bodyPadding: 5,
                    width: myWidth,
                    vertical: false,
                    layout: 'column',
                    defaults: {
                        anchor: '100%'
                    },
                    defaultType: 'textfield',
                    items: checkboxItems
                });

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '엑셀을 출력할 항목을 선택하세요',
                    width: myWidth,
                    height: myHeight,
                    items: formPanel,
                    buttons: [
                        {
                            text: CMD_OK,
                            scope: this,
                            handler: function () {

                                var formItems = formPanel.items.items;
                                var code_uids = [];
                                var system_codes = [];

                                for (var i = 0; i < formItems.length; i++) {
                                    var formItem = formItems[i];
                                    if (formItem['name'] === undefined) {
                                        continue;
                                    }

                                    var formUidArr = formItem['name'].split('-');
                                    var formUid = formUidArr[1];
                                    if (formItem.checked) {
                                        var system_code = formItem['codeName'];
                                        var stateId = formItem['stateId'];
                                        if (system_code !== undefined && system_code !== null) {
                                            system_codes.push(system_code + ':' + stateId);
                                        }
                                        code_uids.push(formUid);
                                    }
                                }

                                store.getProxy().setExtraParam("code_uids", code_uids);
                                store.getProxy().setExtraParam("system_codes", system_codes);
                                prWin.setLoading(true);
                                store.load({
                                    scope: this,
                                    callback: function (records, operation, success) {
                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/filedown.do?method=myExcelPath',
                                            success: function (response, request) {
                                                store.getProxy().setExtraParam("srch_type", null);
                                                var excelPath = response.responseText;
                                                if (excelPath != null && excelPath.length > 0) {
                                                    var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
                                                    top.location.href = url;
                                                } else {
                                                    Ext.Msg.alert('경고', '엑셀 다운로드 경로를 찾을 수 없습니다.<br>엑셀 출력정책이 정의되지 않았습니다.');
                                                }
                                                prWin.setLoading(false);

                                                if (prWin) {
                                                    prWin.close();
                                                }
                                            }
                                        });
                                    }
                                });
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
                })
                prWin.show();
            }
            menuCode = gm.me().link + '_SUB';
            var subCodeStore = Ext.create('Rfx.store.ExtFieldColumnStore', {});
            subCodeStore.getProxy().setExtraParam('menuCode', menuCode);
            subCodeStore.load(function (data) {
                data.forEach(element => {
                    if (!!element.data['text']) {
                        element.data['id'] = 'uid-' + element.data['unique_id_long'];
                        columnList.push(element.data);
                    }
                });
                subExcelCallback();
            });
        }
    }),

    calcOprTimeAction: Ext.create('Ext.Action', {
        iconCls: 'af-check',
        text: '비가동시간 반영',
        disabled: true,
        handler: function () {
            let notOprArray = gm.me().productGrid.getSelectionModel().getSelection();
            // console.log('선택한 비가동목록', notOprArray);
            let uids = [];
            let isOprs = [];
            notOprArray.forEach(el => {
                uids.push(el.get('unique_id_long'));
                isOprs.push('C');
            })
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/production/machine.do?method=updateMchnOprHst',
                params: {
                    uids: uids,
                    isOprs: isOprs
                },
                success: function (response, request) {
                    Ext.MessageBox.alert('확인', '반영 되었습니다.');
                    gm.me().mchnOprStore.load();
                    gm.me().store.load();
                }
            });
        }
    }),

    unCalcOprTimeAction: Ext.create('Ext.Action', {
        iconCls: 'af-remove',
        text: '반영 해제',
        disabled: true,
        handler: function () {
            let notOprArray = gm.me().productGrid.getSelectionModel().getSelection();
            // console.log('선택한 비가동목록', notOprArray);
            let uids = [];
            let isOprs = [];
            notOprArray.forEach(el => {
                uids.push(el.get('unique_id_long'));
                isOprs.push('U');
            })
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/production/machine.do?method=updateMchnOprHst',
                params: {
                    uids: uids,
                    isOprs: isOprs
                },
                success: function (response, request) {
                    Ext.MessageBox.alert('확인', '반영해제 되었습니다.');
                    gm.me().mchnOprStore.load();
                    gm.me().store.load();
                }
            });
        }
    }),

    deleteOprHstAction: Ext.create('Ext.Action', {
        iconCls: 'af-remove',
        text: '내역 삭제',
        disabled: true,
        handler: function () {
            Ext.MessageBox.show({
                title: '삭제',
                msg: '선택한 내역을 삭제하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                fn: function (result) {
                    if (result == 'yes') {
                        let notOprArray = gm.me().productGrid.getSelectionModel().getSelection();
                        let mchnOprUids = [];
                        notOprArray.forEach(el => {
                            mchnOprUids.push(el.get('unique_id_long'));
                        })
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/production/machine.do?method=deleteMchnOprHst',
                            params: {
                                mchnOprUids: mchnOprUids,
                            },
                            success: function (response, request) {
                                Ext.MessageBox.alert('확인', '삭제 되었습니다.');
                                gm.me().mchnOprStore.load();
                                gm.me().store.load();
                            }
                        });
                    }
                }
            })
        }
    }),

    createEast: function () {
        this.mchnOprStore = Ext.create('Ext.data.Store', {
            model: Ext.create('Rfx2.model.MachineOperation', {}),
            autoLoad: false,
            pageSize: 50
        });

        var yyyyMMdd = gu.yyyymmdd(new Date, '-');
        this.mchnOprStore.getProxy().setExtraParams(
            {
                productionDate: yyyyMMdd,
                notMchnOpr: 'Y'
            }
        );

        // this.mchnOprStore.on('load', function (params) {
        //     gm.me().selectedAssy = null;
        //     gm.me().selectedBomdtl = null;
        //     gm.me().store.data.clear();
        // })
        var selModel = {
            selType: 'checkboxmodel',
            mode: 'multi',
            // checkOnly: this.selCheckOnly,
            allowDeselect: true
        };

        this.productGrid = Ext.create('Rfx.base.BaseGrid', {
            title: '비가동내역',
            store: this.mchnOprStore,
            forceFit: true,
            multiSelect: false,
            selModel: selModel,
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
                }
            },
            bbar: getPageToolbar(this.mchnOprStore),
            columns: [
                {
                    text: '호기',
                    dataIndex: 'nameKo',
                    flex: 5
                },
                {
                    text: '문제점 및 조치 내역',
                    dataIndex: 'codeNameKr',
                    flex: 30
                },
                {
                    text: '시작',
                    dataIndex: 'startTime',
                    flex: 4,
                    xtype: 'datecolumn',
                    format: 'H:i'
                },
                {
                    text: '종료',
                    dataIndex: 'endTime',
                    flex: 4,
                    xtype: 'datecolumn',
                    format: 'H:i'
                },
                {
                    text: '담당자',
                    dataIndex: 'creator',
                    flex: 5
                },
                {
                    text: '반영여부',
                    dataIndex: 'isOperation',
                    renderer: function (value) {
                        if(!!value && value === 'C'){
                            return '반영';
                        } else {
                            return '미반영';
                        }
                    },
                    flex: 5
                },
            ],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        this.calcOprTimeAction,
                        this.unCalcOprTimeAction,
                        '',
                        this.deleteOprHstAction,
                        '->',
                        this.excelAction,
                    ]
                }
            ],
        });

        this.productGrid.getSelectionModel().on({
            selectionchange: function (aa, selections) {
                if (selections.length >= 1) {
                    // var rec = selections[0]
                    // gm.me().selectedAssy = rec;
                    gm.me().deleteOprHstAction.enable();
                    gm.me().calcOprTimeAction.enable();
                    gm.me().unCalcOprTimeAction.enable();
                    // gm.me().grid.getSelectionModel().deselect();
                } else {
                    gm.me().calcOprTimeAction.disable();
                    gm.me().unCalcOprTimeAction.disable();
                    gm.me().deleteOprHstAction.disable();
                }
            }
        });

        this.east = Ext.widget('tabpanel', { // Ext.create('Ext.panel.Panel',
            // {
            layout: 'border',
            border: true,
            region: 'east',
            width: '40%',
            items: [this.productGrid]
        });
        return this.east;
    },
});
