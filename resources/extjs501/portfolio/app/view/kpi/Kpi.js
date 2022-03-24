/**
 * This view is the primary, KPI (Key Performance Indicators) view.
 */
Ext.define('ExecDashboard.view.kpi.Kpi', {
    extend: 'Ext.panel.Panel',
    xtype: 'kpi',
    
    itemId: 'kpi', // for setActiveTab(id)

    cls: 'kpi-main',

    requires: [
        'Ext.chart.axis.Numeric',
        'Ext.chart.axis.Category',
        'Ext.chart.series.Area',
        'Ext.chart.series.Pie',
        'Ext.chart.interactions.PanZoom',
        'Ext.chart.interactions.Rotate'
    ],

    config: {
        activeState: null,
        defaultActiveState: 'clicks'
    },

    controller: 'kpi',

    viewModel: {
        type: 'kpi'
    },

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    overflowY: 'auto',
    minWidth: 600,
    initView: function() {
    	var topBoard = {
	        xtype: 'component',
	        cls: 'kpi-tiles',
	        height: 100,
	
	        tpl: [
	            '<div class="kpi-meta">',
	                '<tpl for=".">',
	                    '<span>',
	                        '<div>{statistic}</div> {description}',
	                    '</span>',
	                '</tpl>',
	            '</div>'
	        ],
	
	        data: [{
	            description: '가수주 건수',
	            statistic: '3'
	        },{
	            description: '수주 건수',
	            statistic: '15'
	        },{
	            description: '수주 금액(백만 원)',
	            statistic: '6,200'
	        },{
	            description: '매출액(백만 원)',
	            statistic: '90,200'
	        },{
	            description: '매출이익률',
	            statistic: '22.3%'
	        }]
	
	    };//endofheadercomponent
    	this.add(topBoard);
    	
    	var mainChart = 
    	{
	        reference: 'mainChart',
	        xtype: 'chart',
	        flex: 1,
	        interactions: [{
	            type: 'panzoom',
	            zoomOnPanGesture: false,
	            axes: {
	                left: {
	                    maxZoom: 1
	                }
	            }
	        }],
	        cls: 'kpi-main-chart',
	        bind: '{kpiMain}',
	        minHeight: 290,
	        animation: true,
//	       legend: {
//	            position: 'right',
//	            boxStrokeWidth: 0,
//	            labelFont: '12px Tahoma'
//	        },
	        insetPadding: '40px 40px 20px 30px',
	
	        tbar: {
	            cls: 'kpi-toolbar',
	
	            defaults: {
	                toggleHandler: 'onToggleKpi'
	            },
	
	            items: [
//	            	{
//	                xtype: 'container',
//	                cls: 'kpi-chart-title',
//	                html: '실시간 영업지표'
//	            },
	            {
	                ui: 'kpi',
	                text: '월별',
	                //filter: 'clicks',
	                toggleGroup: 'kpiSapn',
	                //reference: 'clicks',
	                allowDepress: false,
	                pressed: true,
	                dataIndex: 0
	            },{
	                ui: 'kpi',
	                text: '분기별',
	                //filter: 'redemption',
	                //reference: 'redemption',
	                toggleGroup: 'kpiSapn',
	                allowDepress: false,
	                dataIndex: 1
	            },{
	                ui: 'kpi',
	                text: '연간',
	                //filter: 'redemption',
	                //reference: 'redemption',
	                toggleGroup: 'kpiSapn',
	                allowDepress: false,
	                dataIndex: 1
	            },
	            '->', {
	                xtype: 'label',
	                html: '<span style="background:#FCD2D6;font-weight:bold;padding:4px;font-size:12px;font-color:#777777;border:#F1495B 1px solid;">계획</span>'
	            }
	            , {
	                xtype: 'label',
	                html: '<span style="background:#C8F1FB;font-weight:bold;padding:4px;font-size:12px;font-color:#777777;border:#22C6EF 1px solid;">실적</span>'
	            },
	            '-',
	            {
	                ui: 'kpi',
	                text: '가수주',
	                filter: 'redemption',
	                reference: 'redemption',
	                toggleGroup: 'kpi',
	                allowDepress: false,
	                dataIndex: 1
	            },{
	                ui: 'kpi',
	                text: '수주',
	                filter: 'sales',
	                reference: 'sales',
	                toggleGroup: 'kpi',
	                allowDepress: false,
	                dataIndex: 2
	            },{
	                ui: 'kpi',
	                text: '매출',
	                filter: 'goalsmet',
	                reference: 'goalsmet',
	                margin: 0,
	                toggleGroup: 'kpi',
	                allowDepress: false,
	                pressed: true,
	                dataIndex: 1
	            }]
	        },//endoftbar
	
	        axes: [{
	            type: 'numeric',
	            position: 'left',
	            fields: ['data1'],
	            fontSize: 12,
	            grid: true,
	            minimum: 0
	        }, {
	            type: 'category',
	            position: 'bottom',
	            fields: ['name']
	        }],
	
	        series: [
	//			{
	//                type: 'bar',
	//                axis: 'left',
	//                xField: 'name',
	//	            title: ['실적', '목표'],
	//	            yField: ['data1', 'data2'],
	//                style: {
	//                    opacity: 0.80
	//                },
	//                highlight: {
	//                    fill: '#000',
	//                    'stroke-width': 20,
	//                    stroke: '#fff'
	//                },
	//                tips: {
	//                    trackMouse: true,
	//                    style: 'background: #FFF',
	//                    height: 20,
	//                    renderer: function(storeItem, item) {
	//                        this.setTitle(storeItem.get('month') + ': ' + storeItem.get('data1') + '%');
	//                    }
	//                }
	//            }    	
	        	{
		            type: 'bar',
		            subStyle: {
		                stroke: ['rgb(34,198,239)','rgb(241,73,91)'],
		                fill: ['rgba(34,198,239,0.25)', 'rgba(241,73,91,0.25)'],
		                'stroke-width': 3
		            },
		            xField: 'name',
		            title: ['실적', '목표'],
		            yField: ['data1', 'data2']
	//	            ,highlight: {
	//                    fill: '#000',
	//                    'stroke-width': 20,
	//                    stroke: '#fff'
	//                }
	//                ,tips: {
	//                    trackMouse: true,
	//                    style: 'background: #FFF',
	//                    height: 20,
	//                    renderer: function(storeItem, item) {
	//                        this.setTitle(storeItem.get('month') + ': ' + storeItem.get('data1') + '%');
	//                    }
	//                }
	        	}
	        
	        
	        
	        
	        ]
	    };//endofmainchart
    	
	    
	    
//	    Ext.define('CardTabs', {
//		    extend: 'Ext.tab.Panel',
//		    requires: [
//		        'Ext.layout.container.Card'
//		    ],
//		    xtype: 'layout-cardtabs',
//		
//		    style: 'background-color:#dfe8f6; ',
//             cls: 'quarterly-chart',
//	        flex: 1,
//	        insetPadding: '40px 40px 20px 30px',
//	        margin: '20, 20, 20, 20',
//		    defaults: {
//		        //bodyPadding: 15
//		    },
//		
//		    items:[
//			mainChart
//		    ]
//		    
//		
//		});
//    	
//    	var tabView = Ext.create('CardTabs', {});
	    
    	this.add(mainChart);
    	
    	var metaChart = {
	        height: 230,
	        cls: 'kpi-meta-charts',
	
	        layout: {
	            type: 'hbox',
	            align: 'stretch'
	        },
	
	        items: [{
	            title: '가동률',
	
	            margin: '0 10px 0 20px',
	            width: 280,
	            bodyCls: 'redemption-body',
	
	            layout: {
	                type: 'vbox',
	                align: 'stretch'
	            },
	
	            items: [{
	                xtype: 'container',
	                layout: {
	                    type: 'hbox',
	                    align: 'stretch'
	                },
	                flex: 1,
	                items:[{
	                    xtype: 'polar',
	                    flex: 1,
	                    animation: true,
	                    padding: '10px 0 10px 10px',
	                    donut: true,
	                    interactions: ['rotate'],
	                    colors: ['#2ac8ef', '#ececec'],
						animation: true,
	                    store: {
	                      fields: ['name', 'data1'],
	                      data: [
	                          { name: 'metric one', data1: 25 },
	                          { name: 'metric two', data1: 75 }
	                      ]
	                    },//endofstore
	
	                    sprites: [{
	                        type: 'text',
	                        animation: true,
	                        x: 40,
	                        y: 71,
	                        text: '25%',
	                        font: '30px 300 Proxima Nova, Helvetica Neue, Helvetica, Arial, sans-serif',
	                        fillStyle: '#69708a'
	                    }],
	
	                    series: [{
	                        type: 'pie',
	                        animation: true,
	                        xField: 'data1',
	                        colors: ['#2ac8ef', '#ececec'],
	                        donut: 85
	                    }]
	                },{
	                    xtype: 'polar',
	                    flex: 1,
	                    padding: '10px 10px 10px 0',
	                    animation: true,
	                    donut: true,
	                    interactions: ['rotate'],
	                    colors: ['#11c897', '#ececec'],
	
	                    store: {
	                      fields: ['name', 'data1'],
	                      data: [
	                          { name: 'metric one', data1: 50 },
	                          { name: 'metric two', data1: 50 }
	                      ]
	                    },
	
	                    sprites: [{
	                        type: 'text',
	                        animation: true,
	                        x: 40,
	                        y: 71,
	                        text: '50%',
	                        font: '30px 300 Proxima Nova, Helvetica Neue, Helvetica, Arial, sans-serif',
	                        fillStyle: '#69708a'
	                    }],
	
	                    series: [{
	                        type: 'pie',
	                        animation: true,
	                        xField: 'data1',
	                        colors: ['#11c897', '#ececec'],
	                        donut: 85
	                    }]
	                }]
	            }//endofpie
	            , {
	                xtype: 'label',
	                html: '<span>설비가동률</span><span>1,024</span>',
	                cls: 'kpi-in-store'
	            }//endofinstore
	            , {
	                xtype: 'label',
	                html: '<span>인력가동률</span><span>20,678</span>',
	                cls: 'kpi-online'
	            }]
	        }//endofredemption
	        
	        ,{
	            xtype: 'panel',
	            bodyCls: 'statistics-body',
	            margin: '0 20px 0 0',
	            flex: 1,
	            title: '연간 목표',
	            tpl: [
	                '<div class="statistic-header">영업현황</div>',
	                '<tpl for=".">',
	                    '<div class="statistic-tag {status}">{label}</div>',
	                    '<div class="statistic-description">{description}</div>',
	                    '<div class="sparkline">',
	                        '<div class="sparkline-inner sparkline-inner-{status}" style="width: {[values.ratio * 100]}%;"></div>',
	                    '</div>',
	                '</tpl>'
	            ],
	            data: [{
	                status: 'paused',
	                label: '매출목표',
	                description: '2014 매출목표 : 124,300,000',
	                ratio: 0.8
	            },{
	                status: 'active',
	                label: '이익목표',
	                description: '2014 이익목표, 21,300,000',
	                ratio: 0.6
	            },{
	                status: 'ended',
	                label: '프로젝트',
	                description: '목표 건수, 50',
	                ratio: 0.5
	            }]
	        }//endofstatistics
	        
	        ]
	    };
    	
    	this.add(metaChart);
    	
    	
    	
    },

    items: [ ],//endofpanelitems:vbox

    validStates: {
        clicks: 1,
        redemption: 1,
        sales: 1,
        goalsmet: 1
    },

    isValidState: function (state) {
        return state in this.validStates;
    }
});
