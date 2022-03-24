Ext.define('Rfx2.view.executiveInfo.SpcAnalysisCustomerView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'spc-analysis-customer-view',
    initComponent: function(){

        //모델을 통한 스토어 생성
        this.createStore('Rfx.model.ReportSearchSPC', [{
                property: 'create_date',
                direction: 'DESC'
            }],
            gm.pageSize
            ,{}
            , ['rpfileinfo']
        );

        this.initSearchField();

        this.addSearchField ({
            type: 'dateRange',
            field_id: 'v000',
            text: '출하기간',
            labelWidth: 50,
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
        });

        this.addSearchField (
        {
            type: 'combo',
            field_id: 'pk_type',
            store: 'PkTypeStore',
            displayField: 'name',
            valueField: 'pk_type',
            emptyText: '품목종류',
            innerTpl	: '<div data-qtip="{codeNameEn}">[{pk_type}]{name}</div>'
        });

        var authoFields = [
            {
                bodyPadding: 5,
                defaults: {
                    border: false,
                    labelWidth: 100,
                    labelAlign : 'right',
                    layout: 'anchor'
                },
                layout: {
                    type: 'hbox',
                    pack: 'start',
                },
                items: [{
                    xtype: 'radiofield',
                    name: 'radio1',
                    value: 'bw',
                    fieldLabel: '제품 구분',
                    boxLabel: 'Bonding Wire',
                    width: 230
                }, {
                    xtype: 'radiofield',
                    name: 'radio1',
                    value: 'sb',
                    fieldLabel: '',
                    labelSeparator: '',
                    hideEmptyLabel: false,
                    boxLabel: 'Solder Ball',
                    width: 230
                }
                ]
            },
            {
                bodyPadding: 5,
                defaults: {
                    border: false,
                    labelWidth: 100,
                    labelAlign : 'right',
                    layout: 'anchor'
                },
                layout: {
                    type: 'hbox',
                    pack: 'start',
                },
                items: [{
                    xtype: 'radiofield',
                    name: 'radio2',
                    value: 'size',
                    fieldLabel: '검사 유형',
                    boxLabel: 'SIZE',
                    width: 230
                }, {
                    xtype: 'radiofield',
                    name: 'radio2',
                    value: 'ingradient',
                    fieldLabel: '',
                    labelSeparator: '',
                    hideEmptyLabel: false,
                    boxLabel: '성분',
                    width: 230
                }
                ]
            },
            {
                bodyPadding: 5,
                defaults: {
                    border: false,

                    labelWidth: 100,
                    labelAlign : 'right',
                    layout: 'anchor'
                },
                layout: {
                    type: 'hbox',
                    pack: 'start',
                },

                items: [{
                    xtype: 'filefield',
                    name: 'file1',
                    width: 500,
                    fieldLabel: '파일 업로드'
                }
                ]
            }
    ];


        this.storeTemplate = Ext.create('Mplm.store.SpcChartReportStore', {});

        var storeViewTable = Ext.create('Mplm.store.SpcTemplateStore', {});

        this.store.load();
        this.storeTemplate.load();


        var selModel = Ext.create("Ext.selection.CheckboxModel", {
            mode: 'multi',
            checkOnly:  false,
            allowDeselect: true

        });

        this.gridViewTable = Ext.create('Ext.grid.Panel', {
            store: storeViewTable,
            cls : 'rfx-panel',
            multiSelect: false,
            autoScroll : true,
            autoHeight: true,
            border: true,
            padding: '0 0 0 0',
            flex: 1,
            layout          :'fit',
            forceFit: true,
            columns: [{
                text: 'SPC 템플릿 리스트',
                flex: 1,
                dataIndex: 'temp_name'
            }]
        });

        storeViewTable.load();

        this.gridViewTable.getSelectionModel().on({
            selectionchange:function(sm,selections) {
                var mainSelection = gm.me().grid.getSelectionModel().getSelection();
                if(mainSelection.length > 0) {
                    gm.me().saveAction.enable();
                } else {
                    gm.me().saveAction.disable();
                }
            }
        });

        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        var combstStore = Ext.create('Mplm.store.CombstStore', {});

        var searchTemp = {
            id: gu.id('information'),
            fieldLabel: '종전자재',
            width: 300,
            field_id: 'information',
            name: 'information',
            xtype: 'combo',
            emptyText: '업체코드',
            store: combstStore,
            displayField: 'company_name',
            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
            sortInfo: {
                field: 'company_name',
                direction: 'ASC'
            },
            minChars: 1,
            margin: '0 3 3 3',
            typeAhead: false,
            hideLabel: true,
            hideTrigger: true,
            listConfig: {
                loadingText: '검색중...',
                emptyText: '일치하는 결과가 없습니다.',
                // Custom rendering template for each item
                getInnerTpl: function () {
                    return '<div data-qtip="{company_name}">[{company_name}]{wa_name}</div>';
                }
            },
            pageSize: 10,
            listeners: {
                select: function(combo, record) {
                    gm.me().store.getProxy().setExtraParam('company_name', record.get('company_name'));
                }
            }
        };

        searchToolbar.add(5, searchTemp);

        (buttonToolbar.items).each(function(item, index){
            if(index==1||index==2||index==3||index==5) {
                buttonToolbar.items.remove(item);
            }
        });

        this.saveAction = Ext.create('Ext.Action', {
            iconCls: 'fa-save_14_0_5395c4_none',
            xtype : 'button',
            text : 'SPC 관리도 생성',
            hidden: gMain.menu_check == true ? false : true,
            disabled: true,
            handler: function() {

                gMain.setCenterLoading(true);

                var mainSelection = gm.me().grid.getSelectionModel().getSelection();
                var templateSelection = gm.me().gridViewTable.getSelectionModel().getSelection()[0];

                var mainUids = [];
                var itemNames = [];
                var temps = [];
                var isExistSorter = false;

                if(gm.me().store.sorters.getAt(0) != undefined) {
                    isExistSorter = true;
                }

                var tempUid = [];

                for(var i = 0; i < mainSelection.length; i++) {
                    tempUid.push(mainSelection[i].get('unique_id_long'));
                }

                //스토어 정렬 순서대로 재정렬
                if(mainSelection.length > 0) {
                    for(var i = 0; i < gm.me().store.getCount(); i++) {
                        var rec = gm.me().store.getAt(i);
                        var mainUidByStore = rec.get('unique_id_long');
                        if(tempUid.includes(mainUidByStore)) {
                            mainUids.push(mainUidByStore);
                            temps.push(rec.get('output_lot'));
                            itemNames.push(rec.get('temp_name'));
                        }
                    }
                }

                if(isExistSorter) {
                    mainUids.reverse();
                    itemNames.reverse();
                }

                Ext.Ajax.setTimeout(90000);

                Ext.Ajax.request({
                    url : CONTEXT_PATH + '/xdview/spcMgmt.do?method=saveSpcCtrlChart',
                    params:{
                        templateUid : templateSelection.get('unique_id_long'),
                        mainUids: mainUids,
                        itemNames: itemNames,
                        spcTemplateName : templateSelection.get('temp_name')
                    },
                    success : function(result, request) {
                        Ext.Msg.alert('저장', '관리도가 저장 되었습니다.');
                        gMain.setCenterLoading(false);
                        gm.me().storeTemplate.load();
                    },//endofsuccess
                    failure: function() {
                        Ext.Msg.alert('저장', '관리도 저장을 실패했습니다.');
                        gMain.setCenterLoading(false);
                        gm.me().storeTemplate.load();
                    }
                });//endofajax
            }
        });

        buttonToolbar.insert(2, this.saveAction);

        this.createGrid(searchToolbar, buttonToolbar);

        this.gridTemplate = Ext.create('Ext.grid.Panel', {
            store: this.storeTemplate,
            cls : 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll : true,
            autoHeight: true,
            bbar: getPageToolbar(this.storeTemplate),
            frame: false,
            border: false,
            layout          :'fit',
            forceFit: true,
            height: '100%',
            columns: [{
                text: '템플릿 이름',
                dataIndex: 'fname'
            }, {
                text: '작성날짜',
                dataIndex: 'create_date'
            }],
            autoScroll: true,
            dockedItems : [

                Ext.create('widget.toolbar', {
                    plugins: {
                        boxreorderer: true
                    },
                    cls: 'my-x-toolbar-default2',
                    margin: '0 0 0 0',
                    items: [
                        {
                            id: gu.id('select_title'),
                            xtype: 'tbtext',
                            text: ' - '
                        },
                        '->',
                        {
                            iconCls: null,
                            glyph: 'f0c7@FontAwesome',
                            text:'SPC 관리도 출력',
                            listeners : [{
                                click: function() {

                                    var reportSelection = gm.me().gridTemplate.getSelectionModel().getSelection();

                                    if(reportSelection.length > 0) {

                                        var sel = reportSelection[0];
                                        var docuSplit = sel.get('fname').split('-');
                                        var value_key = docuSplit[docuSplit.length - 1];
                                        var token_uid = sel.get('token_uid');

                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/xdview/spcMgmt.do?method=printSPCChartReport',
                                            params:{
                                                group_uid : sel.get('parent'),
                                                token_uid : token_uid
                                            },
                                            success : function(result, request) {
                                                var jsonData = Ext.JSON.decode(result.responseText);
                                                var excelPath = jsonData.excelPath;
                                                var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
                                                top.location.href = url;
                                            },//Ajax success
                                            failure: function(result, request) {
                                                Ext.Msg.alert('오류', '성적서를 출력할 수 없습니다. 엑셀 템플릿 관리에서 각 항목 위치가 정확한지 확인하세요.');
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

        Ext.apply(this, {
            layout: 'border',
            //bodyBorder: true,
            defaults: {
                collapsible: true,
                split: true
            },
            items: [
                {
                    title: '성적서 및 SPC 템플릿 선택',
                    collapsible: true,
                    frame: true,
                    region: 'west',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    width: '55%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '75%',
                        items: [this.grid]
                    }, this.gridViewTable]
                },
                {
                    title: 'SPC 관리도 출력',
                    collapsible: true,
                    frame: true,
                    region: 'center',
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    items: [this.gridTemplate]
                }

            ]
        });


        this.callParent(arguments);


    },

    bodyPadding: 3,

    items: null,
    tabchangeHandlerDoc : function(tabPanel, newTab, oldTab, eOpts)  {
        // console_logs('tabpanel newTab', newTab);
        console_logs('tabpanel newTab newTab.title', newTab.title);
        gm.me().curTabname = newTab.title;
        gm.me().redrawContent();
    },
    curTabname : null
});
