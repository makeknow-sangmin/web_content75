Ext.define('Rfx2.view.executiveInfo.SpcAnalysisRealTimeView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'spc-analysis-realtime-view',
    tabSize: 0,
    initComponent: function () {

        var task = {
            run: function() {
                if(gm.me().link == 'SPC9') {
                    gm.me().redrawSpc();
                    gm.me().aX = null;
                    gm.me().aY = null;
                    gm.me().aMin_1 = null;
                    gm.me().aMax_1 = null;
                    gm.me().aMin_2 = null;
                    gm.me().aMax_2 = null;
                    gm.me().aMin_3 = null;
                    gm.me().aMax_3 = null;
                }
            },
            interval: 10000 //1 second
        }

        var runner = new Ext.util.TaskRunner();

        runner.start(task);

        this.testStore = Ext.create('Mplm.store.SpcAnalysisRealTimeStore', {});

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
            },{
                name: 'menu_key',
                type: 'string'
            },{
                name: 'num',
                type: 'string'
            }],
            data: []
        });

        //testStore.getProxy().setExtraParam('');

        //Chart 환경설정
        Highcharts.theme = {
            colors: ['#3493DF', /*'#084695', '#FFD57E', '#979797', '#AA4643', */ '#FF9655', '#FFF263', '#6AF9C4']
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

        this.gridInspect = Ext.create('Ext.grid.Panel', {
            //title: '이상점 목록',
            frame: true,
            border: true,
            resizable: true,
            scroll: true,
            multiSelect: true,
            //collapsible: true,
            region: 'east',
            layout: 'fit',
            margin: '0 3 0 0',
            //width: '35%',
            store: this.storeOutlier,
            cls: 'rfx-panel',
            selModel: Ext.create("Ext.selection.CheckboxModel", {
                mode: 'multi',
                checkOnly: false,
                allowDeselect: true
            }),
            autoScroll: true,
            autoHeight: true,
            bbar: getPageToolbar(this.store),
            forceFit: true,
            flex: 0.4,
            dockedItems: [

            ],
            columns: [{
                text: '발생번호',
                width: 70,
                dataIndex: 'url'
            }, {
                text: '발생시간',
                width: 70,
                dataIndex: 'event_date'
            },  {
                text: '이상점구분',
                width: 200,
                dataIndex: 'menu_key'
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
            data : [
                {"code":"1", "name":"용해"},
                {"code":"2", "name":"도금"},
                {"code":"3", "name":"단독"},
                {"code":"4", "name":"신선"},
                {"code":"5", "name":"열처리"},
                {"code":"6", "name":"권선"},
                {"code":"7", "name":"Bare"},
                {"code":"8", "name":"합금"},
                {"code":"9", "name":"제조"},
                {"code":"10", "name":"코팅"},
                {"code":"11", "name":"선별(Sorting)"},
                {"code":"12", "name":"선별(Upper)"},
                {"code":"13", "name":"선별(Lower)"},
                {"code":"14", "name":"검사"}
            ]
        });

        this.columnStore = Ext.create('Ext.data.Store', {
            fields: ['code', 'name'],
            data : [
                {"code":"Line1_1", "name":"1 Line 1th"},
                {"code":"Line1_2", "name":"1 Line 2th"},
                {"code":"Defect1", "name":"1차 Defect"},
                {"code":"Tense1", "name":"1축"},
                {"code":"Line2_1", "name":"2 Line 1th"},
                {"code":"Line2_2", "name":"2 Line 2th"},
                {"code":"Tense2", "name":"2축"},
                {"code":"Line3_1", "name":"3 Line 1th"},
                {"code":"Line3_2", "name":"3 Line 2th"},
                {"code":"Tense3", "name":"3축"},
                {"code":"Line4_1", "name":"4 Line 1th"},
                {"code":"Line4_2", "name":"4 Line 2th"},
                {"code":"Tense4", "name":"4축"},
                {"code":"Line5_1", "name":"5 Line 1th"},
                {"code":"Line5_2", "name":"5 Line 2th"},
                {"code":"LineAg_1", "name":"Ag Line 1th"},
                {"code":"LineAg_2", "name":"Ag Line 2th"},
                {"code":"AirBlow", "name":"AIR BLOW 작동/접촉"},
                {"code":"BL", "name":"B/L"},
                {"code":"Bath", "name":"BATH WIRE 조각"},
                {"code":"Capstan", "name":"CAPSTAN이탈/회전"},
                {"code":"avgCuO", "name":"CuO 평균"},
                {"code":"avgCuO2", "name":"CuO2 평균"},
                {"code":"Curl", "name":"Curl"},
                {"code":"avgCuS", "name":"CuS 평균"},
                {"code":"Defect", "name":"Defect"},
                {"code":"DiesCode_Check", "name":"Dies Code확인"},
                {"code":"EL", "name":"E/L"},
                {"code":"FinalDies_Check", "name":"Final Dies 확인"},
                {"code":"Gas_Forming", "name":"Forming Gas"},
                {"code":"Gas_Cooling", "name":"Gas(냉각)"},
                {"code":"Gas_Heater", "name":"Gas(열처리)"},
                {"code":"Guide", "name":"Guide봉 (wire상태)"},
                {"code":"Mean", "name":"Mean"},
                {"code":"Reduction", "name":"Reduction"},
                {"code":"RMS_Check", "name":"RMS 센서"},
                {"code":"Roller_Check", "name":"Roller 이상"},
                {"code":"Surface", "name":"Wire Surface"},
                {"code":"WireVibration", "name":"Wire 떨림"},
                {"code":"WireContact", "name":"WIRE 접촉"},
                {"code":"DryTemper", "name":"건조로 온도"},
                {"code":"DryHeater", "name":"건조히터 온도"},
                {"code":"F_Length", "name":"길이"},
                {"code":"Dipping", "name":"냉각수 Dipping"},
                {"code":"AusDRCon", "name":"단독 농도(AusDR)"},
                {"code":"AgsDRCon", "name":"단독 농도(AgsDR)"},
                {"code":"sDRCon", "name":"단독 농도(sDR)"},
                {"code":"AusDRTemper", "name":"단독 온도(AusDR)"},
                {"code":"AgcDRTemper", "name":"단독 온도(AgsDR)"},
                {"code":"sDRTemper", "name":"단독 온도(sDR)"},
                {"code":"Dipping", "name":"세척수 DIPPING"},
                {"code":"Speed", "name":"속도"},
                {"code":"Vertical", "name":"수직입사/처짐방지(WIRE 상태)"},
                {"code":"Humid", "name":"습도"},
                {"code":"AucDRCon", "name":"신선(1차) 농도(AucDR)"},
                {"code":"AgcDRCon", "name":"신선(1차) 농도(AgcDR)"},
                {"code":"cDRCon", "name":"신선(1차) 농도(cDR)"},
                {"code":"AucDRTemper", "name":"신선(1차) 온도(AucDR)"},
                {"code":"AgcDRTemper", "name":"신선(1차) 온도(AgcDR)"},
                {"code":"cDR1Temper", "name":"신선(1차) 온도(cDR)"},
                {"code":"cFAEDRCon", "name":"신선(FAE) 농도"},
                {"code":"cFAEDRTemper", "name":"신선(FAE) 온도"},
                {"code":"cDR2Con", "name":"신선(중앙) 농도"},
                {"code":"cDR2Temper", "name":"신선(중앙) 온도"},
                {"code":"DROil", "name":"신선유 (수직입사)"},
                {"code":"Temper", "name":"온도"},
                {"code":"Temper1", "name":"온도(상/좌)"},
                {"code":"Temper2", "name":"온도(중)"},
                {"code":"Temper3", "name":"온도(하/우)"},
                {"code":"Tense", "name":"장력"},
                {"code":"Size", "name":"직경"},
                {"code":"UltraPure", "name":"초순수"},
                {"code":"UltraPureTemper", "name":"초순수 온도"}
            ]
        });


        var productTypeStore = Ext.create('Ext.data.Store', {
            fields: ['code', 'name'],
            data : [
                {"code":"1", "name":"GW"},
                {"code":"2", "name":"SW"},
                {"code":"3", "name":"CW"},
                {"code":"4", "name":"GW/SW"},
                {"code":"5", "name":"SB"}
            ]
        });

        this.typeStore = Ext.create('Ext.data.Store', {
            fields: ['code', 'name'],
            data : [
                {"code":"1", "name":"계수"},
                {"code":"2", "name":"계량"}
            ]
        });

        var search = [/*{
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
        },*/ /*{
            xtype: 'combo',
            name: 'v001',
            emptyText: '공정파트',
            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
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
            name: 'v000',
            emptyText: '제품구분',
            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
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
            }
        }, {
            xtype: 'combo',
            name: 'v012',
            emptyText: '타입',
            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
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
            }
        },*/{
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
        },{
            xtype: 'textfield',
            name: 'v010',
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
        }/*, {
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
        }*/
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
            text: CMD_SEARCH/*'검색'*/,
            tooltip: '조건 검색',
            handler: function () {
                // var items = searchToolbar.items.items;
                // for (var i = 0; i < items.length; i++) {
                //     var item = items[i];
                //     gm.me().testStore.getProxy().setExtraParam(item.name, item.value);
                // }
                gm.me().aX = null;
                gm.me().aY = null;
                gm.me().aMin_1 = null;
                gm.me().aMax_1 = null;
                gm.me().aMin_2 = null;
                gm.me().aMax_2 = null;
                gm.me().aMin_3 = null;
                gm.me().aMax_3 = null;
                gm.me().redrawSpc();
            }
        });


        var reportAction = Ext.create('Ext.Action', {
            iconCls: 'af-plus',
            text: '이상점보고',
            hidden: gMain.menu_check == true ? false : true,
            tooltip: '이상점을 보고합니다',
            handler: function () {

                var selection = gm.me().gridInspect.getSelectionModel().getSelection();

                if(selection.length > 0) {
                    gm.me().openMyWin(selection);
                } else {
                    Ext.Msg.alert('오류', '최소 하나 이상의 이상점을 선택하세요.');
                }
            }
        });

        var buttonToolbar = Ext.create('widget.toolbar', {
            cls: 'my-x-toolbar-default2',
            items: [action]
        });

        var buttonToolbar2 = Ext.create('widget.toolbar', {
            cls: 'my-x-toolbar-default2',
            items: [reportAction]
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
                    title: '실시간 SPC',
                    id: gu.id('result_spc'),
                    overflowY: 'auto',
                    frame: true,
                    collapsible: false,
                    region: 'center',
                    flex: 0.9,
                    margin: '5 0 0 0',
                    listeners: {
                        resize: function (element, info, eOpts) {
                            gm.me().tabSize = info;
                            gm.me().redrawSpc();
                        }
                    },
                    items: [
                        buttonToolbar,
                        //searchToolbar,
                        {
                            html: '<div style="height:200px;" id='
                            + gu.id('chartSpc1') + '></div><hr><div style="height:200px;" id='
                            + gu.id('chartSpc2') + '></div><hr><div style="height:200px;" id='
                            + gu.id('chartSpc3') + '></div>',
                            flex: 0.4
                        }
                    ]
                },
                {
                    title: '이상점 목록',
                    collapsible: true,
                    frame: true,
                    region: 'east',
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    flex: 0.7,
                    items: [buttonToolbar2, this.gridInspect]
                },
                //gridTest,
                //tabView
            ]
        });

        this.redrawSpc();


        this.callParent(arguments);


    },

    bodyPadding: 3,

    // defaults: {
    //     frame: true,
    //     bodyPadding: 10
    // },

    // autoScroll: true,
    // fieldDefaults: {
    //     labelWidth: 300 //Only Support this
    //     //labelWidth: "100"     //Doesn't render with 100 Pixel Size
    //     //labelWidth: "100px"	//Suffix with px won't work
    //     //, height:20
    // },
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
            case '상세보기':
                this.redrawHistDetail();
                break;
            case '전체보기':
                this.redrawHistOveral();
                break;
        }

    },
    curTabname: null,
    curHisname: null,
    redrawSpc: function () {

        this.testStore.getProxy().setExtraParam('v010_1', 'BL');
        this.v010_1 = 'BL';
        this.testStore.getProxy().setExtraParam('v010_2', 'EL');
        this.v010_2 = 'EL';
        this.testStore.getProxy().setExtraParam('v010_3', 'Temper');
        this.v010_3 = 'Temper';

        this.testStore.load(function(record) {

            var items_line1 = [];
            var items_line2 = [];
            var items_line3 = [];

            var minValue_line1 = 100000;
            var maxValue_line1 = 0;
            var minValue_line2 = 100000;
            var maxValue_line2 = 0;
            var minValue_line3 = 100000;
            var maxValue_line3 = 0;
            var line1_num = 0;
            var line2_num = 0;
            var line3_num = 0;

            gm.me().storeOutlier.removeAll();

            for(var i = 0; i < record.length; i++) {

                if(record[i].get('v002') == gm.me().v010_1) {

                    var errorList = "";

                    var outlierType = record[i].get('outlierList');
                    var keys = Object.keys(outlierType);
                    for(var k = 0; k < keys.length; k++) {
                        outlierType[Object.keys(outlierType)[k]];
                        switch(Object.keys(outlierType)[k]) {
                            case "POLICY1":
                                errorList += "1개의 점이 중심선으로부터 3σ 범위 밖에 있음, ";
                                break;
                            // case "POLICY2":
                            //     errorList += "9개의 연속된 점이 중심선으로부터 같은 쪽에 있음, ";
                            //     break;
                            case "POLICY3":
                                errorList += "9개의 연속된 점이 중심선으로부터 같은 쪽에 있음, ";
                                break;
                            // case "POLICY4":
                            //     errorList += "14개의 연속된 점이 교대로 상승 또는 하락, ";
                            //     break;
                            // case "POLICY5":
                            //     errorList += "3개의 점 중에서 2개의 점이 중심선으로부터 2σ 범위 밖에 있음(한쪽), ";
                            //     break;
                            // case "POLICY6":
                            //     errorList += "5개의 점 중에서 4개의 점이 중심선으로부터 1σ 범위 밖에 있음(한쪽), ";
                            //     break;
                            // case "POLICY7":
                            //     errorList += "15개의 연속된 점이 중심선으로부터 1σ 범위 내에 있음(양쪽), ";
                            //     break;
                            // case "POLICY8":
                            //     errorList += "8개의 연속된 점이 중심선으로부터 1σ 범위 밖에 있음(양쪽), ";
                            //     break;
                        }
                    }

                    var value = parseFloat(record[i].get('v001'));

                    if(errorList.length == 0) {
                        items_line1.push({
                            y: value,
                            date: record[i].get('v000')
                        });
                    } else {
                        items_line1.push({
                            y: value,
                            date: record[i].get('v000'),
                            error: errorList,
                            marker: {
                                symbol: 'diamond',
                                fillColor: '#f00',
                                lineColor: '#f00',
                                radius: 4,
                                states: {hover: {fillColor: '#f00', lineColor: '#f00', radius: 5}}
                            }
                        });


                        gm.me().storeOutlier.insert(line1_num, new Ext.data.Record(
                            {
                                "event_date" : record[i].get('v000'),
                                "url" : (line1_num+1),
                                "menu_key" : errorList
                            }
                        ));

                        gm.me().storeOutlier.sync();
                    }
                    // var ucl = record[i].get('UCL');
                    // var lcl = record[i].get('LCL');
                    //
                    // if(ucl > 0 && gm.me().aMax_1 != ucl) {
                    //     gm.me().aMax_1 = ucl;
                    // }
                    // if(lcl > 0 && gm.me().aMin_1 != lcl) {
                    //     gm.me().aMin_1 = lcl;
                    // }
                    // var aMax = gm.me().aMax_1;
                    // var aMin = gm.me().aMin_1;
                    //
                    // if(aMax > 0 && aMin >= 0 && aMax > aMin) {
                    //     maxValue_line1 = aMax;
                    //     minValue_line1 = aMin;
                    // }

                    maxValue_line1 = parseFloat(record[i].get('UCL'));
                    minValue_line1 = parseFloat(record[i].get('LCL'));

                    line1_num++;

                } else if (record[i].get('v002') == gm.me().v010_2) {

                    var errorList = "";

                    var outlierType = record[i].get('outlierList');

                    gu.getCmp('result_spc').setTitle('실시간 SPC : ' + record[i].get('pk'));

                    var keys = Object.keys(outlierType);
                    for(var k = 0; k < keys.length; k++) {
                        outlierType[Object.keys(outlierType)[k]];
                        switch(Object.keys(outlierType)[k]) {
                            case "POLICY1":
                                errorList += "1개의 점이 중심선으로부터 3σ 범위 밖에 있음, ";
                                break;
                            // case "POLICY2":
                            //     errorList += "9개의 연속된 점이 중심선으로부터 같은 쪽에 있음, ";
                            //     break;
                            case "POLICY3":
                                errorList += "9개의 연속된 점이 중심선으로부터 같은 쪽에 있음, ";
                                break;
                            // case "POLICY4":
                            //     errorList += "14개의 연속된 점이 교대로 상승 또는 하락, ";
                            //     break;
                            // case "POLICY5":
                            //     errorList += "3개의 점 중에서 2개의 점이 중심선으로부터 2σ 범위 밖에 있음(한쪽), ";
                            //     break;
                            // case "POLICY6":
                            //     errorList += "5개의 점 중에서 4개의 점이 중심선으로부터 1σ 범위 밖에 있음(한쪽), ";
                            //     break;
                            // case "POLICY7":
                            //     errorList += "15개의 연속된 점이 중심선으로부터 1σ 범위 내에 있음(양쪽), ";
                            //     break;
                            // case "POLICY8":
                            //     errorList += "8개의 연속된 점이 중심선으로부터 1σ 범위 밖에 있음(양쪽), ";
                            //     break;
                        }
                    }

                    var value = parseFloat(record[i].get('v001'));

                    if(errorList.length == 0) {
                        items_line2.push({
                            y: value,
                            date: record[i].get('v000')
                        });
                    } else {
                        items_line2.push({
                            y: value,
                            date: record[i].get('v000'),
                            error: errorList,
                            marker: {
                                symbol: 'diamond',
                                fillColor: '#f00',
                                lineColor: '#f00',
                                radius: 4,
                                states: {hover: {fillColor: '#f00', lineColor: '#f00', radius: 5}}
                            }
                        });


                        gm.me().storeOutlier.insert(line2_num, new Ext.data.Record(
                            {
                                "event_date" : record[i].get('v000'),
                                "url" : (line2_num+1),
                                "menu_key" : errorList
                            }
                        ));

                        gm.me().storeOutlier.sync();
                    }

                    // var ucl = record[i].get('UCL');
                    // var lcl = record[i].get('LCL');
                    //
                    // if(ucl > 0 && gm.me().aMax_2 != ucl) {
                    //     gm.me().aMax_2 = ucl;
                    // }
                    // if(lcl > 0 && gm.me().aMin_2 != lcl) {
                    //     gm.me().aMin_2 = lcl;
                    // }
                    //
                    // var aMax = gm.me().aMax_2;
                    // var aMin = gm.me().aMin_2;
                    //
                    // if(aMax > 0 && aMin >= 0 && aMax > aMin) {
                    //     maxValue_line2 = aMax;
                    //     minValue_line2 = aMin;
                    // }

                    maxValue_line2 = parseFloat(record[i].get('UCL'));
                    minValue_line2 = parseFloat(record[i].get('LCL'));

                    line2_num++;
                } else if (record[i].get('v002') == gm.me().v010_3) {

                    gu.getCmp('result_spc').setTitle('실시간 SPC : ' + record[i].get('pk') + ' / ' + record[i].get('mc_no'));

                    var errorList = "";

                    var outlierType = record[i].get('outlierList');

                    var keys = Object.keys(outlierType);
                    for(var k = 0; k < keys.length; k++) {
                        outlierType[Object.keys(outlierType)[k]];

                        switch(Object.keys(outlierType)[k]) {
                            case "POLICY1":
                                errorList += "1개의 점이 중심선으로부터 3σ 범위 밖에 있음, ";
                                break;
                            case "POLICY2":
                                errorList += "9개의 연속된 점이 중심선으로부터 같은 쪽에 있음, ";
                                break;
                            case "POLICY3":
                                errorList += "9개의 연속된 점이 중심선으로부터 같은 쪽에 있음, ";
                                break;
                            case "POLICY4":
                                errorList += "14개의 연속된 점이 교대로 상승 또는 하락, ";
                                break;
                            case "POLICY5":
                                errorList += "3개의 점 중에서 2개의 점이 중심선으로부터 2σ 범위 밖에 있음(한쪽), ";
                                break;
                            case "POLICY6":
                                errorList += "5개의 점 중에서 4개의 점이 중심선으로부터 1σ 범위 밖에 있음(한쪽), ";
                                break;
                            case "POLICY7":
                                errorList += "15개의 연속된 점이 중심선으로부터 1σ 범위 내에 있음(양쪽), ";
                                break;
                            case "POLICY8":
                                errorList += "8개의 연속된 점이 중심선으로부터 1σ 범위 밖에 있음(양쪽), ";
                                break;
                        }
                    }

                    var value = parseFloat(record[i].get('v001'));

                    if(errorList.length == 0) {
                        items_line3.push({
                            y: value,
                            date: record[i].get('v000')
                        });
                    } else {
                        items_line3.push({
                            y: value,
                            date: record[i].get('v000'),
                            error: errorList,
                            marker: {
                                symbol: 'diamond',
                                fillColor: '#f00',
                                lineColor: '#f00',
                                radius: 4,
                                states: {hover: {fillColor: '#f00', lineColor: '#f00', radius: 5}}
                            }
                        });


                        gm.me().storeOutlier.insert(line3_num, new Ext.data.Record(
                            {
                                "event_date" : record[i].get('v000'),
                                "url" : (line3_num+1),
                                "menu_key" : errorList
                            }
                        ));

                        gm.me().storeOutlier.sync();
                    }

                    // var ucl = record[i].get('UCL');
                    // var lcl = record[i].get('LCL');
                    //
                    // if(ucl > 0 && gm.me().aMax_3 != ucl) {
                    //     gm.me().aMax_3 = ucl;
                    // }
                    // if(lcl > 0 && gm.me().aMin_3 != lcl) {
                    //     gm.me().aMin_3 = lcl;
                    // }
                    //
                    // var aMax = gm.me().aMax_3;
                    // var aMin = gm.me().aMin_3;
                    //
                    // if(aMax > 0 && aMin >= 0 && aMax > aMin) {
                    //     maxValue_line3 = aMax;
                    //     minValue_line3 = aMin;
                    // }

                    maxValue_line3 = parseFloat(record[i].get('UCL'));
                    minValue_line3 = parseFloat(record[i].get('LCL'));

                    line3_num++;
                }
            }

            //UCL, LCL 데이터 없음
            // maxValue_line1 = 100;
            // minValue_line1 = 0;
            // maxValue_line2 = 100;
            // minValue_line2 = 0;
            // maxValue_line3 = 600;
            // minValue_line3 = 200;

            var gap1 = (maxValue_line1 - minValue_line1) / 6;

            var gap2 = (maxValue_line2 - minValue_line2) / 6;

            var gap3 = (maxValue_line3 - minValue_line3) / 6;

            var sections1 = [
                minValue_line1,
                minValue_line1 + gap1,
                minValue_line1 + (gap1 * 2),
                minValue_line1 + (gap1 * 3),
                minValue_line1 + (gap1 * 4),
                minValue_line1 + (gap1 * 5),
                maxValue_line1
            ];

            var sections2 = [
                minValue_line2,
                minValue_line2 + gap2,
                minValue_line2 + (gap2 * 2),
                minValue_line2 + (gap2 * 3),
                minValue_line2 + (gap2 * 4),
                minValue_line2 + (gap2 * 5),
                maxValue_line2
            ];

            var sections3 = [
                minValue_line3,
                minValue_line3 + gap3,
                minValue_line3 + (gap3 * 2),
                minValue_line3 + (gap3 * 3),
                minValue_line3 + (gap3 * 4),
                minValue_line3 + (gap3 * 5),
                maxValue_line3
            ];

            $('#' + gu.id('chartSpc1')).highcharts({
                chart: {
                    renderTo: 'control',
                    defaultSeriesType: 'line',
                    marginRight: 25,
                    marginLeft: 60,
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
                            var errorText = '<b>Flag: </b>' + this.point.error;
                        }
                        else {
                            var errorText = '';
                        }

                        var datetime = this.point.date;
                        var date_kr = datetime.substring(0, 2) + '시' + datetime.substring(2, 4) + '분' +
                                datetime.substring(4, 6) + '초';

                        return '<b>' + date_kr + '</b><br/>' +
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
                    plotLines: [{
                        value: minValue_line1,
                        color: 'rgba(162,29,33,.75)',
                        width: 1,
                        zIndex: 3
                    }, {
                        value: gap1,
                        color: 'rgba(24,90,169,.75)',
                        width: 1,
                        zIndex: 3
                    }, {
                        value: maxValue_line1,
                        color: 'rgba(162,29,33,.75)',
                        width: 1,
                        zIndex: 3
                    }],
                    title: {text: ''},
                    lineWidth: 0,
                    gridLineWidth: 1,
                    labels: {
                        format: '{value:,.2f}',
                    },
                    gridLineColor: 'rgba(24,90,169,.25)',
                    startOnTick: false,
                    endOnTick: false,
                    minPadding: 0,
                    maxPadding: 0,
                    min: minValue_line1 - ((maxValue_line1 - minValue_line1) / 6),
                    max: maxValue_line1 + ((maxValue_line1 - minValue_line1) / 6),
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
                    marginLeft: 60,
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
                            var errorText = '<b>Flag: </b>' + this.point.error;
                        }
                        else {
                            var errorText = '';
                        }
                        var datetime = this.point.date;
                        var date_kr = datetime.substring(0, 2) + '시' + datetime.substring(2, 4) + '분' +
                            datetime.substring(4, 6) + '초';

                        return '<b>' + date_kr + '</b><br/>' +
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
                    tickPositions: sections2,
                    plotLines: [{
                        value: minValue_line2,
                        color: 'rgba(162,29,33,.75)',
                        width: 1,
                        zIndex: 3
                    }, {
                        value: gap2,
                        color: 'rgba(24,90,169,.75)',
                        width: 1,
                        zIndex: 3
                    }, {
                        value: maxValue_line2,
                        color: 'rgba(162,29,33,.75)',
                        width: 1,
                        zIndex: 3
                    }],
                    title: {text: ''},
                    lineWidth: 0,
                    gridLineWidth: 1,
                    labels: {
                        format: '{value:,.2f}',
                    },
                    gridLineColor: 'rgba(24,90,169,.25)',
                    startOnTick: false,
                    endOnTick: false,
                    minPadding: 0,
                    maxPadding: 0,
                    min: minValue_line2 - ((maxValue_line2 - minValue_line2) / 6),
                    max: maxValue_line2 + ((maxValue_line2 - minValue_line2) / 6),
                },
                series: [{
                    name: 'Measure',
                    data: items_line2,
                }]
            });


            $('#' + gu.id('chartSpc3')).highcharts({
                chart: {
                    renderTo: 'control',
                    defaultSeriesType: 'line',
                    marginRight: 25,
                    marginLeft: 60,
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
                            var errorText = '<b>Flag: </b>' + this.point.error;
                        }
                        else {
                            var errorText = '';
                        }
                        var datetime = this.point.date;
                        var date_kr = datetime.substring(0, 2) + '시' + datetime.substring(2, 4) + '분' +
                            datetime.substring(4, 6) + '초';

                        return '<b>' + date_kr + '</b><br/>' +
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
                    tickPositions: sections3,
                    plotLines: [{
                        value: minValue_line3,
                        color: 'rgba(162,29,33,.75)',
                        width: 1,
                        zIndex: 3
                    }, {
                        value: gap3,
                        color: 'rgba(24,90,169,.75)',
                        width: 1,
                        zIndex: 3
                    }, {
                        value: maxValue_line3,
                        color: 'rgba(162,29,33,.75)',
                        width: 1,
                        zIndex: 3
                    }],
                    title: {text: ''},
                    lineWidth: 0,
                    gridLineWidth: 1,
                    labels: {
                        format: '{value:,.2f}',
                    },
                    gridLineColor: 'rgba(24,90,169,.25)',
                    startOnTick: false,
                    endOnTick: false,
                    minPadding: 0,
                    maxPadding: 0,
                    min: minValue_line3 - ((maxValue_line3 - minValue_line3) / 6),
                    max: maxValue_line3 + ((maxValue_line3 - minValue_line3) / 6),
                },
                series: [{
                    name: 'Measure',
                    data: items_line3,
                }]
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
                    //binsNumber: 100,
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
                this.redrawSpc();
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
    aMin_3: null,
    aMax_3: null,
    v010_1: null,
    v010_2: null,
    v010_3: null,
    openMyWin: function(selection) {

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
                                xtype: 'combo',
                                store: gm.me().processStore,
                                anchor: '90%',
                                name: 'occur_process',
                                valueField: 'code',
                                displayField: 'name'
                            }]
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
                            columns: 2,
                            tableAttrs: {
                                style: {
                                    width: '100%'
                                }
                            }
                        },
                        items: [{
                            fieldLabel: '관리도 Type',
                            xtype: 'combo',
                            anchor: '90%',
                            name: 'graph_type',
                            store: gm.me().typeStore,
                            valueField: 'code',
                            displayField: 'name'
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

                    }

                ]
            });

            var myWin = Ext.create('Ext.Window', {
                modal: true,
                title: '이상점보고',
                width: 640,
                height: 650,
                plain: true,
                items: form,
                buttons: [{
                    text: CMD_OK,
                    handler: function (btn) {

                        var form = gu.getCmp('formPanel2').getForm();

                        var val = form.getValues(false);

                        form.submit({
                            url : CONTEXT_PATH + '/xdview/spcMgmt.do?method=sendOutlier',
                            params:{
                            },
                            success: function(val, action){
                                if (myWin) {
                                    myWin.close();
                                }
                            },
                            failure: function(val, action){
                                if (myWin) {
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
