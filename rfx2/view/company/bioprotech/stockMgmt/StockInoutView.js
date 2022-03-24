Ext.define('Rfx2.view.company.bioprotech.stockMgmt.StockInoutView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'stock-ino-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        Ext.each(this.columns, function (columnObj) {
            let dataIndex = columnObj["dataIndex"];

            switch (dataIndex) {
                case 'cur_qty_last':
                    columnObj["renderer"] = function (value) {
                        if (value < 0) {
                            return 0;
                        } else {
                            return Ext.util.Format.number(value, '0,00/i');
                        }
                    };
                    break;
                default:
                    break;
            }
        });

        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();

        //검색툴바 추가
        this.addSearchField({
            type: 'dateRange',
            field_id: 'range_date',
            text: "수불일자",
            sdate: new Date(year, month, 1),
            edate: new Date()
        });

        this.addSearchField({
            type: 'combo',
            width: 150
            , field_id: 'comcst_uid'
            , emptyText: 'Site'
            , store: "ComCstStore"
            , displayField: 'division_name'
            , valueField: 'unique_id_long'
            , value: 'unique_id_long'
            , innerTpl: '<div data-qtip="{unique_id_long}">{division_name}</div>'
            , chainCombo: 'whouse_uid'
        });

        this.addSearchField({
            field_id: 'whouse_uid'
            , emptyText: '창고명'
            , width: 150
            , store: "Rfx2.store.company.bioprotech.WarehouseStore"
            , displayField: 'wh_name'
            , valueField: 'unique_id'
            , autoLoad: true
            , innerTpl: '<div data-qtip="{unique_id}">{wh_name}</div>'
        });

        this.addSearchField(
        {
            xtype: 'combo'
            , anchor: '100%'
            , emptyText: '제품구분'
            , width: 150
            , field_id: 'sg_code'
            , store: 'ClaastStore'
            , displayField: 'class_name'
            , valueField: 'class_code'
            , params: {level1: '1', identification_code: 'MT'}
            , innerTpl: '[{class_code}]{class_name}'
        });

        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.setEditPanelTitle('상세보기');

        //검색툴바 생성
        let searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        let buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: [
                'REGIST', 'COPY', 'REMOVE'
            ],
        });
        this.localSize = gm.unlimitedPageSize;
        this.createStore('Rfx2.model.company.kbtech.InnOutDailyMonthly', [{
                property: 'unique_id',
                direction: 'ASC'
            }],
            this.localSize,
             {
                item_code_dash: 's.item_code',
                comment: 's.comment1'
            },
            ['srcahd']
        );

        this.createGrid(searchToolbar, buttonToolbar);

        //입력/상세 창 생성.
        this.createCrudTab();

        this.editAction.setText('상세보기');

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.setGridOnCallback(function (selections) {
            if (selections.length > 0) {

                let create_date = '';
                let ream_stock = '';

                let exParams = gm.me().store.getProxy().extraParams;

                this.workOrderGrid.getStore().getProxy().setExtraParam('range_date', exParams['range_date']);
                this.workOrderGrid.getStore().getProxy().setExtraParam('nstock_uid', selections[0].get('nstock_uid'));
                this.workOrderGrid.getStore().load(function (record1) {

                    gm.me().StoHsdStore.getProxy().setExtraParam('nstock_uid', selections[0].get('nstock_uid'));
                    gm.me().StoHsdStore.getProxy().setExtraParam('range_date', exParams['range_date']);
                    gm.me().StoHsdStore.load(function (records) {
                        create_date = records[0].get('stock_date');
                        ream_stock = records[0].get('pre_stock');

                        gm.me().workListStore.add(
                            {
                                category : '기초재고',
                                create_date : create_date,
                                creator : '',
                                doc_no : '',
                                inout_qty : '',
                                inout_route : '',
                                ream_stock : ream_stock
                            }
                        );

                        let num = 0;

                        for(let i=0; i<record1.length; i++) {
                            let category = record1[i].get('category');
                            let inout_qty = record1[i].get('inout_qty');

                            if(i === 0) {
                                if(category === "입고") {
                                    num = ream_stock + inout_qty
                                    record1[0].set("ream_stock", num);
                                } else if(category === "출고")  {
                                    num = ream_stock - Math.abs(inout_qty)
                                    record1[0].set("ream_stock", num);
                                }
                            } else {
                                if(category === "입고")
                                {
                                    num = num + inout_qty;
                                    record1[i].set("ream_stock", num);
                                } else if(category === "출고")  {
                                    num = num - Math.abs(inout_qty);
                                    record1[i].set("ream_stock", num);
                                }
                            }


                        }
                    });

                });

                gm.me().workListStore.sort("create_date", 'ASC');
            }
        });

        let printExcelAction = Ext.create('Ext.Action', {
            iconCls: 'af-excel',
            html: 'Excel',
            handler: function () {

                let store = gm.me().workListStore;

                store.getProxy().setExtraParam("srch_type", 'excelPrint');
                store.getProxy().setExtraParam("srch_fields", 'major');
                store.getProxy().setExtraParam("srch_rows", 'all');
                store.getProxy().setExtraParam("menuCode", 'PMS1_INO_SUB');

                let arrField = gm.me().gSearchField;

                try {
                    Ext.each(arrField, function (fieldObj) {

                        console_log(typeof fieldObj);

                        let dataIndex;

                        if (typeof fieldObj == 'string') { //text search
                            dataIndex = fieldObj;
                        } else {
                            dataIndex = fieldObj['field_id'];
                        }

                        let srchId = gMain.getSearchField(dataIndex);
                        let value = Ext.getCmp(srchId).getValue();

                        if (value != null && value !== '') {
                            if (dataIndex === 'unique_id' || typeof fieldObj == 'object') {
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
                    scope: this,
                    callback: function () {

                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/filedown.do?method=myExcelPath',
                            params: {
                                mc_codes: gu.getMcCodes()
                            },
                            success: function (response) {

                                store.getProxy().setExtraParam("srch_type", null);
                                let excelPath = response.responseText;
                                if (excelPath != null && excelPath.length > 0) {
                                    top.location.href = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;

                                } else {
                                    Ext.Msg.alert('경고', '엑셀 다운로드 경로를 찾을 수 없습니다.<br>엑셀 출력정책이 정의되지 않았습니다.');
                                }
                            }
                        });

                    }
                });

            }
        });

        let printIRPAction = Ext.create('Ext.Action', {
            iconCls: 'af-excel',
            text: '수불부 발행',
            hidden: gu.setCustomBtnHiddenProp('printIRPAction'),
            handler: function () {

                let form = Ext.create('Ext.form.Panel', {
                    id: 'formPanelReqDate',
                    xtype: 'form',
                    frame: false,
                    border: false,
                    autoScroll: true,
                    region: 'center',
                    defaults: {
                        anchor: '100%',
                        allowBlank: false,
                        msgTarget: 'side',
                        labelWidth: 60
                    },
                    items: [
                        {
                            xtype: 'label',
                            style:'display:block; padding:8px 10px 0px 10px',
                            html: '수불부 유형을 선택하시기 바랍니다. <b>일자별수불부</b>의 기한은 자동으로 시작일의 초일에서 말일까지로 지정됩니다.'
                        },
                        {
                            xtype: 'fieldset',
                            margin: '10 10 10 10',
                            items: [
                                {
                                    xtype: 'radiogroup',
                                    id: gu.id('irpCategory'),
                                    columns: 1,
                                    items: [
                                        {boxLabel: '기본수불부', name: 'radio', inputValue: 'BASIC', checked: true},
                                        {boxLabel: '유형별수불부', name: 'radio', inputValue: 'TYPE'},
                                        {boxLabel: '일자별수불부', name: 'radio', inputValue: 'DAILY'},
                                    ]
                                }
                            ]
                        }
                    ]
                });

                let prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '수불부 발행',
                    width: 350,
                    height: 230,
                    plain: true,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function (btn) {
                            if (btn === 'no') {
                                prWin.close();
                            } else {

                                let irpCategory = gu.getCmp('irpCategory').lastValue.radio;

                                prWin.setLoading(true);

                                let searchParams = {};

                                for (let i = 0; i < gm.me().searchField.length; i++) {
                                    let type = 'text';
                                    let key = gm.me().searchField[i];

                                    if (typeof key == 'object') {
                                        let myO = key;
                                        key = myO['field_id'];
                                        type = myO['type'];
                                    }

                                    let srchId = gm.me().link + '-' + gMain.getSearchField(key);

                                    let value = null;
                                    let value1 = null;

                                    let o = gm.me().getSearchWidget(srchId);
                                    if (o != null) {
                                        value = o.getValue();
                                    }

                                    let o1 = gm.me().getSearchWidget(srchId + '_');

                                    if (o1 != null) {
                                        value1 = o1.getValue();
                                    }

                                    if (value1 != null && value1 !== '') {//콤보박스 히든밸류
                                        searchParams[key] = value1;
                                    } else {
                                        if (key != null && key !== '' && value != null && value.length > 0) {
                                            if (type === 'area' || key === 'unique_id' || key === 'barcode' || typeof key == 'object') {
                                                searchParams[key] = value;
                                            } else {
                                                searchParams[key] = Ext.JSON.encode('%' + value + '%');
                                            }//endofelse

                                        } else {//endofif
                                            searchParams[key] = null;
                                        }

                                    }
                                }

                                searchParams['over_zero_all_column'] = 'Y';
                                searchParams['irpCategory'] = irpCategory;
                                searchParams['not_sg_code_list'] = ['CS'];

                                if (irpCategory === 'DAILY') {
                                    let s_date = gm.me().getSearchWidget('PMS1_INO-srchRange_date-s').value;

                                    let s_date_year = s_date.getFullYear();
                                    let s_date_month = s_date.getMonth() + 1;
                                    let s_date_day = 1;

                                    let s_date_lastDate = new Date(s_date_year, s_date_month, 0);
                                    let e_date_day = s_date_lastDate.getDate();

                                    s_date = s_date_year + '-'
                                        + (s_date_month > 9 ? s_date_month : '0' + s_date_month)
                                        + '-' + (s_date_day > 9 ? s_date_day : '0' + s_date_day);
                                    let e_date = s_date_year + '-'
                                        + (s_date_month > 9 ? s_date_month : '0' + s_date_month)
                                        + '-' + e_date_day;

                                    searchParams['range_date'] = '%' + s_date + ':' + e_date + '%';
                                }

                                searchParams['group_by'] = 'nstock_uid,inout_date,category';

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/inventory/prchStock.do?method=printIRP',
                                    params: searchParams,
                                    success: function (result) {
                                        let jsonData = Ext.JSON.decode(result.responseText);
                                        let excelPath = jsonData.excelPath;
                                        top.location.href = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;

                                        if (prWin) {
                                            prWin.close();
                                        }

                                    },//Ajax success
                                    failure: function () {
                                        Ext.Msg.alert('오류', '엑셀 파일을 다운로드 할 수 없습니다.');

                                        if (prWin) {
                                            prWin.close();
                                        }
                                    }
                                });
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
            }
        });

        buttonToolbar.insert(1, printIRPAction);

        this.addTabworkOrderGridPanel('상세정보', 'PMS1_INO_SUB', {
                pageSize: 100,
                model: 'Rfx.model.InnoutLine',
                dockedItems: [
                    {
                        dock: 'top',
                        xtype: 'toolbar',
                        cls: 'my-x-toolbar-default2',
                        items: [
                            {
                                id: gu.id('innout_gubun'),
                                labelStyle: 'width:50px; color: #000000;',
                                fieldLabel: '구분',
                                // allowBlank: false,
                                xtype: 'combo',
                                width: '30%',
                                // padding: '0 0 5px 30px',
                                fieldStyle: 'background-image: none;',
                                store: this.innoutGubunStore,
                                emptyText: '선택해주세요',
                                displayField: 'display',
                                valueField: 'value',
                                value : 'ALL',
                                sortInfo: { field: 'display', direction: 'ASC' },
                                typeAhead: false,
                                minChars: 1,
                                listConfig: {
                                    loadingText: 'Searching...',
                                    emptyText: 'No matching posts found.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{value}">{display}</div>';
                                    }
                                },
                                listeners: {
                                    select: function () {
                                        let rec = gm.me().grid.getSelectionModel().getSelection()[0];
                                        let gubun = gu.getCmp('innout_gubun').getValue();

                                        let exParams = gm.me().store.getProxy().extraParams;
                                        gm.me().workOrderGrid.getStore().getProxy().setExtraParam('range_date', exParams['range_date']);
                                        gm.me().workOrderGrid.getStore().getProxy().setExtraParam('nstock_uid', rec.get('nstock_uid'));
                                        gm.me().workOrderGrid.getStore().getProxy().setExtraParam('inout_gubun', gubun);
                                        gm.me().workOrderGrid.getStore().load();
                                    }// endofselect
                                }
                            },
                            '->',
                            printExcelAction,
                        ]
                    }
                ],
                sorters: [{
                    property: 'unique_id',
                    direction: 'ASC'
                }]
            },
            function (selections) {},
            'workOrderGrid'//toolbar
        );

        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);

        let yyyymmdd = gUtil.yyyymmdd(new Date(year, month, 1)) + ':' + gUtil.yyyymmdd(new Date());
        this.store.getProxy().setExtraParam('whouse_uid_def', 102);
        this.store.getProxy().setExtraParam('range_date', yyyymmdd);
        this.store.getProxy().setExtraParam('over_zero_all_column', 'Y');
        this.store.getProxy().setExtraParam('not_sg_code_list', 'CS');

        this.store.load(function (records) {

        });

    },

    addTabworkOrderGridPanel: function (title, menuCode, arg, fc, id) {

        gMain.extFieldColumnStore.load({
            params: {menuCode: menuCode},
            callback: function (records, operation, success) {
                console_logs('records>>>>>>>>>>', records);
                if (success === true) {
                    this.callBackWorkList(title, records, arg, fc, id);
                } else {//endof if(success..
                    Ext.MessageBox.show({
                        title: '연결 종료',
                        msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
                        buttons: Ext.MessageBox.OK,
                        //animateTarget: btn,
                        scope: this,
                        icon: Ext.MessageBox['ERROR'],
                        fn: function () {

                        }
                    });
                }
            },
            scope: this
        });

    },
    callBackWorkList: function (title, records, arg, fc, id) {
        let dockedItems = arg['dockedItems'];

        let cellEditing = new Ext.grid.plugin.CellEditing({clicksToEdit: 1});

        gm.me().workListStore = Ext.create('Rfx2.store.company.bioprotech.GroupInoutHistoryStore');

        gm.me().workListStore.getProxy().setExtraParam('rtgastuid', gm.me().vSELECTED_RTGAST_UID);
        gm.me().workListStore.getProxy().setExtraParam('group_by', 'category,inout_route,inout_date,po_no');

        let forcefitSide = true;

        let gridId = id == null ? this.getGridId() : id;

        let o = gMain.parseGridRecord(records, gridId);
        let columns = o['columns'];

        this.workOrderGrid = Ext.create('Ext.grid.Panel', {
            store: this.workListStore,
            title: title,
            cls: 'rfx-panel',
            border: true,
            resizable: true,
            scroll: true,
            multiSelect: true,
            collapsible: false,
            layout: 'fit',
            viewConfig: {
                markDirty: false
            },
            forceFit: forcefitSide,
            dockedItems: dockedItems,
            plugins: [cellEditing],
            listeners: {
                itemcontextmenu: function (view, rec, node, index, e) {
                    e.stopEvent();
                    contextMenu.showAt(e.getXY());
                    return false;
                },
                itemdblclick: function (view, record) {
                    gm.me().downListRecord(record);
                }
            },//endof listeners
            columns: columns
        });
        this.workOrderGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                fc(selections);
            }
        });

        let tabPanel = Ext.getCmp(gMain.geTabPanelId());

        tabPanel.add(this.workOrderGrid);
    },
    innoutGubunStore: Ext.create('Mplm.store.InnoutGubunStore', {}),
    StoHsdStore: Ext.create('Rfx2.store.company.bioprotech.StoHsdStore', {}),
});