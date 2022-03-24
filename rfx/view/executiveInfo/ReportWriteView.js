Ext.define('Rfx.view.executiveInfo.ReportWriteView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'report-write-view',
    initComponent: function() {

        Ext.layout.FormLayout.prototype.trackLabels = true;

        //모델을 통한 스토어 생성
        this.createStore('Rfx.model.ReportWrite', [{
                property: 'user_name',
                direction: 'ASC'
            }],
            gm.pageSize
            ,{}
            , []
        );

        this.addSearchField ({
            type: 'dateRange',
            field_id: 'v000',
            text: '출하일자',
            labelWidth: 50,
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
        });

        this.addSearchField('v001');
        this.addSearchField('v003');
        this.addSearchField('output_lot');

        this.docuTplStore = Ext.create('Mplm.store.DocuTplStore', {});
        this.docEntityReportStore = Ext.create('Mplm.store.DocEntityReportStore', {});
        this.bufferDataStore = Ext.create('Mplm.store.PopIfReportStore', {});
        //this.docDataStore = Ext.create('Mplm.store.DocDataStore', {});
        this.docDataArrayStore = Ext.create('Mplm.store.DocDataArrayStore', {});
        this.storeTemplate = Ext.create('Mplm.store.RpFileInfoReportStore', {});
        this.ingredientStore = Ext.create('Mplm.store.IngredientStore', {});

        this.gridViewTable = Ext.create('Ext.grid.Panel', {
            store: this.docuTplStore,
            cls : 'rfx-panel',
            multiSelect: false,
            autoScroll : true,
            autoHeight: true,
            border: true,
            padding: '0 0 0 0',
            flex: 1,
            layout          :'fit',
            forceFit: true,
            dockedItems : [
                        
                Ext.create('widget.toolbar', {
                    plugins: {
                        boxreorderer: true
                    },
                    cls: 'my-x-toolbar-default',
                    margin: '0 0 0 0',
                    items: [{
                                width: '100%',
                                xtype: 'textfield',
                                id: gu.id('template_srch'),
                                name: 'template_srch',
                                enableKeyEvents: true,
                                emptyText: '템플릿',
                                readOnly: true,
                                fieldStyle: 'background-color: #EEEEEE; background-image: none;',
                                flex: 1,
                                listeners: {
                                    // specialkey: function(f,e) {
                                    //     if (e.getKey() == Ext.EventObject.ENTER) {
                                    //         gm.me().storeViewTable.getProxy().setExtraParam(f.name, f.value);
                                    //         gm.me().storeViewTable.load();
                                    //     }
                                    // },
                                    change: function(f) {
                                        if(f.value.length > 0) {
                                            gm.me().docuTplStore.getProxy().setExtraParam('temp_name', f.value);
                                            gm.me().docuTplStore.load();
                                        }
                                    }
                                },
                                trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                'onTrigger1Click': function() {
                                    Ext.getCmp(this.id).setValue('');
                                    gm.me().storeViewTable.getProxy().setExtraParam('temp_name', null);
                                    gm.me().storeViewTable.load();
                                }
                            }
                            /*,
                         {
                         iconCls: null,
                         iconCls: 'af-search',
                         listeners : [{
                         click: function() {
                         }
                         }]
                         }*/
                        ]
                    })
                ],


            columns: [{
                text: '검색된 템플릿',
                flex: 1,
                dataIndex: 'temp_name'
            }]
        });

        this.gridTemplate = Ext.create('Ext.grid.Panel', {
            store: this.storeTemplate,
            cls : 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll : true,
            autoHeight: true,
            bbar: getPageToolbar(this.storeTemplate),
            frame: false,
            border: true,
            layout          :'fit',
            forceFit: true,
            margin: '10 0 0 0',
            columns: [
                {
                    text: '템플릿(자재)명',
                    dataIndex: 'fname'
                },
                {
                    text: '작성일시',
                    dataIndex: 'create_date'
                },
                {
                    text: '작성자',
                    dataIndex: 'creator'
                }
            ],
            title: '성적서 출력',
            autoScroll: true,
            dockedItems : [
                Ext.create('widget.toolbar', {
                    plugins: {
                        boxreorderer: false
                    },
                    cls: 'my-x-toolbar-default2',
                    margin: '0 0 0 0',
                    items: [
                        {
                            id: gu.id('select_title'),
                            xtype: 'tbtext',
                            text: ''
                        },
                        '->',
                        {
                            iconCls: null,
                            glyph: 'f0c7@FontAwesome',
                            text:'다운로드',
                            listeners : [{
                                click: function() {

                                    var reportSelection = gm.me().gridTemplate.getSelectionModel().getSelection();

                                    if(reportSelection.length > 0) {

                                        var sel = reportSelection[0];
                                        var docuSplit = sel.get('fname').split('-');
                                        var value_key = docuSplit[docuSplit.length - 1];

                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/xdview/examTest.do?method=printExamTest',
                                            params:{
                                                target_uid : sel.getId(),
                                                group_uid : sel.get('parent'),
                                                value_key : value_key
                                            },
                                            success : function(result, request) {
                                                var jsonData = Ext.JSON.decode(result.responseText);
                                                var excelPath = jsonData.excelPath;
                                                var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
                                                top.location.href = url;
                                            },//Ajax success
                                            failure: function(result, request) {
                                                Ext.Msg.alert('오류', '성적서를 찾을 수 없습니다.');
                                            }
                                        });
                                    } else {
                                        Ext.Msg.alert('경고', '성적서를 선택하세요.');
                                    }
                                }
                            }]
                        }
                    ]
                })
            ]
        });

        var form = Ext.create('Ext.form.Panel', {
                id: gu.id('form'),
                bodyPadding: 10,
                autoScroll: false,
                //hidden: true,
                flex: 1,
                fieldDefaults: {
                    labelAlign: 'right',
                    labelWidth: 100,
                },
                enableDragDrop: true,
                viewConfig: {
                    plugins: {
                        gridviewdragdrop: {
                            ddGroup: 'form-to-grid',
                            enableDrop: false
                        }
                    }
                },
                items: [
                    {
                        xtype: 'fieldset',
                        style: 'background-color: #F6F6F6; background-image: none;',
                        defaults: {
                            componentCls: "",
                            width: '100%',
                        },
                        layout: {
                            type: 'table',
                            columns: 2,
                            tableAttrs: {
                                style: {
                                    width: '100%'
                                }
                            }
                        },
                        items: [
                            {
                                id: gu.id('temp_name'),
                                name:'temp_name',
                                xtype: 'textfield',
                                width: '100%',
                                readOnly: true,
                                fieldStyle: 'background-color: #F0F0F0; background-image: none;',
                                fieldLabel: '품목',
                                value: ''
                            },
                            {
                                xtype: 'datefield',
                                id: gu.id('create_date'),
                                name:'create_date',
                                fieldLabel: '작성일자',
                                width: '100%',
                                value: new Date()
                            }
                        ]
                    },
                    {
                        xtype: 'fieldset',
                        title: 'CELL 속성',
                        id: gu.id('cellProperty'),
                        style: 'background-color: #F6F6F6; background-image: none;',
                        defaults: {
                            componentCls: "",
                            width: '100%',
                        },
                        layout: {
                            type: 'table',
                            columns: 2,
                            tableAttrs: {
                                style: {
                                    width: '100%'
                                }
                            }
                        },
                        items: []
                    },
                    {
                        xtype: 'fieldset',
                        defaultType: 'textfield',
                        title: 'Sampling 속성',
                        style: 'background-color: #F6F6F6; background-image: none;',
                        layout: {
                            type: 'table',
                            columns: 7,
                            tableAttrs: {
                                style: {
                                    width: '100%'
                                }
                            }
                        },
                        defaults: {
                            componentCls: "",
                            width: '100%'
                        },
                        items: [
                            {id: gu.id('a01'), xtype: 'tbtext', text: '.' , listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a01-val1'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a01-val2'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a01-val3'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a01-val4'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a01-val5'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a01-val6'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a01-val7'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a01-val8'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a01-val9'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a01-val10'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a01-val11'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a01-val12'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a01-val13'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}

                            ,{id: gu.id('a02'), xtype: 'tbtext', text: '.' , listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a02-val1'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a02-val2'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a02-val3'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a02-val4'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a02-val5'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a02-val6'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a02-val7'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a02-val8'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a02-val9'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a02-val10'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a02-val11'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a02-val12'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a02-val13'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}

                            ,{id: gu.id('a03'), xtype: 'tbtext', text: '.' , listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a03-val1'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a03-val2'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a03-val3'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a03-val4'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a03-val5'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a03-val6'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a03-val7'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a03-val8'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a03-val9'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a03-val10'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a03-val11'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a03-val12'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a03-val13'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}

                            ,{id: gu.id('a04'), xtype: 'tbtext', text: '.' , listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a04-val1'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a04-val2'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a04-val3'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a04-val4'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a04-val5'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a04-val6'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a04-val7'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a04-val8'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a04-val9'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a04-val10'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a04-val11'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a04-val12'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a04-val13'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}

                            ,{id: gu.id('a05'), xtype: 'tbtext', text: '.' , listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a05-val1'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a05-val2'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a05-val3'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a05-val4'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a05-val5'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a05-val6'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a05-val7'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a05-val8'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a05-val9'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a05-val10'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a05-val11'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a05-val12'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a05-val13'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}

                            ,{id: gu.id('a06'), xtype: 'tbtext', text: '.' , listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a06-val1'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a06-val2'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a06-val3'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a06-val4'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a06-val5'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a06-val6'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a06-val7'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a06-val8'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a06-val9'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a06-val10'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a06-val11'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a06-val12'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                            ,{ id: gu.id('a06-val13'), style : 'text-align:center', hideLabel: true, listeners: { 'render': function() { this.hide() } }}
                        ]
                    }


                ]

            });

        var itemApply = {
            frame: false,
            id: gu.id('gridContent'),
            title: '성적서 작성',
            region: 'east',
            tbar: {
                items: [
                    {
                        id: gu.id('output_lot'),
                        name:'output_lot',
                        xtype: 'textfield',
                        labelWidth: 50,
                        width: '25%',
                        readOnly: true,
                        fieldStyle: 'background-color: #F0F0F0; background-image: none;',
                        fieldLabel: '출하LOT',
                        value: ''
                    },
                    '->',
                    {
                        xtype:'button',
                        glyph: 'f019@FontAwesome',
                        text: '성분불러오기',
                        handler: function() {
                            gm.me().prwinopen();
                        }
                    }
                    ,{
                        iconCls: null,
                        glyph: 'f0c5@FontAwesome',
                        text:'Sampling 생성',
                        listeners : [{
                            click: function() {
                                var item_code = gm.me().temp_name;
                                if(item_code=='') {
                                    Ext.Msg.alert('경고', '품목을 먼저 선택하세요.');
                                    return;
                                } else {
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/xdview/xdmMeasure.do?method=makeSamplingData',
                                        params: {
                                            item_code: item_code,
                                            out_lot: gm.me().grid.getSelectionModel().getSelection()[0].get('output_Lot')
                                        },
                                        scope : this,
                                        success : function(result, request){
                                            var json = Ext.util.JSON.decode(result.responseText);
                                            console_logs('json', json);
                                            Ext.Msg.alert(json.result==true ? '성공' : '실패', json.reason[0]);

                                        }
                                    });
                                }


                            }
                        }]
                    },
                    {
                        iconCls: null,
                        glyph: 'f0c5@FontAwesome',
                        text: '불러오기',
                        handler: function() {
                            gm.me().bufferDataStore.load(function (record) {

                            gm.me().bufferData = record[0];
                            //측정데이터

                                gm.me().doc_data = gm.me().selected_ingredient;

                                var selections = gm.me().gridViewTable.getSelectionModel().getSelection();
                                var rec = (selections != null && selections.length > 0) ? selections[0] : null;

                                var temp_name = rec.get('temp_name');
                                var f1 = gu.getCmp('temp_name');
                                f1.setValue(temp_name);

                                gm.me().docEntityReportStore.getProxy().setExtraParam('group_uid', rec.get('unique_id_long'));
                                gm.me().docEntityReportStore.load(function (record) {

                                    var cell_count = 1;
                                    var array_count = 1;

                                    for (var j = 0; j < record.length; j++) {
                                        var rec = record[j];
                                        var position = rec.get('position');
                                        var colspan = rec.get('colspan');
                                        var rowspan = rec.get('rowspan');

                                        if(position.length > 0) {
                                            if (colspan == 1 && rowspan == 1) {
                                                //if (cell_count < 13) {

                                                    if (cell_count < 10) {
                                                        var labelValue = gu.getCmp('v0' + cell_count);
                                                    } else {
                                                        var labelValue = gu.getCmp('v' + cell_count);
                                                    }

                                                    if (rec.get('buffer_pos').length > 0) {
                                                        //출하 LOT
                                                        if(rec.get('buffer_pos') == 'v005') {
                                                            labelValue.setValue(gm.me().grid.getSelectionModel().getSelection()[0].get('output_Lot'));
                                                        } else {
                                                            labelValue.setValue(gm.me().bufferData.get(rec.get('buffer_pos')));
                                                        }

                                                    } else {

                                                        var keys = Ext.Object.getKeys(gm.me().doc_data.data);

                                                        var item_name = gm.me().grid.getSelectionModel().getSelection()[0].get('v003');

                                                        switch(item_name.substring(0, 2)) {
                                                            case '1S':
                                                                for(var k = 0; k < keys.length; k++) {
                                                                    if(rec.get('title').toUpperCase() == keys[k].toUpperCase()) {
                                                                        var val = gm.me().doc_data.get(keys[k]).split(';');
                                                                        if(val.length > 1) {
                                                                            labelValue.setValue(val[1]);
                                                                        } else {
                                                                            labelValue.setValue(gm.me().doc_data.get(keys[k]));
                                                                        }
                                                                        break;
                                                                    }
                                                                }
                                                                break;
                                                            default:
                                                                for(var k = 0; k < keys.length; k++) {
                                                                    if(rec.get('title') == keys[k]) {
                                                                        labelValue.setValue(gm.me().doc_data.get(keys[k]));
                                                                        break;
                                                                    }
                                                                }
                                                                break;
                                                        }
                                                    }

                                                    cell_count++;
                                                //}
                                            } else if (colspan > 1 || rowspan > 1) {
                                                array_count++;
                                            }
                                        }
                                    }
                                    // 배열 데이터
                                    gm.me().docDataArrayStore.getProxy().setExtraParam('value_key', gm.me().grid.getSelectionModel().getSelection()[0].get('output_Lot'));
                                    gm.me().docDataArrayStore.getProxy().setExtraParam('group_uid', -1);
                                    gm.me().docDataArrayStore.load(function (record) {

                                        for(var i = 1; i <= 6; i++) {

                                            var labelValue = gu.getCmp('a0' + i);

                                            if(labelValue.html != undefined && labelValue.html.length > 1) {

                                                for(var j = 1; j <= 13; j++) {

                                                    var textValue = gu.getCmp('a0' + i + '-val' + j);

                                                    for(var k = 0; k < record.length; k++) {
                                                        var rec = record[k];
                                                        if(rec.get('target_uid') == labelValue.viewprop_uid && rec.get('pos') == (j-1)) {
                                                            textValue.setValue(rec.get('val'));
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    });
                                });
                            });
                        }
                    },
                    {
                        iconCls: null,
                        glyph: 'f0c7@FontAwesome',
                        text: '저장',
                        handler: function() {

                            var msg = '저장 하시겠습니까?';
                            var myTitle = '';
                            Ext.MessageBox.show({
                                title: myTitle,
                                msg: msg,
                                buttons: Ext.MessageBox.YESNO,
                                icon: Ext.MessageBox.QUESTION,
                                fn: function (btn) {
                                    if (btn == "no") {
                                        MessageBox.close();
                                    } else {
                                        var docu_entity_uids = [];
                                        var values = [];
                                        var poses = [];
                                        var cellLength = gu.getCmp('cellProperty').items.items.length;

                                        for (var i = 1; i <= cellLength; i++) {

                                            if (i < 10) {
                                                var labelValue = gu.getCmp('v0' + i);
                                            } else {
                                                var labelValue = gu.getCmp('v' + i);
                                            }


                                            if(labelValue.name != null && labelValue.name > 0) {
                                                docu_entity_uids.push(labelValue.name);
                                                values.push(labelValue.getValue());
                                                poses.push(0);
                                            }
                                        }

                                        for (var i = 1; i <= 6; i++) {
                                            var labelValue = gu.getCmp('a0' + i);
                                            if(labelValue.html != null && labelValue.html.length > 1) {
                                                for(var j = 1; j <= 13; j++) {
                                                    var value = gu.getCmp('a0' + i + '-val' + j);
                                                    docu_entity_uids.push(labelValue.name);
                                                    values.push(value.getValue());
                                                    poses.push(j-1);
                                                }
                                            }
                                        }

                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/xdview/examTest.do?method=insertReportValues',
                                            params:{
                                                docu_entity_uids: docu_entity_uids,
                                                values: values,
                                                docutpl_uid: gm.me().docutpl_uid,
                                                temp_name: gm.me().temp_name,
                                                output_lot: gu.getCmp('output_lot').getValue(),
                                                poses: poses
                                            },
                                            success : function(result, request) {
                                                gm.me().storeTemplate.getProxy().setExtraParam('parent', gm.me().docutpl_uid);
                                                gm.me().storeTemplate.load();
                                                Ext.Msg.alert('결과', '저장 되었습니다.');
                                            },
                                            failure: extjsUtil.failureMessage
                                        });
                                    }
                                }//fn function(btn)
                            });
                        }
                    }]
            },
            layout: {
                type: 'card'
            },
            margin: '0 0 0 0',
            flex: 1,
            items: [form],
            activeItem: 0
        };

    	var tabView = Ext.create('Ext.tab.Panel', {
            region: 'center',
            collapsible: false,
            border: true,
            // title: '성적서 작성',
            width: '65%',
            margin: '5 0 0 0',
            items: [
                itemApply,
                this.gridTemplate
            ]
            ,
	            listeners: {
	                tabchange: function(tabPanel, newTab, oldTab, eOpts)  {
	                        gm.me().tabchangeHandlerDoc(tabPanel, newTab, oldTab, eOpts);
	                }
	            }
        });

        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: [
                'REGIST', 'COPY', 'REMOVE', 'EDIT', 'VIEW'
            ],
            RENAME_BUTTONS: []
        });

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        this.createGrid(arr);

        this.storeLoad();

        Ext.apply(this, {
            layout: 'border',
            //bodyBorder: true,
            defaults: {
                collapsible: true,
                split: true
            },
            items: [
                {
                    //title: '제품 및 템플릿 선택',
                    collapsible: false,
                    frame: false,
                    region: 'west',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    width: '52%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '75%',
                        items: [this.grid]
                    }, this.gridViewTable]
                },
                tabView

            ]
        });

        this.grid.forceFit = true;

        this.grid.getSelectionModel().on({

            selectionchange: function(sm, selections) {

                var rec = (selections != null && selections.length > 0) ? selections[0] : null;

                if(rec != null) {
                    console_logs('rec', rec);
                    // var o = gu.getCmp('template_srch');
                    // o.setValue(rec.get('v003'));

                    // 이 부분은 나중에 DIMENSION에서 갖고 오면 됨
                    gm.me().bufferDataStore.getProxy().setExtraParam('key1', 'OrderNo');
                    gm.me().bufferDataStore.getProxy().setExtraParam('key2', 'Output_Lot');
                    gm.me().bufferDataStore.getProxy().setExtraParam('key3', 'LotNo');
                    gm.me().bufferDataStore.getProxy().setExtraParam('key4', 'PK');
                    gm.me().bufferDataStore.getProxy().setExtraParam('key5', 'SPOOL');

                    gm.me().bufferDataStore.getProxy().setExtraParam('value1', rec.get('v001'));
                    gm.me().bufferDataStore.getProxy().setExtraParam('value2', rec.get('v005'));
                    gm.me().bufferDataStore.getProxy().setExtraParam('value3', rec.get('v013'));
                    gm.me().bufferDataStore.getProxy().setExtraParam('value4', rec.get('v003'));
                    gm.me().bufferDataStore.getProxy().setExtraParam('value5', rec.get('v004'));

                    var temp_name = rec.get('v003');

                    gm.me().output_lot = rec.get('output_Lot');
                    gm.me().manu_lot = rec.get('v013');

                    switch(temp_name.substring(0, 2)) {
                        case '1S':
                            gu.getCmp('template_srch').setReadOnly(true);
                            gu.getCmp('output_lot').setReadOnly(false);
                            gu.getCmp('output_lot').setFieldStyle('background-color: #FFFFFF; background-image: none;');
                            gu.getCmp('template_srch').setFieldStyle('background-color: #F0F0F0; background-image: none;');
                            gm.me().docuTplStore.getProxy().setExtraParam('temp_type', 'SB');
                            gm.me().docuTplStore.load();
                            break;
                        default:
                            gu.getCmp('template_srch').setReadOnly(false);
                            gu.getCmp('output_lot').setReadOnly(true);
                            gu.getCmp('template_srch').setValue(temp_name);
                            gu.getCmp('output_lot').setFieldStyle('background-color: #F0F0F0; background-image: none;');
                            gu.getCmp('template_srch').setFieldStyle('background-color: #D6E8F6; background-image: none;');
                            break;
                    }
                }
            }
        });

        this.gridViewTable.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                var selections = gm.me().gridViewTable.getSelectionModel().getSelection();
                var rec = (selections != null && selections.length > 0) ? selections[0] : null;

                if(rec != null) {

                    var gridSelection = gm.me().grid.getSelectionModel().getSelection()[0];

                    gm.me().docutpl_uid = selections[0].getId();
                    gm.me().temp_name = selections[0].get('temp_name');

                    gu.getCmp('output_lot').setValue(gm.me().output_lot);
                    
                    //제조 LOT에 따른 성분 스토어 LOAD

                    if(isNaN(gm.me().output_lot)) {
                        gm.me().ingredientStore.getProxy().setExtraParam('output_lot', gm.me().output_lot);
                    }
                    gm.me().ingredientStore.getProxy().setExtraParam('v001', 'lotNo');
                    //gm.me().ingredientStore.getProxy().setExtraParam('type', 'IN');
                    gm.me().ingredientStore.load(function(record) {
                        if(record.length > 0) {
                            gm.me().selected_ingredient = record[0];
                        }
                    });

                    //템플릿 스토어 LOAD
                    gm.me().storeTemplate.getProxy().setExtraParam('parent', gm.me().docutpl_uid);
                    gm.me().storeTemplate.load();

                    var temp_name = rec.get('temp_name');
                    var f1 = gu.getCmp('temp_name');
                    f1.setValue(temp_name);

                    gm.me().docEntityReportStore.getProxy().setExtraParam('group_uid', rec.get('unique_id_long'));
                    gm.me().docEntityReportStore.load(function (record) {

                        var cell_count = 1;
                        var array_count = 1;

                        gm.me().removeCellProperty();

                        for (var j = 0; j < record.length; j++) {
                            var rec = record[j];
                            var position = rec.get('position');
                            var colspan = rec.get('colspan');
                            var rowspan = rec.get('rowspan');

                            if(position.length > 0) {
                                if (colspan == 1 && rowspan == 1) {
                                    //if (cell_count < 13) {

                                    gm.me().addCellProperty(cell_count);

                                        if (cell_count < 10) {
                                            var labelValue = gu.getCmp('v0' + cell_count);
                                        } else {
                                            var labelValue = gu.getCmp('v' + cell_count);
                                        }

                                        labelValue.setValue('');

                                        labelValue.name = rec.getId();
                                        labelValue.show();
                                        labelValue.labelEl.update(rec.get('title'));
                                        cell_count++;
                                    //}
                                } else if (colspan > 1 || rowspan > 1) {
                                    var labelValue = gu.getCmp('a0' + array_count);
                                    labelValue.name = rec.getId();
                                    labelValue.viewprop_uid = rec.get('viewprop_uid');
                                    labelValue.update(rec.get('title'));
                                    array_count++;
                                }
                            }
                        }
                        // 배열 데이터
                        gm.me().docDataArrayStore.getProxy().setExtraParam('value_key', gm.me().grid.getSelectionModel().getSelection()[0].get('output_Lot'));
                        gm.me().docDataArrayStore.getProxy().setExtraParam('group_uid', -1);
                        gm.me().docDataArrayStore.load(function (record) {

                            for(var i = 1; i <= 6; i++) {

                                var labelValue = gu.getCmp('a0' + i);

                                if(labelValue.html != undefined && labelValue.html.length > 1) {

                                    labelValue.show();

                                    for(var j = 1; j <= 13; j++) {

                                        var textValue = gu.getCmp('a0' + i + '-val' + j);
                                        textValue.show();
                                    }
                                }
                            }
                        });
                    });
                }
            }
        });

        this.callParent(arguments);
    },
    resetForm: function() {
        for (var i = 1; i < 13; i++) {

            if (i < 10) {
                var labelValue = gu.getCmp('v0' + i);
            } else {
                var labelValue = gu.getCmp('v' + i);
            }

            labelValue.setValue('');
            labelValue.name = '';
            labelValue.labelEl.update('.');
        }
        for (var i = 1; i <= 6; i++) {
            var labelValue = gu.getCmp('a0' + i);
            labelValue.update('');
        }
    },
    prwinopen: function() {

        var buttonToolbar = Ext.create('widget.toolbar', {
            cls: 'my-x-toolbar-default1',
            style:'color:white;',
            items: [
                {
                    emptyText: '제조LOT를 검색하세요',
                    xtype: 'triggerfield',
                    fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                    width: '100%',
                    enableKeyEvents: true,
                    listeners : {
                        render: function( component ) {
                            component.getEl().on('keyup', function() {
                                if(isNaN(gm.me().output_lot)) {
                                    gm.me().ingredientStore.getProxy().setExtraParam('output_lot', gm.me().output_lot);
                                }
                                gm.me().ingredientStore.getProxy().setExtraParam('v001', 'lotNo');
                                //gm.me().ingredientStore.getProxy().setExtraParam('type', 'IN');
                                gm.me().ingredientStore.getProxy().setExtraParam('manu_lot', component.rawValue);
                                gm.me().ingredientStore.load();
                            });
                        }
                    },
                    trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger'
                },
                '->'
            ]
        });

        this.testGrid = Ext.create('Ext.grid.Panel', {
            store: this.ingredientStore,
            cls : 'rfx-panel',
            dockedItems : [buttonToolbar],
            selModel : Ext.create("Ext.selection.CheckboxModel", {mode : 'SINGLE'}),
            multiSelect: false,
            autoScroll : true,
            autoHeight: true,
            border: true,
            padding: '0 0 0 0',
            flex: 1,
            layout: 'fit',
            forceFit: true,
            columns: [{
                text: '제조LOT',
                flex: 1,
                dataIndex: 'lotNo'
            },
                {
                    text: '작성시간',
                    flex: 1,
                    dataIndex: 'Date'
                }]
        });

        gm.me().ingredientGrid = this.testGrid;

        var myWin =	Ext.create('Ext.Window', {
            modal : true,
            title: '제조LOT를 통한 성분 선택',
            width: 640,
            height: 480,
            plain:true,
            items: [gm.me().ingredientGrid],
            buttons: [{
                text: CMD_OK,
                handler: function(btn){
                    var selection = gm.me().ingredientGrid.getSelectionModel().getSelection();
                    if(selection.length > 0) {
                        gm.me().selected_ingredient = gm.me().ingredientGrid.getSelectionModel().getSelection()[0];
                        if(myWin) {
                            myWin.close();
                        }
                    } else {
                        Ext.Msg.alert('오류', '성분 데이터를 하나 선택해주세요');
                    }
                }
            },{
                text: CMD_CANCEL,
                handler: function(){
                    if(myWin) {
                        myWin.close();
                    }
                }
            }]
        });
        myWin.show();
    },
    addCellProperty: function(n) {

        var cellProperty = gu.getCmp('cellProperty');
        var cellPropertyId = n < 10 ? 'v0' + n : 'v' + n;

        cellProperty.add({
            xtype: 'textfield',
            id: gu.id(cellPropertyId),
            name: cellPropertyId,
            fieldLabel: '.', listeners: { 'render': function() { this.hide() } }
        });
    },
    removeCellProperty: function() {
        var cellProperty = gu.getCmp('cellProperty');
        cellProperty.removeAll();
    },
    selected_ingredient: null,
    bufferData: null,
    docutpl_uid: 0,
    temp_name: null,
    output_lot: null,
    manu_lot: null,
    doc_data: null,
    ingredientGrid: null
});
