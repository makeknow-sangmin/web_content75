Ext.define('Rfx2.view.gongbang.stockMgmt.StockInoutDetailView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'stock-inoout-detail-view',
    initComponent: function () {

        //this.initDefValue();

        //생성시 디폴트 값.
        this.setDefValue('board_email', /*GLOBAL*/vCUR_EMAIL);
        this.setDefValue('user_id', /*GLOBAL*/vCUR_USER_ID);
        this.setDefValue('board_name', /*GLOBAL*/vCUR_USER_NAME);
        this.setDefValue('board_count', 0); //Hidden Value임.

        //검색툴바 필드 초기화
        this.initSearchField();

        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth();

        //검색툴바 추가
        this.addSearchField({
            type: 'dateRange',
            field_id: 'range_date',
            text: "수불일자",
            sdate: new Date(year, month, 1),
            edate: new Date()
        });
        this.addSearchField(
            {
                field_id: 'standard_flag'
                , store: 'StandardFlagStore'
                , displayField: 'code_name_kr'
                , valueField: 'system_code'
                , innerTpl: '[{system_code}]{code_name_kr}'
            }
        )
        this.addSearchField('item_name');
        this.addSearchField('item_code');
        this.addSearchField('specification');
        // this.setEditPanelTitle('상세보기');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: [
                'REGIST', 'COPY', 'REMOVE' , 'EDIT'
            ],
        });

        this.createStore('Rfx2.model.company.gongbang.InnOutDetail', [{
                property: 'item_code',
                direction: 'ASC'
            }],
            gMain.pageSize/*pageSize*/
            //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
            , {
                item_code_dash: 's.item_code',
                comment: 's.comment1'
            },
            ['srcahd']
        );

        //grid 생성.
        this.createGrid(searchToolbar, buttonToolbar, null
            , [
                {
                    locked: false,
                    arr: [0, 1, 2, 3, 4,5,6]
                },
                {
                    text: gm.getMC('CMD_Wearing', '입고'),
                    locked: false,
                    arr: [7, 8]
                },
                {
                    text: gm.getMC('CMD_Release', '출고'),
                    locked: false,
                    arr: [9, 10]
                },
                {
                    locked: false,
                    arr: [11]
                }
            ]);

        //입력/상세 창 생성.
        this.createCrudTab();

        // this.editAction.setText('상세보기');

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.setGridOnCallback(function (selections) {
            this.workOrderGrid.getStore().getProxy().setExtraParam('uid_srcahd', selections[0].get('unique_id_long'));

            var exParams = gm.me().store.getProxy().extraParams;

            this.workOrderGrid.getStore().getProxy().setExtraParam('range_date', exParams['range_date']);
            this.workOrderGrid.getStore().getProxy().setExtraParam('whouse_uid', exParams['whouse_uid']);
            this.workOrderGrid.getStore().getProxy().setExtraParam('whouse_uid_def', exParams['whouse_uid_def']);
            this.workOrderGrid.getStore().getProxy().setExtraParam('item_code', selections[0].get('item_code'));
            this.workOrderGrid.getStore().load();
        });

        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);

        var yyyymmdd = gUtil.yyyymmdd(new Date(year, month, 1)) + ':' + gUtil.yyyymmdd(new Date());
        this.store.getProxy().setExtraParam('whouse_uid_def', 102);
        this.store.getProxy().setExtraParam('range_date', yyyymmdd);
        this.store.load(function (records) {
        });

    },

    addTabworkOrderGridPanel: function (title, menuCode, arg, fc, id) {

        gMain.extFieldColumnStore.load({
            params: {menuCode: menuCode},
            callback: function (records, operation, success) {
                console_logs('records>>>>>>>>>>', records);
                if (success == true) {
                    this.callBackWorkList(title, records, arg, fc, id);
                } else {//endof if(success..
                    Ext.MessageBox.show({
                        title: '연결 종료',
                        msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
                        buttons: Ext.MessageBox.OK,
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
        var gridId = id == null ? this.getGridId() : id;

        var o = gMain.parseGridRecord(records, gridId);
        var fields = o['fields'], columns = o['columns'], tooltips = o['tooltips'];

        var modelClass = arg['model'];
        var pageSize = arg['pageSize'];
        var sorters = arg['sorters'];
        var dockedItems = arg['dockedItems'];

        var cellEditing = new Ext.grid.plugin.CellEditing({clicksToEdit: 1});

        gMain.selPanel.workListStore = Ext.create('Rfx2.store.company.kbtech.InnoutHistoryStore');

        gMain.selPanel.workListStore.getProxy().setExtraParam('rtgastuid', gMain.selPanel.vSELECTED_RTGAST_UID);

        var forcefitSide = true;

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
            forceFit: forcefitSide,
            dockedItems: dockedItems,
            plugins: [cellEditing],
            listeners: {
                itemcontextmenu: function (view, rec, node, index, e) {
                    e.stopEvent();
                    contextMenu.showAt(e.getXY());
                    return false;
                },
                select: function (selModel, record, index, options) {

                },
                itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {

                    gMain.selPanel.downListRecord(record);
                }, //endof itemdblclick
                cellkeydown: function (workOrderGrid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    console_logs('++++++++++++++++++++ e.getKey()', e.getKey());

                    if (e.getKey() == Ext.EventObject.ENTER) {

                    }


                }
            },//endof listeners
            columns: columns
        });
        this.workOrderGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                fc(selections);
            }
        });
        var view = this.workOrderGrid.getView();

        var tabPanel = Ext.getCmp(gMain.geTabPanelId());

        tabPanel.add(this.workOrderGrid);
    },

    itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
        var rec = selections[0];
        console_logs('dbclick!!!');
    }
});