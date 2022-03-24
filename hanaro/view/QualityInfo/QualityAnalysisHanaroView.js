Ext.define('Hanaro.view.qualityInfo.QualityAnalysisHanaroView', {
    extend: 'Hanaro.base.HanaroBaseView',
    xtype: 'spc-analysis-view',
    initComponent: function () {

       this.testStore = Ext.create('Mplm.store.PopIfSpcStore', {});

        this.storeOutlier = Ext.create('Ext.data.Store', {
            autoLoad: false,
            fields: [{
                name: 'event_date',
                type: 'string'
            }, {
                name: 'url',
                type: 'string'
            }, {
                name: 'data_reason',
                type: 'string'
            }, {
                name: 'menu_key',
                type: 'string'
            }, {
                name: 'num',
                type: 'string'
            }],
            data: []
        });

        //Chart 환경설정
        Highcharts.theme = {
            colors: ['#3493DF', '#FF9655', '#FFF263', '#6AF9C4']
            , credits: {
                enabled: false
            },
            lang: {
                thousandsSep: ',',
                decimalPoint: '.',

            }
        };
        Highcharts.setOptions(Highcharts.theme);

        var store = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'ajax',
                url: CONTEXT_PATH + '/admin/userHistory.do?method=read&audit_type=CRI',
                reader: {
                    type: 'json',
                    root: 'datas',
                    totalProperty: 'count',
                    successProperty: 'success'
                },
                autoLoad: false
            }
        });

        this.chartLineStore = Ext.create('Mplm.store.SpcColumnNameStore', {});

        this.gridInspect = Ext.create('Ext.grid.Panel', {
            frame: true,
            border: true,
            resizable: true,
            scroll: true,
            multiSelect: true,
            region: 'east',
            layout: 'fit',
            margin: '0 3 0 0',
            store: this.storeOutlier,
            cls: 'rfx-panel',
            selModel: Ext.create("Ext.selection.CheckboxModel", {
                mode: 'multi',
                checkOnly: false,
                allowDeselect: true
            }),
            autoScroll: true,
            autoHeight: true,
            bbar: getPageToolbar(this.storeOutlier),
            forceFit: true,
            flex: 0.4,
            dockedItems: [],
            columns: [{
                text: '발생번호',
                width: 70,
                dataIndex: 'url'
            }, {
                text: '발생일',
                width: 70,
                dataIndex: 'event_date'
            }, {
                text: '이상점구분',
                width: 100,
                dataIndex: 'menu_key'
            },{
                text: '제조로트',
                width: 100,
                dataIndex: 'output_lot'
            },
            {
                text: '보고여부',
                width: 70,
                dataIndex: 'report_yn'
            }
            ]
        });

        this.processStore = Ext.create('Ext.data.Store', {
            fields: ['code', 'name'],
            data: [
                {"code": "1", "name": "수입검사"},
                {"code": "2", "name": "조립"},
                {"code": "3", "name": "공정검사"},
                {"code": "4", "name": "Aging"},
                {"code": "5", "name": "포장"}
            ]
        });

        var productTypeStore = Ext.create('Ext.data.Store', {
            fields: ['code', 'name'],
            data: [
                {"code": "1", "name": "제품"},
                {"code": "2", "name": "자재"}
            ]
        });

        this.typeStore = Ext.create('Ext.data.Store', {
            fields: ['code', 'name'],
            data: [
                {"code": "1", "name": "계수"},
                {"code": "2", "name": "계량"}
            ]
        });

        var search = [{
            xtype: 'label',
            width: 40,
            text: '기간',
            style: 'color:white;'
        }, {
            id: gu.id('s_date_arv'),
            name: 's_date',
            format: 'Y-m-d',
            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
            dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
            xtype: 'datefield',
            value: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            width: 98
        }, {
            xtype: 'label',
            text: "~",
            style: 'color:white;'
        }, {
            id: gu.id('e_date_arv'),
            name: 'e_date',
            format: 'Y-m-d',
            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
            dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
            xtype: 'datefield',
            value: new Date(),
            width: 98
        }, {
            xtype: 'combo',
            name: 'v000',
            id: gu.id('productType'),
            emptyText: '제품구분',
            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
            width: 120,
            store: productTypeStore,
            // id:'temp_type',
            anchor: '80%',
            valueField: 'code',
            displayField: 'name',
            //emptyText: '선택해주세요.',
            listConfig: {
                loadingText: '검색중...',
                emptyText: '일치하는 항목 없음',
                getInnerTpl: function () {
                    return '<div data-qtip="{code}">{name}</div>';
                }
            },
            listeners: {
                change: function (field, value) {
                    gm.me().chartLineStore.getProxy().setExtraParam('item_type', value);
                    if (value.length > 0) {
                        gm.me().chartLineStore.load();
                    }
                }
            }
        }, {
            xtype: 'combo',
            name: 'v001',
            emptyText: '공정파트',
            id: gu.id('processName'),
            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
            width: 120,
            store: this.processStore,
            anchor: '80%',
            valueField: 'code',
            displayField: 'name',
            //emptyText: '선택해주세요.',
            listConfig: {
                loadingText: '검색중...',
                emptyText: '일치하는 항목 없음',
                getInnerTpl: function () {
                    return '<div data-qtip="{code}">{name}</div>';
                }
            },
            listeners: {
                change: function (field, value) {
                    gm.me().chartLineStore.getProxy().setExtraParam('process_type', value);

                    if (value.length > 0) {
                        gm.me().selected_process = field.rawValue;
                        gm.me().selected_process_code = value;
                        gm.me().chartLineStore.load();
                    }
                },
                specialkey: function (f, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        gm.me().storeViewTable.getProxy().setExtraParam(f.name, f.value);
                        gm.me().storeViewTable.load();
                    }
                }
            },
            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
            'onTrigger1Click': function () {
                Ext.getCmp(this.id).setValue('');
                gm.me().storeViewTable.getProxy().setExtraParam('product_type', null);
                gm.me().storeViewTable.load();
            }
        }, {
            xtype: 'combo',
            name: 'v012',
            emptyText: '타입',
            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
            width: 120,
            store: this.typeStore,
            // id:'temp_type',
            anchor: '80%',
            valueField: 'code',
            displayField: 'name',
            //emptyText: '선택해주세요.',
            listConfig: {
                loadingText: '검색중...',
                emptyText: '일치하는 항목 없음',
                getInnerTpl: function () {
                    return '<div data-qtip="{code}">{name}</div>';
                }
            },
            listeners: {
                change: function (field, value) {
                    if (value.length > 0) {
                        gm.me().selected_chart_type = field.rawValue;
                        gm.me().selected_chart_type_code = value;
                    }
                }
            }
        }, {
            xtype: 'textfield',
            name: 'v008',
            emptyText: '장비 No.',
            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
            width: 120,
            listeners: {
                specialkey: function (f, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        gm.me().storeViewTable.getProxy().setExtraParam(f.name, f.value);
                        gm.me().storeViewTable.load();
                    }
                }
            },
            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
            'onTrigger1Click': function () {
                Ext.getCmp(this.id).setValue('');
                gm.me().storeViewTable.getProxy().setExtraParam('temp_name', null);
                gm.me().storeViewTable.load();
            }
        }, {
            xtype: 'textfield',
            name: 'v003',
            emptyText: '품목',
            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
            width: 120,
            listeners: {
                specialkey: function (f, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        gm.me().storeViewTable.getProxy().setExtraParam(f.name, f.value);
                        gm.me().storeViewTable.load();
                    }
                }
            },
            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
            'onTrigger1Click': function () {
                Ext.getCmp(this.id).setValue('');
                gm.me().storeViewTable.getProxy().setExtraParam('temp_name', null);
                gm.me().storeViewTable.load();
            }
        }, {
            xtype: 'textfield',
            name: 'v004',
            emptyText: 'Lot No',
            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
            width: 120,
            listeners: {
                specialkey: function (f, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        gm.me().storeViewTable.getProxy().setExtraParam(f.name, f.value);
                        gm.me().storeViewTable.load();
                    }
                }
            },
            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
            'onTrigger1Click': function () {
                Ext.getCmp(this.id).setValue('');
                gm.me().storeViewTable.getProxy().setExtraParam('temp_name', null);
                gm.me().storeViewTable.load();
            }
        }, {
            xtype: 'textfield',
            name: 'v007',
            emptyText: 'Size',
            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
            width: 120,
            listeners: {
                specialkey: function (f, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        gm.me().storeViewTable.getProxy().setExtraParam(f.name, f.value);
                        gm.me().storeViewTable.load();
                    }
                }
            },
            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
            'onTrigger1Click': function () {
                Ext.getCmp(this.id).setValue('');
                gm.me().storeViewTable.getProxy().setExtraParam('temp_name', null);
                gm.me().storeViewTable.load();
            }
        }
        ];

        var searchToolbar = Ext.create('widget.toolbar', {
            items: search,
            layout: 'column',
            cls: 'my-x-toolbar-default1',
            defaults: {
                margin: '3 3 3 3' //top right bottom left (clockwise) margins of each item/column
            }
        });

        var action/*this.searchAction*/ = Ext.create('Ext.Action', {
            iconCls: 'af-search',
            text: '검색',
            tooltip: '조건 검색',
            handler: function () {
                var items = searchToolbar.items.items;
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    gm.me().testStore.getProxy().setExtraParam(item.name, item.value);
                }
                gm.me().aX = null;
                gm.me().aY = null;
                gm.me().aMin_1 = null;
                gm.me().aMax_1 = null;
                gm.me().aMin_2 = null;
                gm.me().aMax_2 = null;
                gm.me().uMin_1 = null;
                gm.me().uMax_1 = null;
                gm.me().uMin_2 = null;
                gm.me().uMax_2 = null;
                gm.me().redrawSpc(false);
            }
        });

        var printExcelAction = Ext.create('Ext.Action', {

            iconCls: null,
            glyph: 'f1c3@FontAwesome',
            html: 'Excel',
            handler: function() {

                var store = gm.me().testStore;

                store.getProxy().setExtraParam("srch_type", 'excelPrint');
                store.getProxy().setExtraParam("srch_fields", 'major');
                store.getProxy().setExtraParam("srch_rows", 'all');
                store.getProxy().setExtraParam("menuCode", gm.me().link);

                var items = searchToolbar.items.items;
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    store.getProxy().setExtraParam(item.name, item.value);
                }

                var arrField = gm.me().gSearchField;

                try {
                    Ext.each(arrField, function(fieldObj, index) {

                        console_log(typeof fieldObj);

                        var dataIndex = '';

                        if(typeof fieldObj == 'string') { //text search
                            dataIndex = fieldObj;
                        } else {
                            dataIndex = fieldObj['field_id'];
                        }

                        var srchId = gMain.getSearchField(dataIndex);; //'srch' + dataIndex.substring(0,1).toUpperCase()+ dataIndex.substring(1);
                        var value = Ext.getCmp(srchId).getValue();

                        if(value!=null && value!='') {
                            if(dataIndex=='unique_id' || typeof fieldObj == 'object') {
                                store.getProxy().setExtraParam(dataIndex, value);
                            } else {
                                var enValue = Ext.JSON.encode('%' + value+ '%');
                                console_info(enValue);
                                store.getProxy().setExtraParam(dataIndex, enValue);
                            }//endofelse
                        }//endofif

                    });
                } catch(noError){}

                store.load({
                    scope: this,
                    callback: function(records, operation, success) {

                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/filedown.do?method=myExcelPath',
                            params:{
                                mc_codes : gUtil.getMcCodes()
                            },
                            success : function(response, request) {
                                //console_logs('response.responseText', response.responseText);
                                store.getProxy().setExtraParam("srch_type", null);
                                var excelPath = response.responseText;
                                if(excelPath!=null && excelPath.length>0) {
                                    var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ excelPath;
                                    top.location.href=url;

                                } else {
                                    Ext.Msg.alert('경고', '엑셀 다운로드 경로를 찾을 수 없습니다.<br>엑셀 출력정책이 정의되지 않았습니다.');
                                }
                            }
                        });

                    }
                });

            }
        });

        var callInterFaceSpc = Ext.create('Ext.Action', {
            iconCls: 'af-plus',
            text: '인터페이스 호출',
            tooltip: '내부 SPC 정보를 호출합니다.',
            handler: function () {
                gm.me().callInterFaceHandler();
            }
        });

        var reportAction = Ext.create('Ext.Action', {
            iconCls: 'af-plus',
            text: '이상점보고',
            tooltip: '이상점을 보고합니다',
            handler: function () {

                var selection = gm.me().gridInspect.getSelectionModel().getSelection();

                if (selection.length > 0) {
                    gm.me().openMyWin(selection);
                } else {
                    Ext.Msg.alert('오류', '최소 하나 이상의 이상점을 선택하세요.');
                }
            }
        });

        var buttonToolbar = Ext.create('widget.toolbar', {
            cls: 'my-x-toolbar-default2',
            items: [action, printExcelAction]
        });

        var buttonToolbar2 = Ext.create('widget.toolbar', {
            cls: 'my-x-toolbar-default2',
            items: [reportAction, callInterFaceSpc]
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
                    //title: '품질 현황',
                    overflowY: 'auto',
                    frame: false,
                    collapsible: false,
                    region: 'center',
                    flex: 0.9,
                    margin: '5 0 0 0',
                    listeners: {
                        resize: function (element, info, eOpts) {
                            try {
                                gm.me().tabSize = info;
                                gm.me().redrawSpc(true);
                            } catch(e) {
                                console_logs('gm.me().redrawSpc(true)', e);
                            }

                        }
                    },
                    items: [
                        buttonToolbar,
                        searchToolbar,
                        // {
                        //     xtype: 'fieldset',
                        //     style: 'background-color: #F6F6F6; background-image: none;',
                        //     title: '항목1',
                        //     margin: '5 5 5 5',
                        //     height: 'auto',
                        //     defaults: {
                        //         componentCls: "",
                        //         width: '100%',
                        //         labelWidth: 50,
                        //         labelAlign: 'right'
                        //     },
                        //     layout: {
                        //         type: 'column',
                        //         columns: 3,
                        //         tableAttrs: {
                        //             style: {
                        //                 width: '100%',
                        //                 labelMargin: '5 5 5 5'
                        //             }
                        //         }
                        //     },
                        //     items: [
                        //         {
                        //             xtype: 'combo',
                        //             name: 'v010_1',
                        //             fieldLabel: '항목1',
                        //             emptyText: '항목을 선택하세요.',
                        //             fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                        //             store: this.chartLineStore,
                        //             displayField: 'legend_code_kr',
                        //             valueField: 'legend_code',
                        //             width: 280,
                        //             //anchor: '80%',
                        //             listConfig: {
                        //                 loadingText: '검색중...',
                        //                 emptyText: '일치하는 항목 없음',
                        //                 getInnerTpl: function () {
                        //                     return '<div data-qtip="{legend_code}">[{item_type_kr}] {legend_code_kr}</div>';
                        //                 }
                        //             },
                        //             listeners: {
                        //                 change: function (field, newValue, oldValue) {
                        //                     gm.me().testStore.getProxy().setExtraParam('v010_1', newValue);
                        //                     gm.me().v010_1 = newValue;
                        //                 },
                        //                 scope: this
                        //             }
                        //         },
                        //         {
                        //             xtype: 'textfield',
                        //             name: 'min',
                        //             id: gu.id('LCL1'),
                        //             width: 280,
                        //             fieldLabel: 'LCL',
                        //             readOnly: true
                        //             // decimalPrecision: 2,
                        //             // listeners: {
                        //             //     change: function (field, newValue, oldValue) {
                        //             //         gm.me().testStore.getProxy().setExtraParam('LCL1', newValue);
                        //             //         gm.me().aMin_1 = newValue;
                        //             //     },
                        //             //     scope: this
                        //             // }
                        //         },
                        //         {
                        //             xtype: 'textfield',
                        //             name: 'max',
                        //             id: gu.id('UCL1'),
                        //             width: 280,
                        //             fieldLabel: 'UCL',
                        //             readOnly: true
                        //             // decimalPrecision: 2,
                        //             // listeners: {
                        //             //     change: function (field, newValue, oldValue) {
                        //             //         gm.me().testStore.getProxy().setExtraParam('UCL1', newValue);
                        //             //         gm.me().aMax_1 = newValue;
                        //             //     },
                        //             //     scope: this
                        //             // }
                        //         }
                        //     ]
                        // },
                        // {
                        //     xtype: 'fieldset',
                        //     style: 'background-color: #F6F6F6; background-image: none;',
                        //     title: '항목2',
                        //     margin: '5 5 5 5',
                        //     height: 'auto',
                        //     defaults: {
                        //         componentCls: "",
                        //         width: '100%',
                        //         labelWidth: 50,
                        //         labelAlign: 'right'
                        //     },
                        //     layout: {
                        //         type: 'column',
                        //         columns: 3,
                        //         tableAttrs: {
                        //             style: {
                        //                 width: '100%',
                        //                 labelMargin: '5 5 5 5'
                        //             }
                        //         }
                        //     },
                        //     items: [
                        //         {
                        //             xtype: 'combo',
                        //             name: 'v010_2',
                        //             fieldLabel: '항목2',
                        //             emptyText: '항목을 선택하세요.',
                        //             fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                        //             store: this.chartLineStore,
                        //             displayField: 'legend_code_kr',
                        //             valueField: 'legend_code',
                        //             //anchor: '80%',
                        //             width: 280,
                        //             listConfig: {
                        //                 loadingText: '검색중...',
                        //                 emptyText: '일치하는 항목 없음',
                        //                 getInnerTpl: function () {
                        //                     return '<div data-qtip="{legend_code}">[{item_type_kr}] {legend_code_kr}</div>';
                        //                 }
                        //             },
                        //             listeners: {
                        //                 change: function (field, newValue, oldValue) {
                        //                     gm.me().testStore.getProxy().setExtraParam('v010_2', newValue);
                        //                     gm.me().v010_2 = newValue;
                        //                 },
                        //                 scope: this
                        //             }
                        //         },
                        //         {
                        //             xtype: 'textfield',
                        //             name: 'min',
                        //             id: gu.id('LCL2'),
                        //             fieldLabel: 'LCL',
                        //             width: 280,
                        //             readOnly: true
                        //             //decimalPrecision: 2,
                        //             // listeners: {
                        //             //     change: function (field, newValue, oldValue) {
                        //             //         gm.me().testStore.getProxy().setExtraParam('LCL2', newValue);
                        //             //         gm.me().aMin_2 = newValue;
                        //             //     },
                        //             //     scope: this
                        //             // }
                        //         },
                        //         {
                        //             xtype: 'textfield',
                        //             name: 'max',
                        //             id: gu.id('UCL2'),
                        //             fieldLabel: 'UCL',
                        //             width: 280,
                        //             readOnly: true
                        //             //decimalPrecision: 2,
                        //             // listeners: {
                        //             //     change: function (field, newValue, oldValue) {
                        //             //         gm.me().testStore.getProxy().setExtraParam('UCL2', newValue);
                        //             //         gm.me().aMax_2 = newValue;
                        //             //     },
                        //             //     scope: this
                        //             // }
                        //         }
                        //     ]
                        // },
                        {
                            html: '<div style="height:100%;" id='
                            + gu.id('chartSpc1') + '></div>'
                            // + '<hr><div style="height:370px;" id='
                            // + gu.id('chartSpc2') + '></div>'
                            ,
                            flex: 0.4
                        }
                    ]
                },
//                {
//                    title: '이상점 목록',
//                    collapsible: true,
//                    frame: true,
//                    region: 'east',
//                    layout: {
//                        type: 'vbox',
//                        pack: 'start',
//                        align: 'stretch'
//                    },
//                    margin: '5 0 0 0',
//                    flex: 0.7,
//                    items: [buttonToolbar2, this.gridInspect]
//                },
            ]
        });


        this.callParent(arguments);


    },

    bodyPadding: 3,

    items: null,
    tabchangeHandlerDoc: function (tabPanel, newTab, oldTab, eOpts) {
        // console_logs('tabpanel newTab', newTab);
        console_logs('tabpanel newTab newTab.title', newTab.title);
        gm.me().curTabname = newTab.title;
        gm.me().redrawContent();
    },
    tabchangeHandlerHist: function (tabPanel, newTab, oldTab, eOpts) {
        gm.me().curHisname = newTab.title;
        console_logs('curHisname', this.curHisname);
        switch (this.curHisname) {
            case CMD_VIEW_DTL:
                this.redrawHistDetail();
                break;
            case '전체보기':
                this.redrawHistOveral();
                break;
        }

    },
    curTabname: null,
    curHisname: null,
    redrawSpc: function (isFirst) {

        gm.me().testStore.load(function (record) {

            var critPointStore = Ext.create('Mplm.store.CritPointStore', {});

            critPointStore.load(function(record2) {

                if (record.length < 1 && !isFirst) {
                    Ext.Msg.alert('경고', '검색 결과가 없습니다. 제품명을 넣지 않으셨다면 제품명을 넣어야 하는 항목인지 확인하세요.');
                }

                var items_line1 = [];
                var items_line2 = [];

                var minValue_line1 = 100000;
                var maxValue_line1 = 0;
                var minValue_line2 = 100000;
                var maxValue_line2 = 0;
                var minValue_line1_lsl = 100000;
                var maxValue_line1_usl = 0;
                var minValue_line2_lsl = 100000;
                var maxValue_line2_usl = 0;

                var minVal_1 = 100000;
                var maxVal_1 = 0;
                var minVal_2 = 100000;
                var maxVal_2 = 0;

                var line1_num = 0;
                var line2_num = 0;

                var isExistUCL_1 = true;
                var isExistUCL_2 = true;

                var dpmo_max_value = 20000;

                gm.me().storeOutlier.removeAll();


                // gu.getCmp('UCL1').setValue('');
                // gu.getCmp('UCL2').setValue('');
                // gu.getCmp('LCL1').setValue('');
                // gu.getCmp('LCL2').setValue('');

                for (var i = 0; i < record.length; i++) {

                    if (record[i].get('v002') == gm.me().v010_1) {

                        if(record[i].get('isExistUCL')) {
                            //gu.getCmp('UCL1').setValue(parseFloat(record[i].get('UCL')));
                        }

                        if(record[i].get('isExistLCL')) {
                            //gu.getCmp('LCL1').setValue(parseFloat(record[i].get('LCL')));
                        }

                        var errorList = "";

                        var outlierType = record[i].get('outlierList');

                        var keys = Object.keys(outlierType);
                        for (var k = 0; k < keys.length; k++) {
                            outlierType[Object.keys(outlierType)[k]];
                            switch (Object.keys(outlierType)[k]) {
                                case "POLICY1":
                                    errorList += "1 ";
                                    break;
                                case "POLICY2":
                                    errorList += "2 ";
                                    break;
                                case "POLICY3":
                                    errorList += "3 ";
                                    break;
                                case "POLICY4":
                                    errorList += "4 ";
                                    break;
                                case "POLICY5":
                                    errorList += "5 ";
                                    break;
                                case "POLICY6":
                                    errorList += "6 ";
                                    break;
                                case "POLICY7":
                                    errorList += "7 ";
                                    break;
                                case "POLICY8":
                                    errorList += "8 ";
                                    break;
                                case "POLICY9":
                                    errorList += "9 ";
                                    break;
                            }
                        }

                        var value = parseFloat(record[i].get('v001'));

                        if(value < minVal_1) {
                            minVal_1 = value;
                        }
                        if(value > maxVal_1) {
                            maxVal_1 = value;
                        }

                        isExistUCL_1 = record[i].get('isExistUCL');

                        if (errorList.length == 0) {
                            items_line1.push({
                                y: value,
                                date: record[i].get('v000'),
                                output_lot: record[i].get('v003'),
                            });
                        } else {
                            items_line1.push({
                                y: value,
                                date: record[i].get('v000'),
                                output_lot: record[i].get('v003'),
                                error: errorList,
                                marker: {
                                    symbol: 'diamond',
                                    fillColor: '#f00',
                                    lineColor: '#f00',
                                    radius: 4,
                                    states: {hover: {fillColor: '#f00', lineColor: '#f00', radius: 5}}
                                }
                            });

                            var v000 = record[i].get('v000');
                            var column_name = gm.me().v010_1;
                            var occur_process = gu.getCmp('processName').getValue();
                            var report_yn = "X";
                            var output_lot = record[i].get('v003');
                            var buffer_uid = record[i].get('v004');

                            for(var k = 0; k < record2.length; k++) {
                                var combined_data = occur_process+"-"+column_name+"-"+v000+"-"+output_lot+"-"+buffer_uid;

                                if(record2[k].get('combined_data') == combined_data) {
                                    report_yn = "O";
                                }
                            }

                            gm.me().storeOutlier.insert(line1_num, new Ext.data.Record(
                                {
                                    "event_date": v000,
                                    "output_lot": record[i].get('v003'),
                                    "url": '1-' + (line1_num + 1),
                                    "menu_key": errorList,
                                    "report_yn": report_yn,
                                    "buffer_uid": buffer_uid
                                }
                            ));

                            gm.me().storeOutlier.sync();

                        }

                        if(gm.me().v010_1 == 'DPMO') {
                            if(dpmo_max_value < parseFloat(record[i].get('v001'))) {
                                dpmo_max_value = parseFloat(record[i].get('v001'));
                            }
                            maxValue_line1 = dpmo_max_value;
                            minValue_line1 = 0;
                        } else {
                            maxValue_line1 = parseFloat(record[i].get('UCL'));
                            minValue_line1 = parseFloat(record[i].get('LCL'));
                        }



                        maxValue_line1_usl = record[i].get('USL');
                        minValue_line1_lsl = record[i].get('LSL');

                        line1_num++;

                    } else if (record[i].get('v002') == gm.me().v010_2) {

                        if(record[i].get('isExistUCL')) {
                            gu.getCmp('UCL2').setValue(parseFloat(record[i].get('UCL')));
                        }

                        if(record[i].get('isExistLCL')) {
                            gu.getCmp('LCL2').setValue(parseFloat(record[i].get('LCL')));
                        }

                        var errorList = "";

                        var outlierType = record[i].get('outlierList');
                        var keys = Object.keys(outlierType);
                        for (var k = 0; k < keys.length; k++) {
                            outlierType[Object.keys(outlierType)[k]];
                            switch (Object.keys(outlierType)[k]) {
                                case "POLICY1":
                                    errorList += "1 ";
                                    break;
                                case "POLICY2":
                                    errorList += "2 ";
                                    break;
                                case "POLICY3":
                                    errorList += "3 ";
                                    break;
                                case "POLICY4":
                                    errorList += "4 ";
                                    break;
                                case "POLICY5":
                                    errorList += "5 ";
                                    break;
                                case "POLICY6":
                                    errorList += "6 ";
                                    break;
                                case "POLICY7":
                                    errorList += "7 ";
                                    break;
                                case "POLICY8":
                                    errorList += "8 ";
                                    break;
                                case "POLICY9":
                                    errorList += "9 ";
                                    break;
                            }
                        }

                        var value = parseFloat(record[i].get('v001'));

                        if(value < minVal_2) {
                            minVal_2 = value;
                        }
                        if(value > maxVal_2) {
                            maxVal_2 = value;
                        }

                        isExistUCL_2 = record[i].get('isExistUCL');

                        if (errorList.length == 0) {
                            items_line2.push({
                                y: value,
                                date: record[i].get('v000'),
                                output_lot: record[i].get('v003'),
                            });
                        } else {
                            items_line2.push({
                                y: value,
                                date: record[i].get('v000'),
                                output_lot: record[i].get('v003'),
                                error: errorList,
                                marker: {
                                    symbol: 'diamond',
                                    fillColor: '#f00',
                                    lineColor: '#f00',
                                    radius: 4,
                                    states: {hover: {fillColor: '#f00', lineColor: '#f00', radius: 5}}
                                }
                            });

                            var critPointStore = Ext.create('Mplm.store.CritPointStore', {});

                            var v000 = record[i].get('v000');

                            var column_name = gm.me().v010_2;
                            var occur_process = gu.getCmp('processName').getValue();

                            var report_yn = "X"

                            var output_lot = record[i].get('v003');
                            var buffer_uid = record[i].get('v004');

                            for(var k = 0; k < record2.length; k++) {
                                var combined_data = occur_process+"-"+column_name+"-"+v000+"-"+output_lot+"-"+buffer_uid;

                                if(record2[k].get('combined_data') == combined_data) {
                                    report_yn = "O";
                                }
                            }

                            gm.me().storeOutlier.insert(line1_num, new Ext.data.Record(
                                {
                                    "event_date": v000,
                                    "url": '2-' + (line1_num + 1),
                                    "output_lot": record[i].get('v003'),
                                    "menu_key": errorList,
                                    "report_yn": report_yn,
                                    "buffer_uid": buffer_uid
                                }
                            ));

                            gm.me().storeOutlier.sync();

                        }

                        if(gm.me().v010_2 == 'DPMO') {
                            if(dpmo_max_value < parseFloat(record[i].get('v001'))) {
                                dpmo_max_value = parseFloat(record[i].get('v001'));
                            }
                            maxValue_line2 = dpmo_max_value;
                            minValue_line2 = 0;
                        } else {
                            maxValue_line2 = parseFloat(record[i].get('UCL'));
                            minValue_line2 = parseFloat(record[i].get('LCL'));
                        }

                        maxValue_line2_usl = record[i].get('USL');
                        minValue_line2_lsl = record[i].get('LSL');

                        line2_num++;
                    }
                }

                var gap1 = (maxValue_line1 - minValue_line1) / 6;
                var gap2 = (maxValue_line2 - minValue_line2) / 6;

                var sections1 = [];

                if(minValue_line1_lsl != null) {
                    minValue_line1_lsl = parseFloat(minValue_line1_lsl);
                    sections1.push(minValue_line1_lsl);
                }

                sections1.push(parseFloat(minValue_line1));
                sections1.push(parseFloat(minValue_line1) + parseFloat(gap1));
                sections1.push(parseFloat(minValue_line1) + (parseFloat(gap1) * 2));
                sections1.push(parseFloat(minValue_line1) + (parseFloat(gap1) * 3));
                sections1.push(parseFloat(minValue_line1) + (parseFloat(gap1) * 4));
                sections1.push(parseFloat(minValue_line1) + (parseFloat(gap1) * 5));
                sections1.push(maxValue_line1);

                if(maxValue_line1_usl != null) {
                    maxValue_line1_usl = parseFloat(maxValue_line1_usl);
                    sections1.push(maxValue_line1_usl);
                }

                var minValue_1 = 0;
                var maxValue_1 = 0;

                if(minValue_line1_lsl != null && maxValue_line1_usl != null) {
                    minValue_1 = minValue_line1_lsl - ((maxValue_line1_usl - minValue_line1_lsl) / 6);
                    maxValue_1 = maxValue_line1_usl + ((maxValue_line1_usl - minValue_line1_lsl) / 6);
                } else if(minValue_line1_lsl == null && maxValue_line1_usl != null) {
                    minValue_1 = minValue_line1 - ((maxValue_line1 - minValue_line1) / 6);
                    maxValue_1 = maxValue_line1_usl + ((maxValue_line1_usl - minValue_line1) / 6);
                } else if(minValue_line1_lsl != null && maxValue_line1_usl == null) {
                    minValue_1 = minValue_line1_lsl - ((maxValue_line1 - minValue_line1_lsl) / 6);
                    maxValue_1 = maxValue_line1 + ((maxValue_line1 - minValue_line1) / 6);
                } else {
                    minValue_1 = minValue_line1 - ((maxValue_line1 - minValue_line1) / 100 * 15);
                    maxValue_1 = maxValue_line1 + ((maxValue_line1 - minValue_line1) / 100 * 15);
                }

                minValue_1 = parseFloat(minValue_1);
                maxValue_1 = parseFloat(maxValue_1);
                maxVal_1 = parseFloat(maxVal_1);
                minVal_1 = parseFloat(minVal_1);

                if(minVal_1 < minValue_1) {
                    minValue_1 = minVal_1 - (minValue_1 * 0.05);
                }
                if(maxVal_1 > maxValue_1) {
                    maxValue_1 = maxVal_1 + (maxValue_1 * 0.05);
                }

                var sections2 = [];

                if(minValue_line2_lsl != null) {
                    minValue_line2_lsl = parseFloat(minValue_line2_lsl);
                    sections2.push(minValue_line2_lsl);
                }

                sections2.push(parseFloat(minValue_line2));
                sections2.push(parseFloat(minValue_line2) + parseFloat(gap2));
                sections2.push(parseFloat(minValue_line2) + (parseFloat(gap2) * 2));
                sections2.push(parseFloat(minValue_line2) + (parseFloat(gap2) * 3));
                sections2.push(parseFloat(minValue_line2) + (parseFloat(gap2) * 4));
                sections2.push(parseFloat(minValue_line2) + (parseFloat(gap2) * 5));
                sections2.push(maxValue_line2);

                if(maxValue_line2_usl != null) {
                    maxValue_line2_usl = parseFloat(maxValue_line2_usl);
                    sections2.push(maxValue_line2_usl);
                }

                var minValue_2 = 0;
                var maxValue_2 = 0;

                if(minValue_line2_lsl != null && maxValue_line2_usl != null) {
                    minValue_2 = minValue_line2_lsl - ((maxValue_line2_usl - minValue_line2_lsl) / 6);
                    maxValue_2 = maxValue_line2_usl + ((maxValue_line2_usl - minValue_line2_lsl) / 6);
                } else if(minValue_line2_lsl == null && maxValue_line2_usl != null) {
                    minValue_2 = minValue_line2 - ((maxValue_line2 - minValue_line2) / 6);
                    maxValue_2 = maxValue_line2_usl + ((maxValue_line2_usl - minValue_line2) / 6);
                } else if(minValue_line2_lsl != null && maxValue_line2_usl == null) {
                    minValue_2 = minValue_line2_lsl - ((maxValue_line2 - minValue_line2_lsl) / 6);
                    maxValue_2 = maxValue_line2 + ((maxValue_line2 - minValue_line2) / 6);
                } else {
                    minValue_2 = minValue_line2 - ((maxValue_line2 - minValue_line2) / 100 * 15);
                    maxValue_2 = maxValue_line2 + ((maxValue_line2 - minValue_line2) / 100 * 15);
                }

                minValue_2 = parseFloat(minValue_2);
                maxValue_2 = parseFloat(maxValue_2);
                maxVal_2 = parseFloat(maxVal_2);
                minVal_2 = parseFloat(minVal_2);

                if(minVal_2 < minValue_2) {
                    minValue_2 = minVal_2 - (minValue_2 * 0.05);
                }

                if(maxVal_2 > maxValue_2) {
                    maxValue_2 = maxVal_2 + (maxValue_2 * 0.05);
                }

                $('#' + gu.id('chartSpc1')).highcharts({
                    chart: {
                        renderTo: 'control',
                        defaultSeriesType: 'line',
                        marginRight: 25,
                        marginLeft: 70,
                        backgroundColor: '#eee',
                        borderWidth: 1,
                        borderColor: '#ccc',
                        plotBackgroundColor: '#fff',
                        plotBorderWidth: 1,
                        plotBorderColor: '#ccc'
                    },
                    scrollbar: {
                        enabled: true
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: '',
                    },
                    tooltip: {
                        borderWidth: 1,
                        formatter: function () {
                            if (this.point.error) {
                                var errorText = '<b>사유: </b>' + this.point.error;
                            }
                            else {
                                var errorText = '';
                            }
                            return '<b>' + this.point.date.substring(0, 4) + '년 ' +
                                this.point.date.substring(4, 6) + '월 ' +
                                this.point.date.substring(6, 8) + '일'
                                + '</b> ('+ this.point.output_lot +')<br/>' +
                                this.x + ': ' + this.y + '<br/>' +
                                errorText;
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            shadow: false,
                            lineWidth: 1,
                            states: {
                                hover: {
                                    enabled: true,
                                    lineWidth: 1
                                }
                            },
                            allowPointSelect: true,
                            pointStart: 1,
                            events: {
                                click: function (e) {
                                    gm.me().aX = e.point.x;
                                    gm.me().aY = e.point.y;
                                }
                            },
                            marker: {
                                enabled: true,
                                symbol: 'circle',
                                radius: 2,
                                states: {
                                    hover: {
                                        enabled: true
                                    }
                                }
                            },
                        }
                    },
                    xAxis: {
                        lineWidth: 0,
                        tickColor: '#999'
                    },
                    yAxis: {
                        tickPositions: sections1,
                        plotLines: [
                        // {
                        //     value: minValue_line1 - (maxValue_line1 * 0.05),
                        //     color: 'rgba(255,29,33,.255)',
                        //     width: 1,
                        //     zIndex: 3
                        // },
                        {
                            value: minValue_line1_lsl,
                            color: /*isExistUCL_1 ? */'rgba(162,29,33,.75)'/* : 'rgba(24,90,169,.25)'*/,
                            width: 1,
                            zIndex: 2
                        },
                        {
                            value: minValue_line1,
                            color: isExistUCL_1 ? (gm.me().v010_1 == 'DPMO' ? 'rgba(24,90,169,.25)' : 'rgba(0,153,0,.75)') : 'rgba(24,90,169,.25)',
                            width: 1,
                            zIndex: 3
                        },
                        {
                            value: minValue_line1 + (gap1 * 3),
                            color: 'rgba(24,90,169,.75)',
                            width: 1,
                            zIndex: 3
                        },
                        {
                            value: maxValue_line1,
                            color: isExistUCL_1 ? (gm.me().v010_1 == 'DPMO' ? 'rgba(24,90,169,.25)' : 'rgba(0,153,0,.75)') : 'rgba(24,90,169,.25)',
                            width: 1,
                            zIndex: 3
                        },
                        {
                            value: 10000,
                            color: gm.me().v010_1 == 'DPMO' ? 'rgba(162,29,33,.75)' : 'rgba(255,255,255,.25)',
                            width: 1,
                            zIndex: 3
                        },
                        {
                            value: maxValue_line1_usl,
                            color: /*isExistUCL_1 ? */'rgba(162,29,33,.75)'/* : 'rgba(24,90,169,.25)'*/,
                            width: 1,
                            zIndex: 2
                        }
                        ],
                        title: {text: ''},
                        lineWidth: 0,
                        gridLineWidth: 1,
                        gridLineColor: 'rgba(24,90,169,.25)',
                        startOnTick: false,
                        endOnTick: false,
                        labels: {
                            format:  maxValue_line1 > 1000 ? '{value:,.0f}' : '{value:,.2f}',
                        },
                        minPadding: 0,
                        maxPadding: 0,
                        min: minValue_1,
                        max: maxValue_1
                    },
                    series: [{
                        name: 'Measure',
                        data: items_line1,
                    }]
                });

                $('#' + gu.id('chartSpc2')).highcharts({
                    chart: {
                        renderTo: 'control',
                        defaultSeriesType: 'line',
                        marginRight: 25,
                        marginLeft: 70,
                        backgroundColor: '#eee',
                        borderWidth: 1,
                        borderColor: '#ccc',
                        plotBackgroundColor: '#fff',
                        plotBorderWidth: 1,
                        plotBorderColor: '#ccc'
                    },
                    scrollbar: {
                        enabled: true
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: '',
                    },
                    tooltip: {
                        borderWidth: 1,
                        formatter: function () {
                            if (this.point.error) {
                                var errorText = '<b>사유: </b>' + this.point.error;
                            }
                            else {
                                var errorText = '';
                            }
                            return '<b>' + this.point.date.substring(0, 4) + '년 ' +
                            this.point.date.substring(4, 6) + '월 ' +
                                this.point.date.substring(6, 8) + '일'
                                + '</b> ('+ this.point.output_lot +')<br/>' +
                                this.x + ': ' + this.y + '<br/>' +
                                errorText;
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            shadow: false,
                            lineWidth: 1,
                            states: {
                                hover: {
                                    enabled: true,
                                    lineWidth: 1
                                }
                            },
                            pointStart: 1,
                            allowPointSelect: true,
                            events: {
                                click: function (e) {
                                    gm.me().aX = e.point.x;
                                    gm.me().aY = e.point.y;
                                }
                            },
                            marker: {
                                enabled: true,
                                symbol: 'circle',
                                radius: 2,
                                states: {
                                    hover: {
                                        enabled: true
                                    }
                                }
                            },
                        }
                    },
                    xAxis: {
                        lineWidth: 0,
                        tickColor: '#999'
                    },
                    yAxis: {
                        tickPositions: sections2,
                        plotLines: [
                            {
                                value: minValue_line2_lsl,
                                color: /*isExistUCL_2 ? */'rgba(162,29,33,.75)'/* : 'rgba(24,90,169,.25)'*/,
                                width: 1,
                                zIndex: 2
                            },
                            {
                                value: minValue_line2,
                                color: isExistUCL_2 ? (gm.me().v010_2 == 'DPMO' ? 'rgba(24,90,169,.25)' : 'rgba(0,153,0,.75)') : 'rgba(24,90,169,.25)',
                                width: 1,
                                zIndex: 3
                            },
                            {
                                value: minValue_line2 + (gap2 * 3),
                                color: 'rgba(24,90,169,.75)',
                                width: 1,
                                zIndex: 3
                            },
                            {
                                value: maxValue_line2,
                                color: isExistUCL_2 ? (gm.me().v010_2 == 'DPMO' ? 'rgba(24,90,169,.25)' : 'rgba(0,153,0,.75)') : 'rgba(24,90,169,.25)',
                                width: 1,
                                zIndex: 3
                            },
                            {
                                value: 10000,
                                color: gm.me().v010_2 == 'DPMO' ? 'rgba(162,29,33,.75)' : 'rgba(255,255,255,.25)',
                                width: 1,
                                zIndex: 3
                            },
                            {
                                value: maxValue_line2_usl,
                                color: /*isExistUCL_2 ? */'rgba(162,29,33,.75)'/* : 'rgba(24,90,169,.25)'*/,
                                width: 1,
                                zIndex: 2
                            }
                        ],
                        title: {text: ''},
                        lineWidth: 0,
                        gridLineWidth: 1,
                        labels: {
                            format: maxValue_line2 > 1000 ? '{value:,.0f}' : '{value:,.2f}',
                        },
                        gridLineColor: 'rgba(24,90,169,.25)',
                        startOnTick: false,
                        endOnTick: false,
                        minPadding: 0,
                        maxPadding: 0,
                        min: minValue_2,
                        max: maxValue_2,
                    },
                    series: [{
                        name: 'Measure',
                        data: items_line2,
                    }]
                });
            });

        });
    },
    redrawDist: function () {

        var avr = this.getAver();

        $('#' + gu.id('chartDist1')).highcharts({
            chart: {},
            title: {
                text: '평균: ' + Ext.util.Format.number(avr, '0,00.0000/i')
            },

            xAxis: [{
                title: {
                    text: ''
                },
                alignTicks: false
            }, {
                title: {
                    text: ''
                },
                alignTicks: false,
                opposite: true
            }],

            yAxis: [{
                title: {text: ''}
            }, {
                title: {text: ''},
                opposite: true
            }],

            series: [{
                name: 'Bell curve',
                type: 'bellcurve',
                xAxis: 1,
                yAxis: 1,
                baseSeries: 1,
                zIndex: -1
            }, {
                name: 'Data',
                type: 'scatter',
                data: this.sizeData,
                marker: {
                    radius: 3
                }
            }]
        });
    },

    getAver: function () {
        var sum = 0;
        var cnt = 0;
        for (var i = 0; i < this.sizeData.length; i++) {
            if (this.sizeData[i] > 0) {
                sum = sum + this.sizeData[i];
                cnt++;
            }

        }
        return sum / cnt;
    },

    redrawHistDetail: function () {

        var avr = this.getAver();

        $('#' + gu.id('chartHist1')).highcharts({
            title: {
                text: '평균: ' + Ext.util.Format.number(avr, '0,00.0000/i')
            },

            xAxis: [{
                title: {text: ''},
                alignTicks: false
            }, {
                title: {text: ''},
                alignTicks: false,
                opposite: true
            }],

            xAxis: [{
                title: {
                    text: ''
                },
                alignTicks: false
            }, {
                title: {
                    text: ''
                },
                alignTicks: false,
                opposite: true
            }],

            yAxis: [{
                title: {text: ''}
            }, {
                title: {text: ''},
                opposite: true
            }],
            plotOptions: {
                series: {
                    // general options for all series
                },
                histogram: {
                    cropThreshold: 500,
                    depth: 250
                },
                column: {
                    pointPadding: 0,
                    borderWidth: 0,
                    groupPadding: 0,
                    shadow: false
                }

            },
            series: [{
                name: '히스토그램',
                type: 'histogram',
                xAxis: 1,
                yAxis: 1,
                baseSeries: gu.id('s1'),
                zIndex: -1
            }, {
                name: 'Data',
                type: 'scatter',
                data: this.sizeData,
                id: gu.id('s1'),
                marker: {
                    radius: 3
                }
            }]
        });
    },
    redrawContent: function () {
        console_logs('curTabname', this.curTabname);
        switch (this.curTabname) {
            case 'DATA':
                break;
            case '히스토그램':
                this.redrawHistDetail();
                break;
            case '정규분포':
                this.redrawDist();
                break;
            case 'Xbar-R 관리도':
                this.redrawSpc(true);
                break;
            case '분석표':
                break;
            case '파일 업로드':
                break;
        }
    },

    aX: null,
    aY: null,
    aMin_1: null,
    aMax_1: null,
    aMin_2: null,
    aMax_2: null,
    uMin_1: null,
    uMax_1: null,
    uMin_2: null,
    uMax_2: null,
    v010_1: null,
    v010_2: null,

    selected_process: null,
    selected_process_code: null,
    selected_chart_type: null,
    selected_chart_type_code: null,

    callInterFaceHandler: function() {
        Ext.MessageBox.show({
            title: CMD_OK,
            msg: '호출하시겠습니까? \n 이 작업은 시간이 소요됩니다.',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.QUESTION,
            fn: function(btn) {
                if (btn == 'yes') {
                    gMain.setCenterLoading(true);
                    Ext.Msg.alert('알림', '업데이트 중입니다. 잠시만 기다려주세요.', function() {});
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/database/if.do?method=callInterFaceDbSPC',
                        success: function(result, request) {
                            var jsonData = Ext.JSON.decode(result.responseText);
                            var result = jsonData.datas;
                            // alert(result);
                            if(result == 1) {
                                gMain.setCenterLoading(false);
                                Ext.Msg.alert('에러발생', '개발자에게 문의해주세요.', function() {});
                                return;
                            } else {
                                gm.me().showToast('알림', '완료되었습니다.');
                                gMain.setCenterLoading(false);
                            }
                        },
                        failure: extjsUtil.failureMessage
                    });
                } else {
                    return;
                }
            }
        });
    },

    openMyWin: function (selection) {

        var sel = selection[0];

        if(sel.get('report_yn') == 'O') {
            Ext.Msg.alert('경고', '이미 이상점 보고가 된 이상점입니다.');
        } else {
            var form = Ext.create('Ext.form.Panel', {
                id: gu.id('formPanel2'),
                xtype: 'form',
                frame: false,
                border: false,
                bodyPadding: '3 3 0',
                region: 'center',
                fieldDefaults: {
                    labelAlign: 'right',
                    msgTarget: 'side'
                },
                defaults: {
                    anchor: '100%',
                    labelWidth: 100,
                    margins: 10,
                },
                items: [
                    {
                        xtype: 'fieldset',
                        style: 'background-color: #F6F6F6; background-image: none;',
                        title: '발생 현황',
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
                        items: [{
                            fieldLabel: '발생 No.',
                            xtype: 'textfield',
                            anchor: '90%',
                            name: 'occur_no',
                            value: sel.get('url')
                        },
                            {
                                fieldLabel: '발생 일자',
                                xtype: 'datefield',
                                anchor: '90%',
                                format: 'Y-m-d',
                                name: 'occur_date',
                                value: new Date(sel.get('event_date').substring(0, 4) + "-"
                                    + sel.get('event_date').substring(4, 6) + "-"
                                    + sel.get('event_date').substring(6, 8))
                            },
                            {
                                fieldLabel: '발생공정',
                                xtype: 'textfield',
                                anchor: '90%',
                                name: 'occur_process_kr',
                                readOnly: true,
                                value: gm.me().selected_process
                            },{
                                fieldLabel: '제조로트',
                                xtype: 'textfield',
                                anchor: '90%',
                                name: 'output_lot',
                                readOnly: true,
                                value: gm.me().gridInspect.getSelectionModel().getSelection()[0].get('output_lot')
                            },
                            {
                                xtype: 'hiddenfield',
                                name: 'occur_process',
                                value: gm.me().selected_process_code
                            }
                        ]
                    },
                    {
                        xtype: 'fieldset',
                        style: 'background-color: #F6F6F6; background-image: none;',
                        title: '발생 유형',
                        defaults: {
                            componentCls: "",
                            width: '100%',
                        },
                        layout: {
                            type: 'table',
                            columns: 1,
                            tableAttrs: {
                                style: {
                                    width: '100%'
                                }
                            }
                        },
                        items: [{
                            fieldLabel: '관리도 Type',
                            xtype: 'textfield',
                            anchor: '90%',
                            name: 'graph_type_kr',
                            readOnly: true,
                            value: gm.me().selected_chart_type
                        },
                            {
                                xtype: 'hiddenfield',
                                name: 'graph_type',
                                value: gm.me().selected_chart_type_code
                            },
                            {
                                fieldLabel: '이상 유형',
                                xtype: 'textfield',
                                anchor: '90%',
                                name: 'outlier_type',
                                value: sel.get('menu_key')
                            }]
                    },
                    {
                        xtype: 'fieldset',
                        style: 'background-color: #F6F6F6; background-image: none;',
                        title: '발생원인',
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
                        items: [{
                            xtype: 'textarea',
                            rows: 2,
                            name: 'occur_reason',
                            anchor: '90%',
                            value: sel.get('data_reason')
                        }]
                    },
                    {
                        xtype: 'fieldset',
                        style: 'background-color: #F6F6F6; background-image: none;',
                        title: '조치사항',
                        defaults: {
                            componentCls: "",
                            width: '100%',
                        },
                        layout: {
                            type: 'table',
                            columns: 1,
                            tableAttrs: {
                                style: {
                                    width: '100%'
                                }
                            }
                        },
                        items: [
                            {
                                xtype: 'textarea',
                                rows: 2,
                                name: 'cor_measure',
                                anchor: '90%'
                            }]
                    }, {
                        xtype: 'hiddenfield',
                        id: 'outlier_column',
                        name: 'outlier_column',
                        value: sel.get('url').substring(0, 1) == '1' ? gm.me().v010_1 : gm.me().v010_2
                    }, {
                        xtype: 'hiddenfield',
                        id: 'buffer_uid',
                        name: 'buffer_uid',
                        value: sel.get('buffer_uid')
                    }

                ]
            });

            var myWin = Ext.create('Ext.Window', {
                modal: true,
                title: '이상점보고',
                width: 640,
                height: 500,
                plain: true,
                items: form,
                buttons: [{
                    text: CMD_OK,
                    handler: function (btn) {

                        var form = gu.getCmp('formPanel2').getForm();

                        var val = form.getValues(false);

                        form.submit({
                            url: CONTEXT_PATH + '/xdview/spcMgmt.do?method=sendOutlier',
                            params: {},
                            success: function (val, action) {
                                if (myWin) {
                                    gm.me().redrawSpc(false);
                                    myWin.close();
                                }
                            },
                            failure: function (val, action) {
                                if (myWin) {
                                    gm.me().redrawSpc(false);
                                    myWin.close();
                                }
                            }
                        });
                    }
                }, {
                    text: CMD_CANCEL,
                    handler: function () {
                        if (myWin) {
                            myWin.close();
                        }
                    }
                }]
            });
            myWin.show();
        }
    },

    testData: null
});