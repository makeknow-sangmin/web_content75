/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */
// supply details (as html) when creating
var testList = [];
var intervalRun = null;
var runningChartInfo = {};
var eChartViewChart;
var gmEchartView;
Ext.define('Rfx2.view.qualManage.EchartView', {
    extend: 'Ext.panel.Panel',
    xtype: 'echart-view',
    itemId: 'testId',
    // width         : 400,
    title: '상세보기',
    region: 'east',
    // collapsible   : true,
    // collapsed     : true,
    // titleCollapse : true,
    // bodyBorder    : true,
    // bodyPadding   : 15,
    // split         : true,
    // border        : false,
    // scrollable    : true,
    //cls           : 'ks-cmp',
    //html          : 'hello',
    testData: [],
    initComponent: function () {
        // console.log('@@@@@@@@@@@@@@@ vMC_EFIAST_LIST : ', vMC_EFIAST_LIST);
        var me = this;
        gmEchartView = this;
        Ext.apply(me, {
            //contentEl: 'chart-main',
            // tbar : [
            //     //'->',
            //     'Select source:'
            // ]
        });
        me.mcList = null;
        console.log('===================mcList : ', me.mcList);

        // testList = [];
        if (testList.length != 0) {
            console.log('clear List');
            testList = [];
        }

        // me.mcList.forEach(function (mc) {
        //     testList.push({
        //         key: mc.mc_code,
        //         value: mc.mc_name,
        //         propKey: mc.prop_key,
        //         mchnUid: mc.mchn_uid,
        //     });
        // });

        /* 
    // this.testData : [] 에 값을 넣고 dockedItems의 data에 넣는 테스트
    var testdatalist = [];
    me.mcList.forEach(function (mc) {
      testdatalist.push({
        key: mc.mc_code,
        value: mc.mc_name
      });
    });
    me.testData = testdatalist;
    console.log('*************************** me.testData', me.testData);
    // dockedItems 에서 this.testData로 불러와도 값을 찾지 못한다.
    */

        //me.addCls('details-panel
        me.callParent();
    },
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'top',
            cls: 'my-x-toolbar-default1-3-green',
            items: [
                {
                    fieldLabel: '설비 및 데이터 선택',
                    labelWidth: 150,
                    anchor: '100%',
                    width: 400,
                    xtype: 'combo',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['key', 'value', 'propKey', 'mchnUid'],
                        data: testList,
                    }),
                    emptyText: '데이터 선택',
                    editable: false,
                    displayField: 'value',
                    valueField: 'key',
                    // hiddenName: 'time_estimate',
                    listConfig: {
                        loadingText: 'Searching...',
                        emptyText: 'No matching posts found.',

                        getInnerTpl: function () {
                            return '<div data-qtip="{key}">{value}</div>';
                        },
                    },
                    listeners: {
                        select: function (combo, record) {
                            console.log('========================== record', record.data);

                            // console.log('========================== this', this);
                            // this가 combo 가 된다.

                            runningChartInfo.propKey = record.data.propKey;
                            runningChartInfo.mchnUid = record.data.mchnUid;

                            var chartInfo = {
                                propKey: record.data.propkey,
                                mchnUid: record.data.mchnUid,
                            };

                            var docu = document.getElementById('chartId');
                            if (docu) {
                                console.log('!!!!! intervalRun : ', intervalRun);
                                if (intervalRun != null) {
                                    console.log('!!!!! ClearInterval intervalRun');
                                    clearInterval(intervalRun);
                                }

                                this.ownerCt.ownerCt.drawChartBoot('chartId');
                                resizeChart();
                                setTimeout(function () {
                                    eChartViewChart.resize();
                                }, 100);
                            } else {
                                console.log('do not have docu');
                                this.ownerCt.ownerCt.drawChartBoot('chartId');
                            }

                            // drawChart(record.data.key);

                            /* ownerCt 말고 id 사용 , 권장 하지 않음 
            // var parent = Ext.ComponentQuery.query('echart-view')[0];
            // parent.drawChart('chartId');
            */
                        },
                    },
                },
                {
                    xtype: 'tbspacer',
                    width: 100,
                },
                {
                    xtype: 'button',
                    text: '명령어 전송',
                    tooltip: '명령어 전송',
                    glyph: 'F0A9@FontAwesome',
                    handler: function () {
                        gmEchartView.testFunc();
                    },
                },
            ],
        },
    ],
    items: [
        {
            xtype: 'panel',
            html: '<div id="chartId" style="width: 100%; height: 100%;"></div>',
        },
    ],

    drawChart: function (chartId) {
        var docu = document.getElementById('chartId');
        // if(docu) {
        //   alert('있음');
        //   // docu.parentNode.removeChild(docu);
        //   // this.ownerCt.items.shift();
        //   console.log('this.items',this.items.items);
        //   // this.items.items.shift();
        //   console.log('this.items',this.items.items);
        // }else {
        //   alert('X');
        // }
        chartId = 'chartId';

        var me = this;

        console.log('========================= me >', me);
        var datas = [];
        datas = me.getEchartProps(100290);
        datas = Ext.JSON.decode(datas.responseText).datas;
        datas.pop();

        // var datas = Ext.JSON.decode(me.getEchartProps().responseText).datas;
        // var datas = vMC_EFIAST_LIST;
        console.log('*********************> datas', datas);

        var propsName = [];
        datas.forEach(function (datas) {
            propsName.push(datas.prop_name);
        });

        var app = {};
        // DOM을 준비하고 echart 객체를 만듭니다.
        var main = document.getElementById(chartId);
        console.log('========================= main >', main);
        console_logs('=================> main', chartId);
        if (main == null) {
            Ext.Msg.alert('Load failed', chartId + ' div를 찾을 수 없습니다.');

            return;
        }

        var myChart = echarts.init(main);

        console_logs('myChart', myChart);

        myChart.showLoading({
            text: '잠시만 기다려주세요....',
        });

        var option = {
            title: {
                text: datas[0].mchn_code,
                subtext: datas[0].prop_name,
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#283b56',
                    },
                },
            },
            legend: {
                data: [],
            },
            toolbox: {
                show: true,
                feature: {
                    dataView: {
                        readOnly: false,
                    },
                    restore: {},
                    saveAsImage: {},
                },
            },
            dataZoom: {
                show: false,
                start: 0,
                end: 100,
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: true,
                    data: (function () {
                        var now = new Date();
                        var res = [];
                        var len = 10;
                        while (len--) {
                            res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''));
                            now = new Date(now - 2000);
                        }
                        return res;
                    })(),
                },
                {
                    type: 'category',
                    boundaryGap: true,
                    data: (function () {
                        var res = [];
                        var len = 10;
                        while (len--) {
                            res.push(10 - len - 1);
                        }
                        return res;
                    })(),
                },
            ],
            yAxis: [],
            series: [],
        };

        datas.forEach(function (data) {
            console.log('forEachS', data);
            option.legend.data.push(data.prop_name);

            option.series.push({
                name: data.prop_name,
                type: data.chart_type,
                data: (function () {
                    var res = [];
                    var len = 0;
                    while (len < 10) {
                        res.push((Math.random() * 10 + 5).toFixed(1) - 0);
                        len++;
                    }
                    return res;
                })(),
            });

            option.yAxis.push({
                type: 'value',
                scale: true,
                name: `${data.prop_name}(${data.prop_unit})`,
                max: data.prop_maxval,
                min: data.prop_minval,
                boundaryGap: [0.2, 0.2],
            });
        });

        console_logs('option', option);
        app.count = 11;

        var i = 1;
        var last_id = 'null';

        intervalRun = setInterval(function () {
            console_log(app.count, option);
            var axisData = new Date().toLocaleTimeString().replace(/^\D*/, '');

            var data0 = option.series[0].data;
            // var data1 = option.series[1].data;
            var propKey = datas[0].prop_key;

            var baseUrl = 'http://112.223.242.74:19023/get?';
            // var resultUrl = `${baseUrl}${this.mcCodeStr}=${datas[0].mchn_code}.T&${this.intervalStr}=${datas[0].time_interval}&${this.lastIdStr}=${this.lastIdValue}`;
            var resultUrl = `${baseUrl}mc_code=${datas[0].mchn_code}.${propKey}&interval=${datas[0].time_interval}&last_id=${last_id}`;
            if(vCompanyReserved4 == 'SJFB01KR') {
                baseUrl = 'http://iot.hosu.io:9023/get?';
                // resultUrl = `${baseUrl}mc_code=sjfb01kr.${datas[0].mchn_code}.${propKey}&interval=${datas[0].time_interval}&last_id=${last_id}`;
                resultUrl = `${baseUrl}mc_code=sjfb01kr.${datas[0].mchn_code}.${propKey}&interval=${datas[0].time_interval}`;
            }


            // Redis Data Ajax 요청
            Ext.Ajax.request({
                url: resultUrl,
                // url: `http://192.168.10.245/get?key=${}` + i,
                method: 'GET',
                cors: true,
                useDefaultXhrHeader: false,

                disableCaching: true,
                success: function (response) {
                    var api = Ext.decode(response.responseText);
                    api.shift(); //0번째 중복 제거
                    // console.log('===========================> api', api);
                    // console.log('Object.keys(api) =======> ' , Object.keys(api));
                    // var a = Object.keys(api)[0];
                    // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', a);
                    // option.yAxis[0].name = a;
                    data0.shift();
                    // data0.push(api.temp);
                    var resultData = me.calData(datas[0].prop_cal_type, api);
                    console.log('============== api datas : ', api);
                    console.log('============== last id : ', api[api.length - 1][0]);
                    data0.push(resultData);
                    console.log('=============================> push Data Value', resultData);
                    console.log('================== before last_id', last_id);
                    try {
                        last_id = api[api.length - 1][0];
                        console.log('================== after last_id', last_id);
                    } catch(e) {
                        console_logs('e', e);
                    }

                    // console.log('=============================> api.temp', api.temp);
                    // data1.shift();
                    // data1.push(api.volt);

                    //success response value
                },
                failure: function (response) {
                    //fail response value
                    return;
                },
            });

            // this.intervalRun;

            option.xAxis[0].data.shift();
            option.xAxis[0].data.push(axisData);
            option.xAxis[1].data.shift();
            option.xAxis[1].data.push(app.count++);

            myChart.hideLoading();
            myChart.setOption(option);

            i = i + 1;
        }, datas[0].time_interval * 1000);
        //datas[0].timestamp * 1000

        clearInterval();
    },

    drawChartBoot: function (chartId) {
        console.log('testList.length drawChartBoot', testList.length);
        chartId = 'chartId';

        var me = this;

        console.log('========================= me >', me);
        var datas = [];
        // datas = me.getEchartProps(100290, 'T');
        datas = me.getEchartProps(runningChartInfo.mchnUid, runningChartInfo.propKey);
        if(datas!=null) {
            datas = Ext.JSON.decode(datas.responseText).datas;
        } else {
            
        }

        if(datas!=null) {
            if (datas.length > 1) {
                datas.pop();
            }    
        }

        console.log('*********************> datas', datas);

        var propsName = [];

        if(datas!=null) {
            datas.forEach(function (datas) {
                propsName.push(datas.prop_name);
            });
        }

        var app = {};
        // DOM을 준비하고 echart 객체를 만듭니다.
        var main = document.getElementById(chartId);
        console.log('========================= main >', main);
        console_logs('=================> main', chartId);
        if (main == null) {
            Ext.Msg.alert('Load failed', chartId + ' div를 찾을 수 없습니다.');

            return;
        }

        var myChart = echarts.init(main);
        eChartViewChart = myChart;

        console_logs('myChart', myChart);

        myChart.showLoading({
            text: '잠시만 기다려주세요....',
        });

        var option = {
            title: {
                text: datas[0].mchn_code,
                subtext: datas[0].prop_name,
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#283b56',
                    },
                },
            },
            legend: {
                data: [],
            },
            toolbox: {
                show: true,
                feature: {
                    dataView: {
                        readOnly: false,
                    },
                    restore: {},
                    saveAsImage: {},
                },
            },
            dataZoom: {
                show: false,
                start: 0,
                end: 100,
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: true,
                    data: (function () {
                        var now = new Date();
                        var res = [];
                        var len = 10;
                        while (len--) {
                            // res.unshift(now.toLocaleTimeString().replace(/^\D*/, ""));
                            // now = new Date(now - 2000);
                            res.push('-');
                        }
                        return res;
                    })(),
                },
                {
                    type: 'category',
                    boundaryGap: true,
                    data: (function () {
                        var res = [];
                        var len = 10;
                        while (len--) {
                            // res.push(10 - len - 1);
                            res.push('-');
                        }
                        return res;
                    })(),
                },
            ],
            yAxis: [],
            series: [],
        };

        datas.forEach(function (data) {
            console.log('forEachS', data);
            option.legend.data.push(data.prop_name);

            option.series.push({
                name: data.prop_name,
                type: data.chart_type,
                data: (function () {
                    var res = [];
                    var len = 0;
                    while (len < 10) {
                        // res.push((Math.random() * 10 + 5).toFixed(1) - 0);
                        res.push(0);
                        len++;
                    }
                    return res;
                })(),
            });

            option.yAxis.push({
                type: 'value',
                scale: true,
                name: `${data.prop_name}(${data.prop_unit})`,
                max: data.prop_maxval,
                min: data.prop_minval,
                boundaryGap: [0.2, 0.2],
            });
        });

        console_logs('option', option);
        app.count = 0;

        var i = 1;
        var last_id = 'null';
        var endCount = 0;

        intervalRun = setInterval(function () {
            console_log(app.count, option);
            var axisData = new Date().toLocaleTimeString().replace(/^\D*/, '');

            var data0 = option.series[0].data;
            // var data1 = option.series[1].data;
            var propKey = datas[0].prop_key;

            var baseUrl = 'http://112.223.242.74:19023/get?';
            // var resultUrl = `${baseUrl}${this.mcCodeStr}=${datas[0].mchn_code}.T&${this.intervalStr}=${datas[0].time_interval}&${this.lastIdStr}=${this.lastIdValue}`;
            var resultUrl = `${baseUrl}mc_code=${datas[0].mchn_code}.${propKey}&interval=${datas[0].time_interval}&last_id=${last_id}`;

            if(vCompanyReserved4 == 'SJFB01KR') {
                baseUrl = 'http://iot.hosu.io:9023/get?';
                resultUrl = `${baseUrl}mc_code=sjfb01kr.${datas[0].mchn_code}.${propKey}&interval=${datas[0].time_interval}&last_id=${last_id}`;
            }

            console.log(`==========> before endCount : `, endCount);

            // Redis Data Ajax 요청
            Ext.Ajax.request({
                url: resultUrl,
                // url: `http://192.168.10.245/get?key=${}` + i,
                method: 'GET',
                cors: true,
                useDefaultXhrHeader: false,

                disableCaching: true,
                // console.log('api', api);
                //   if(!api.length) {
                //     clearInterval(intervalRun);
                //     Ext.Msg.alert('데이터가 없어 차트를 종료합니다.');
                //   }else {
                //     api.shift(); //0번째 중복 제거
                //   }
                success: function (response) {
                    var api = Ext.decode(response.responseText);
                    console.log('api', api);
                    console.log('api length', api.length - 1);
                    var apiLength = api.length - 1;
                    if (!apiLength) {
                        endCount++;
                        console.log('=============> endCount : ', endCount);
                        /*
                        if (endCount > 10) {
                            clearInterval(intervalRun);
                            Ext.Msg.alert('차트 종료', '데이터가 없어 차트를 종료합니다.');
                            return;
                        }*/
                        // return;
                    } else {
                        endCount = 0;
                        api.shift(); //0번째 중복 제거
                    }
                    data0.shift();
                    // data0.push(api.temp);
                    var resultData = 0;
                    if (apiLength) {
                        resultData = me.calData(datas[0].prop_cal_type, api);
                        console.log('============== api datas : ', api);
                        console.log('============== last id : ', api[api.length - 1][0]);
                    }
                    data0.push(resultData);
                    console.log('=============================> push Data Value', resultData);
                    console.log('================== before last_id', last_id);
                    try {
                        last_id = api[api.length - 1][0];
                        console.log('================== after last_id', last_id);
                    } catch (e) {
                        console_logs('e', e);
                    }

                    // console.log('=============================> api.temp', api.temp);
                    // data1.shift();
                    // data1.push(api.volt);

                    //success response value
                },
                failure: function (response) {
                    //fail response value
                    return;
                },
            });

            // this.intervalRun;

            option.xAxis[0].data.shift();
            option.xAxis[0].data.push(axisData);
            option.xAxis[1].data.shift();
            option.xAxis[1].data.push(app.count++);

            myChart.hideLoading();
            myChart.setOption(option);

            i = i + 1;
        }, datas[0].time_interval * 1000);
        //datas[0].timestamp * 1000

        clearInterval();
    },

    getEchartProps: function (mchnUid, propKey) {
        return Ext.Ajax.request({
            url: `../../../equipment/getChartForm.do?method=getChartConfig`,
            method: 'GET',
            async: false,
            // cors: true,
            // useDefaultXhrHeader : false,
            // disableCaching: false,

            params: {
                mchnUid: mchnUid,
                propKey: propKey,
            },
            success: function (res) {
                var result = Ext.JSON.decode(res.responseText);
            },
            failure: function () {
                alert('error');
            },
        });
    },

    calData: function (propCalType, datas) {
        if (propCalType == 'sum') {
            console.log('=======================> this.sumData(datas) : ', this.sumData(datas));
            return this.sumData(datas);
        } else {
            console.log('=======================> this.sumData(datas) / datas.length : ', this.sumData(datas) / datas.length);
            return this.sumData(datas) / datas.length;
        }
    },

    sumData: function (datas) {
        this.checkDuplicate(datas);
        var result = 0;
        datas.forEach(function (data) {
            // console.log(data);
            result += parseFloat(data[1][1]);
        });
        console.log('****************** result => ', result);
        return result;
    },

    checkDuplicate: function (datas) {
        var flag = false;
        for (var i = 0; i < datas.length; i++) {
            for (var j = i + 1; j < datas.length; j++) {
                // console.log(datas[i][0]);
                // console.log(datas[j][0]);
                if (datas[i][0] == datas[j][0]) {
                    console.log('중복 검출');
                }
            }
        }
    },

    stopInterval: function () {
        if (intervalRun) {
            clearInterval(intervalRun);
            console.log('** stopInterval running, Clear intervalRun');
        } else {
            console.log('** stopInterval running, but intervalRun is not define');
        }
    },

    onResize: function () {
        if (eChartViewChart) {
            console.log('EchartView onResize');
            resizeChart();
            setTimeout(function () {
                eChartViewChart.resize();
            }, 300);
        }
    },

  
});

function resizeChart() {
    var docu = document.getElementsByClassName('x-panel-body x-panel-body-default x-panel-body-default x-noborder-trbl');
    var docu2 = document.getElementsByClassName('x-panel x-panel-default');
    console.log(docu);
    console.log(docu2);

    var chartHeight = docu[0].style.height;
    var chart = document.getElementById('chartId');
    docu[1].style.height = chartHeight;
    docu2[2].style.height = chartHeight;
    chart.style.height = chartHeight;
    console.log(chartHeight);
}

// window.onbeforeunload = function() {
//   return 'dd';
// }

// window.onhashchange = function() {
//   return 'ww';
// }
