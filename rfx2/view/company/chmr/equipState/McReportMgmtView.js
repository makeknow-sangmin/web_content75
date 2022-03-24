Ext.define('Rfx2.view.company.chmr.equipState.McReportMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype : 'recv-po-ver-view',

    initComponent   : function () {
        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;
        useMultitoolbar = false;
        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.addSearchField({
            type    : 'dateRange',
            field_id: 'recv_date',
            text    : '점검일자',
            sdate   : Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate   : new Date()
        });
        this.addSearchField('mchn_code');
        this.addSearchField('name_ko');

        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');

        //명령툴바 생성
        let buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE', 'EXCEL']
        });


        this.createStore('Rfx.model.McReport', [{
                property : 'unique_id',
                direction: 'DESC'
            }],
            gm.pageSize
            , {
                creator  : 'a.creator',
                unique_id: 'a.unique_id'
            }
            , ['rtgast']
        );
        let arr = [];
        arr.push(buttonToolbar);

        //검색툴바 생성
        let searchToolbar = this.createSearchToolbar();
        arr.push(searchToolbar);

        this.poPrdDetailStore = Ext.create('Rfx2.store.company.chmr.MachineCheckResultStore', {});

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
                            html : '좌측 점검서를 선택하여 확인하십시오.',
                            width: 700,
                            style: 'color:white;font-weight:normal;text-align:left;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;'
                        }
                    ]
                },
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
                {
                    text     : '점검결과',
                    width    : 100,
                    style    : 'text-align:center',
                    dataIndex: 'result_kr',
                    sortable : false,
                    editor   : {
                        xtype         : 'combobox',
                        displayField  : 'codeName',
                        editable      : false,
                        forceSelection: true,
                        mode: 'local',
                        store: this.mcCheckResultStore,
                        triggerAction: 'all',
                        valueField   : 'systemCode'
                    },
                },

            ],
            title      : '설비점검결과',
            name       : 'po',
            autoScroll : true,
            listeners  : {
                edit: function (editor, e, eOpts) {
                    var columnName = e.field;
                    var tableName = 'checkresult';
                    var unique_id = e.record.get('unique_id_long');
                    if (columnName === 'result_kr') {
                        columnName = 'result';
                    }
                    var value = e.value;
                    gm.editAjax(tableName, columnName, value, 'unique_id', unique_id, {type: ''});
                    gm.me().poPrdDetailStore.load();
                }

            }
        });

        this.gridContractCompany.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                console_logs('>>>>>>> rec', selections);
                if (selections.length) {
                    // gm.me().deleteCheckList.enable();
                    // gm.me().checkEditAction.enable();


                } else {
                    // gm.me().deleteCheckList.disable();
                    // gm.me().checkEditAction.disable();
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
                let week_number = rec.get('week_num');
                gu.getCmp('selectedMtrl').setHtml(name_ko + ' [' + week_number + ']');
                this.poPrdDetailStore.getProxy().setExtraParam('rtgast_uid', rec.get('unique_id_long'));
                this.poPrdDetailStore.getProxy().setExtraParam('orderBy', 'pcscheck.sort_order');
                this.poPrdDetailStore.getProxy().setExtraParam('limit', '100');
                this.poPrdDetailStore.load();
            } else {

            }
        })

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function (records) {
        });
    },
    mcCheckResultStore : Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'MC_RESULT'}),
});



