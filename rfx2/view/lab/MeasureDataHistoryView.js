Ext.define('Rfx2.view.lab.MeasureDataHistoryView', {
    extend: 'Ext.panel.Panel',
    xtype: 'measure-data-history-view',
    temper : 1,
    initComponent: function () {
        var fields = [];

        //Chart 환경설정
        Highcharts.theme = {
            colors: ['#3493DF',  /*'#084695', '#FFD57E', '#979797', '#AA4643', */ '#FF9655', '#FFF263', '#6AF9C4']
            ,credits: {
                enabled: false
            },
            lang: {
                thousandsSep: ',',
                decimalPoint: '.',

            }
        };
        Highcharts.setOptions(Highcharts.theme);

        var storeTemplate = Ext.create('Mplm.store.CubeStore', {});

        var storeInspect = Ext.create('Ext.data.Store', {
            autoLoad: false,
            fields: [{
                name: 'inst_name',
                type: 'string'
            }, {
                name: 'inst_date',
                type: 'string'
            }, {
                name: 'lot_no',
                type: 'string'
            }],
            data: [{
                inst_name: '테스트용 검사_C1000001',
                inst_date: '2018-06-11 11:30:30',
                lot_no: '김철수'
            }, {
                inst_name: '테스트용 검사_C1000002',
                inst_date: '2018-06-11 15:01:33',
                lot_no: '장영희'
            }]
        });

        this.storeContent = Ext.create('Mplm.store.MeasureDataStore', {});

        this.redrawHist();
        //this.redrawHistDetail();

        var gridTemplate = Ext.create('Ext.grid.Panel', {
            store: storeTemplate,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            bbar: getPageToolbar(storeTemplate),
            frame: false,
            layout: 'fit',
            forceFit: true,
            margin: '0 10 0 0',
            width: 200,
            columns: [{
                text: '검사명',
                dataIndex: 'name1'
            }]
        });

        storeTemplate.load();

        var gridInspect = Ext.create('Ext.grid.Panel', {
            store: storeInspect,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            bbar: getPageToolbar(storeInspect),
            frame: false,
            layout: 'fit',
            forceFit: true,
            margin: '0 10 0 0',
            flex: 1,
            columns: [{
                text: '검사명',
                dataIndex: 'inst_name'
            }, {
                text: '작성시간',
                dataIndex: 'inst_date'
            }, {
                text: '작성자',
                dataIndex: 'lot_no'
            }]
        });

        gridInspect.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                gu.getCmp('gridContent2').removeAll();

                //var storedata = gm.me().storeContent.data.items;

                var datas = ['DIAMETER', 'ROUNDNESS'];

                for (var i = 0; i < 2; i++) {
                    gu.getCmp('gridContent2').add({
                        xtype: "textarea",
                        name: "Text"+i,
                        height: 250,
                        fieldLabel: datas[i],
                        itemId: "Text"+i,
                        margin: '10px',
                        width: '100%'
                    });
                }

                gm.me().temper++;
            }
        });

        // var temp = {
        //     title: '검사 유형',
        //     collapsible: true,
        //     frame: true,
        //     region: 'west',
        //     layout: {
        //         type: 'hbox',
        //         pack: 'start',
        //         align: 'stretch'
        //     },
        //     margin: '0 0 0 0',
        //     flex: 1,
        //     items: [gridInspect]
        // };

        var gridContent = Ext.create('Ext.grid.Panel', {
            store: this.storeContent,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            bbar: getPageToolbar(this.storeContent),
            frame: false,
            reigon: 'east',
            layout: 'fit',
            forceFit: true,
            flex: 1,
            columns: this.columns
        });

        this.storeContent.load();

        // var gridContent2 = {
        //     //store: storeContent,
        //     cls: 'rfx-panel',
        //     id: gu.id('gridContent2'),
        //     collapsible: false,
        //     region: 'center',
        //     multiSelect: false,
        //     autoScroll: true,
        //     autoHeight: true,
        //     //bbar: getPageToolbar(storeContent),
        //     frame: true,
        //     layout: 'vbox',
        //     forceFit: true,
        //     margin: '0 10 0 0',
        //     flex: 1,
        //     title: '추가',
        //     items: fields
        // };

        // var itemApply = {
        //     frame: false,
        //     id: gu.id('gridContent'),
        //     region: 'east',
        //     tbar: {
        //         plugins: {
        //             boxreorderer: true
        //         },
        //         items: [
        //             {
        //                 xtype: 'tbtext',
        //                 id: 'label3',
        //                 text: ''
        //             },
        //             '->', {
        //                 iconCls: null,
        //                 glyph: 'f0c8@FontAwesome',
        //                 text: '추가',
        //                 handler: function () {
        //
        //                 }
        //             }, {
        //                 iconCls: null,
        //                 glyph: 'f0c7@FontAwesome',
        //                 text: '저장'
        //             }, {
        //                 iconCls: null,
        //                 glyph: 'f0c5@FontAwesome',
        //                 text: '복제하기'
        //             }, {
        //                 iconCls: null,
        //                 glyph: 'f12d@FontAwesome',
        //                 text: '초기화'
        //             }]
        //     },
        //     layout: {
        //         type: 'card'
        //     },
        //     margin: '0 0 0 0',
        //     flex: 1,
        //     items: [gridContent2],
        //     activeItem: 0
        // };

        var temp = {
            title: '상세내용',
            collapsible: false,
            frame: true,
            region: 'west',
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'stretch'
            },
            margin: '0 0 0 0',
            flex: 1.5,
            items: [gridContent]
        };

        var temp2 = {
            title: '분석도표&그래프',
            collapsible: false,
            frame: true,
            region: 'center',
            margin: '0 0 0 0',
            flex: 1,
            items: {
                title: '히스토그램',
                autoScroll: true,
                id: gu.id('chartHist1')
            }
        };

        Ext.apply(this, {
            layout: 'border',
            bodyBorder: false,
            defaults: {
                collapsible: false,
                split: true
            },
            items: [temp, temp2]
        });

        this.callParent(arguments);
        this.redrawHist();

    },

    bodyPadding: 10,

    defaults: {
        frame: true,
        bodyPadding: 10
    },

    autoScroll: true,
    fieldDefaults: {
        labelWidth: 300 //Only Support this
        //labelWidth: "100"     //Doesn't render with 100 Pixel Size
        //labelWidth: "100px"	//Suffix with px won't work
        //, height:20
    },
    items: null,
    redrawHistDetail: function() {

        var avr = this.getAver();

        $('#' + gu.id('chartHist1')).highcharts({
            title: {
                text: '평균: ' + Ext.util.Format.number(avr, '0,00.0000/i')
            },

            xAxis: [{
                title: { text: '' },
                alignTicks: false
            }, {
                title: { text: '' },
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
                title: { text: '' }
            }, {
                title: { text: '' },
                opposite: true
            }],
            plotOptions: {
                series: {
                    // general options for all series
                },
                histogram: {
                    //binsNumber: 100,
                    cropThreshold:500,
                    depth:250
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
    getAver: function() {
        var sum = 0;
        var cnt = 0;
        for(var i=0;i < this.sizeData.length; i++) {
            if(this.sizeData[i]>0) {
                sum = sum + this.sizeData[i];
                cnt++;
            }

        }
        return sum/cnt;
    },
    redrawHist: function() {

        var sum = 0;
        var cnt = 0;
        for(var i=0;i < this.sizeData.length; i++) {
            if(this.sizeData[i]>0) {
                sum = sum + this.sizeData[i];
                cnt++;
            }

        }
        var avr = sum/cnt;

        $('#' + gu.id('chartHist1')).highcharts({
            title: {
                text: '평균: ' + Ext.util.Format.number(avr, '0,00.0000/i')
            },

            xAxis: [{
                title: { text: '' },
                alignTicks: false
            }, {
                title: { text: '' },
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
                title: { text: '' }
            }, {
                title: { text: '' },
                opposite: true
            }],
            plotOptions: {
                series: {
                    // general options for all series
                },
                histogram: {
                    //binsNumber: 100,
                    cropThreshold:500,
                    depth:250
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
    sizeData : [
        0.2204	,
        0.2204	,
        0.2205	,
        0.2214	,
        0.2203	,
        0.2191	,
        0.2199	,
        0.2203	,
        0.2208	,
        0.22	,
        0.2199	,
        0.22	,
        0.2204	,
        0.2207	,
        0.2196	,
        0.2207	,
        0.2208	,
        0.2206	,
        0.2208	,
        0.2207	,
        0.2202	,
        0.2197	,
        0.2202	,
        0.2204	,
        0.2204	,
        0.2195	,
        0.2206	,
        0.2197	,
        0.2206	,
        0.2213	,
        0.2204	,
        0.2214	,
        0.2202	,
        0.2211	,
        0.2205	,
        0.2201	,
        0.2207	,
        0.2208	,
        0.2206	,
        0.2201	,
        0.2211	,
        0.2205	,
        0.2201	,
        0.2198	,
        0.22	,
        0.2201	,
        0.2198	,
        0.2201	,
        0.2206	,
        0.2202	,
        0.2198	,
        0.2206	,
        0.22	,
        0.2204	,
        0.2198	,
        0.2199	,
        0.2201	,
        0.2199	,
        0.2203	,
        0.2199	,
        0.2202	,
        0.2203	,
        0.2198	,
        0.2198	,
        0.2208	,
        0.2206	,
        0.2204	,
        0.2199	,
        0.2204	,
        0.2201	,
        0.2205	,
        0.2208	,
        0.2193	,
        0.2203	,
        0.2207	,
        0.2199	,
        0.2194	,
        0.221	,
        0.2198	,
        0.2213	,
        0.2197	,
        0.2205	,
        0.2196	,
        0.2204	,
        0.22	,
        0.2206	,
        0.2204	,
        0.2207	,
        0.2203	,
        0.2199	,
        0.2209	,
        0.2198	,
        0.2202	,
        0.2193	,
        0.2204	,
        0.2198	,
        0.2199	,
        0.22	,
        0.2196	,
        0.2202	,
        0.2204	,
        0.2196	,
        0.221	,
        0.2196	,
        0.2203	,
        0.2197	,
        0.2193	,
        0.2203	,
        0.2204	,
        0.2197	,
        0.2196	,
        0.2203	,
        0.2209	,
        0.2196	,
        0.2207	,
        0.2204	,
        0.2197	,
        0.2205	,
        0.2191	,
        0.2207	,
        0.2197	,
        0.2195	,
        0.2205	,
        0.2202	,
        0.2199	,
        0.2198	,
        0.2208	,
        0.2206	,
        0.2199	,
        0.219	,
        0.2205	,
        0.2203	,
        0.2208	,
        0.2206	,
        0.2209	,
        0.2207	,
        0.2196	,
        0.2206	,
        0.2202	,
        0.2207	,
        0.2204	,
        0.221	,
        0.2207	,
        0.2196	,
        0.2204	,
        0.2204	,
        0.2198	,
        0.2196	,
        0.2198	,
        0.2197	,
        0.2199	,
        0.2206	,
        0.2202	,
        0.2208	,
        0.2199	,
        0.2201	,
        0.2207	,
        0.221	,
        0.2205	,
        0.221	,
        0.2207	,
        0.2203	,
        0.2204	,
        0.2203	,
        0.2199	,
        0.2196	,
        0.2203	,
        0.2209	,
        0.2201	,
        0.2201	,
        0.2197	,
        0.2204	,
        0.2207	,
        0.2191	,
        0.2193	,
        0.2206	,
        0.2204	,
        0.2207	,
        0.2201	,
        0.22	,
        0.2201	,
        0.2206	,
        0.2206	,
        0.2192	,
        0.2203	,
        0.2202	,
        0.2212	,
        0.2194	,
        0.2202	,
        0.2207	,
        0.2201	,
        0.2202	,
        0.2204	,
        0.2202	,
        0.2194	,
        0.2202	,
        0.2208	,
        0.2209	,
        0.2199	,
        0.2208
    ]
});
