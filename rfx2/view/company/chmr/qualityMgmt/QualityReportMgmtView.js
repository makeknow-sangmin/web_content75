Ext.define('Rfx2.view.company.chmr.qualityMgmt.QualityReportMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'lot-tracking-view',

    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        // 검색조건
        // this.addSearchField('item_name');
        // this.addSearchField('pcs_desc_group_assy');
        // this.addSearchField('udi_code');
        // this.addSearchField(
        //     {
        //         field_id: 'date_type'
        //         , store: "DatetypeStore"
        //         , displayField: 'validity'
        //         , valueField: 'validity'
        //         , emptyText: '유효기간'
        //         , innerTpl: '<div data-qtip="{validity}">{validity}</div>'
        //     });
        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE']
        });


        //모델을 통한 스토어 생성
        this.createStoreSimple({
            modelClass: 'Rfx2.model.company.chmr.InspectReport',
            pageSize: 100,
            sorters: [{
                property: 'cartmap.unique_id',
                direction: 'DESC'
            }],
            byReplacer: {
                'state_name': 'rtgast.state',
            }
        }, {});

        var arr = [];
        arr.push(buttonToolbar);
        // arr.push(searchToolbar);

        //grid 생성.
        this.createGrid(arr);
        this.createCrudTab();

        // 성적서 결과 입력
        this.inspectBaseInfoStore = Ext.create('Rfx2.store.company.chmr.InspectReportInfo', { pageSize: 100 });
        this.inspectionHeaderInfoGrid = Ext.create('Ext.grid.Panel', {
            store: this.inspectBaseInfoStore,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            border: true,
            region: 'center',
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '5 0 0 0',
            columns: [
                {text: '입력항목', width: 150, style: 'text-align:center', align: 'left', dataIndex: 'property_name'},
                {text: '값', width: 150, style: 'text-align:center', align: 'left', dataIndex: 'val'}
                
            ],
            name: 'capa',
            autoScroll: true,
            listeners: {

            }
        });

        this.inspectDetailInfoStore = Ext.create('Rfx2.store.company.chmr.InspectReportInfo', { pageSize: 100 });
        this.inspectionInfoGrid = Ext.create('Ext.grid.Panel', {
            store: this.inspectDetailInfoStore,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            border: true,
            region: 'center',
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '5 0 0 0',
            columns: [
                {text: '검사항목', width: 250, style: 'text-align:center', align: 'left', dataIndex: 'property_name'},
                {text: '기준치', width: 150, style: 'text-align:center', align: 'left', dataIndex: 'based_value'},
                {text: '측정치', width: 100, align: 'right', style: 'text-align:center', dataIndex: 'val'},
                {
                    text: '판정',
                    width: 100,
                    align: 'center',
                    style: 'text-align:center',
                    dataIndex: 'determine_result_kr',
                    renderer: function (value, meta) {
                        if (value == '합격') {
                                meta.style = "background-color:#3f51b5;color:white;text-align:center;";
                        } else if (value == '불합격') {
                            meta.style = "background-color:#ef5350;color:white;text-align:center;";
                        } else {
                            meta.style = "background-color:transparent;color:black;text-align:center;";
                        }
                        // value = Ext.util.Format.number(value, '0,000');
                        return value;
                    }},
            ],
            name: 'capa',
            autoScroll: true,
            listeners: {

            }
        });



        this.form = Ext.create('Ext.form.Panel', {
            title: '상세정보',
            cls: 'rfx-panel',
            autoHeight: true,
            frame: true,
            border: true,
            region: 'center',
            layout: 'fit',
            forceFit: false,
            margin: '5 0 0 0',
            items: {
                xtype: 'tabpanel',
                border: false,
                fullscreen: true,
                items: [
                    {
                        title: '기본정보',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        flex: 0,
                        items: [this.inspectionHeaderInfoGrid]
                    },
                    {
                        title: '성적서 결과',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        flex: 0,
                        items: [this.inspectionInfoGrid]
                    },
                ]
            }
        });

        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    collapsible: false,
                    frame: false,
                    region: 'west',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    width: '50%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        items: [this.grid]
                    }]
                }, this.form
            ]
        });
        this.callParent(arguments);

        //디폴트 로드
        gm.setCenterLoading(false);

        this.storeLoad();

        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                var rec = selections[0];
                gm.me().inspectionHeaderInfoGrid.getStore().getProxy().setExtraParam('value_key', 'TOP');
                gm.me().inspectionHeaderInfoGrid.getStore().getProxy().setExtraParam('target_uid', rec.get('unique_id_long'));
                gm.me().inspectionHeaderInfoGrid.getStore().load(function (record) {
                });

                gm.me().inspectionInfoGrid.getStore().getProxy().setExtraParam('value_key', 'BOTTOM');
                gm.me().inspectionInfoGrid.getStore().getProxy().setExtraParam('target_uid', rec.get('unique_id_long'));
                gm.me().inspectionInfoGrid.getStore().load(function (record) {
                });
            } else {
            }
        });
    }
});
