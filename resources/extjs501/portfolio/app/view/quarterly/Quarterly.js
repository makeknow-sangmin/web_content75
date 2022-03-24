Ext.define('ExecDashboard.view.quarterly.Quarterly', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.quarterly',

    requires: [
        'Ext.chart.axis.Time',
        'Ext.chart.series.CandleStick',
        'Ext.chart.series.Line',
        'Ext.chart.axis.Numeric',
        'Ext.draw.modifier.Highlight',
        'Ext.chart.axis.Time',
        'Ext.chart.interactions.ItemHighlight',
        'Ext.chart.interactions.PanZoom'
    ],

    itemId: 'quarterly',
    initChart: function() {
    	var myData = [
            ['현대'],
            ['삼성'],
            ['LG'],
            ['Apple'],
            ['현대자동차'],
            ['General Motors'],
            ['IBM'],
            ['Intel'],
            ['폭스바겐'],
            ['Microsoft'],
            ['Verizon'],
            ['방산청']
        ];

        for (var i = 0, l = myData.length, rand = Math.random; i < l; i++) {
            var data = myData[i];
            data[1] = Ext.util.Format.number(((rand() * 10000) >> 0) / 100, "0");
            data[2] = ((rand() * 10000) >> 0) / 100;
            data[3] = ((rand() * 10000) >> 0) / 100;
            data[4] = ((rand() * 10000) >> 0) / 100;
            data[5] = ((rand() * 10000) >> 0) / 100;
        }

        //create data store to be shared among the grid and bar series.
        var ds = Ext.create('Ext.data.ArrayStore', {
            fields: [
                {name: 'name' },
                {name: 'price',   type: 'float'},
                {name: 'revenue', type: 'float'},
                {name: 'growth',  type: 'float'},
                {name: 'product', type: 'float'},
                {name: 'market',  type: 'float'}
            ],
            data: myData,
            listeners: {
                //add listener to (re)select bar item after sorting or refreshing the dataset.
                refresh: {
                    fn: function() {
                        if (selectedRec) {
                            highlightCompanyPriceBar(selectedRec);
                        }
                    },
                    // Jump over the chart's refresh listener
                    delay: 1
                }
            }
        });
       //create a bar series to be at the top of the panel.
        var barChart = Ext.create('Ext.chart.CartesianChart', {

           //cls: 'kpi-main-chart',
             cls: 'quarterly-chart',
	        //width: '100%',
             flex: 1,
	        height: 500,
	        insetPadding: '40px 40px 20px 30px',
	        interactions: [{
	            type: 'panzoom',
	            zoomOnPanGesture: false,
	            axes: {
	                right: {
	                    maxZoom: 1
	                }
	            }
	        }],
	        minHeight: 290,
	        animation: false,
	        //bind: '{stocks}',
	        legend: { // null, false, undefined - doesn't work here. ??
	            hidden: true
	        },
            
            
            
            interactions: 'itemhighlight',
            style:  {
                border: 0
            },
            animation: {
                easing: 'easeOut',
                duration: 300
            },
            store: ds,


            axes: [{
                type: 'numeric',
                position: 'left',
                fields: 'price',
                minimum: 0,
                hidden: true
            }, {
                type: 'category',
                position: 'bottom',
                fields: ['name'],
                label: {
                    renderer: function(v) {
                        return Ext.String.ellipsis(v, 15, false);
                    },
                    font: '15px Tahoma',
                    rotate: {
                        degrees: -45
                    }
                }
            }],
            series: [{
                type: 'bar',
                axis: 'left',
                style: {
                    fillStyle: '#456d9f'
                },
                highlight: {
                    fillStyle: '#619fff',
                    strokeStyle: 'black'
                },
                label: {
                    contrast: true,
                    display: 'insideEnd',
                    field: 'price',
                    color: '#000',
                    orientation: 'vertical',
                    'text-anchor': 'middle'
                },
                listeners: {
                    itemmouseup: function(item) {
                         var series = barChart.series.get(0);
                         gridPanel.getSelectionModel().select(Ext.Array.indexOf(series.items, item));
                    }
                },
                xField: 'name',
                yField: 'price'
            }]
        });

        var dataView =         {
	        xtype: 'dataview',
	        cls: 'quarterly-dataview',
	
	        bind: '{statements}',
	
	        itemSelector: 'div.thumb-wrap',
	
	        listeners: {
	            itemclick: 'onQuarterlyStatementClick'
	        },
	
	        tpl: [
	            '<tpl for=".">',
	                // Break every four quarters
	                '<tpl if="xindex % 4 === 1">',
	                    '<div class="statement-type">{type}</div>',
	                '</tpl>',
	
	                '<div class="thumb-wrap">',
	                    '<a class="thumb" href="{url}" target="_blank">',
	                        '<div class="thumb-icon"></div>',
	                        '<div class="thumb-title-container">',
	                            '<div class="thumb-title">{title}</div>',
	                            '<div class="thumb-title-small">Uploaded: {uploaded}</div>',
	                        '</div>',
	                        '<div class="thumb-download"></div>',
	                    '</a>',
	                '</div>',
	            '</tpl>'
	        ]
	    };


	 function updateRadarChart(rec) {
            radarStore.loadData([
                { 'Name': '매출', 'Data': rec.get('price') },
                { 'Name': '이익률 %', 'Data': rec.get('revenue') },
                { 'Name': '성장률 %', 'Data': rec.get('growth') },
                { 'Name': '제품 %', 'Data': rec.get('product') },
                { 'Name': '시장 %', 'Data': rec.get('market') }
            ]);
            
            radarChart.setTitle(rec.get('name'));
        }
        
	  var  highlightCompanyPriceBar = function(storeItem) {
                var name = storeItem.get('name'),
                    series = barChart.series[0],
                    store = series.getStore();
                    
                barChart.setHighlightItem(series.getItemByIndex(store.indexOf(storeItem)));
            };    
	            // create radar store.
        var radarStore = Ext.create('Ext.data.JsonStore', {
            fields: ['Name', 'Data'],
            data: [
                { 'Name': '매출', 'Data': 100 },
                { 'Name': '이익률 %','Data': 100 },
                { 'Name': '성장률 %', 'Data': 100 },
                { 'Name': '제품 %', 'Data': 100 },
                { 'Name': '시장 %', 'Data': 100 }
            ]
        });

        var radarChart = Ext.create('Ext.chart.PolarChart', {
        	title: '-',
        	cls: 'quarterly-chart',
            width: 280,
            store: radarStore,
            //theme: 'Blue',
            interactions: 'rotate',
	        insetPadding: '40px 40px 40px 30px',
	        interactions: [{
	            type: 'panzoom',
	            zoomOnPanGesture: false,
	            axes: {
	                right: {
	                    maxZoom: 1
	                }
	            }
	        }],
	        minHeight: 320,
            axes: [{
                type: 'category',
                position: 'angular',
                grid: true,
                label: {
                    fontSize: 13
                }
            }, {
                type: 'numeric',
                miniumum: 0,
                maximum: 100,
                majorTickSteps: 5,
                position: 'radial',
                grid: true
            }],
            series: [{
                type: 'radar',
                xField: 'Name',
                yField: 'Data',
                showMarkers: true,
                marker: {
                    radius: 4,
                    size: 4,
                    fillStyle: 'rgb(69,109,159)'
                },
                style: {
                    fillStyle: 'rgb(194,214,240)',
                    opacity: 0.5,
                    lineWidth: 0.5
                }
            }]
        });
	    
	    this.add(
	             {
                    xtype: 'container',
                 	id : 'chartContainer',
                    height: 360,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: []
                }
	    );
	    
	    var  chartContainer = Ext.getCmp('chartContainer');
	    
        chartContainer.add(barChart);
        chartContainer.add(radarChart);
        
    function perc(v) {
            return v + '%';
        }  

	function threecomma(value) {
        	return Ext.util.Format.number(value, '0,00/i');
        }
           //create a grid that will list the dataset items.
    var gridPanel = Ext.create('Ext.grid.Panel', {
    	title: '고객사',
        id: 'company-form',
        flex: 6,
        store: ds,
        forceFit: true,
        defaults: {
            sortable: true
        },
        columns: [
            {
                text: '회사',
                width: 200,
                dataIndex: 'name'
            },
            {
                text: '매출',
                dataIndex: 'price',
                renderer: threecomma,
                align: 'right'//,
                //formatter: 'usMoney'
            },
            {
                text: '이익률',
                align: 'right',
                dataIndex: 'revenue',
                renderer: perc
            },
            {
                text: '성장률',
                align: 'right',
                dataIndex: 'growth',
                renderer: perc
            },
            {
                text: '제품',
                align: 'right',
                dataIndex: 'product',
                renderer: perc
            },
            {
                text: '점유율',
                align: 'right',
                dataIndex: 'market',
                renderer: perc
            }
        ],

        listeners: {
            selectionchange: function(model, records) {
                var fields;
                if (records[0]) {
                    selectedRec = records[0];
//                    if (!form) {
//                        form = this.up('panel').down('form').getForm();
//                        fields = form.getFields();
//                        fields.each(function(field){
//                            if (field.name != 'company') {
//                                field.setDisabled(false);
//                            }
//                        });
//                    } else {
//                        fields = form.getFields();
//                    }
                    
                    // prevent change events from firing
//                    form.suspendEvents();
//                    form.loadRecord(selectedRec);
//                    this.up('panel').down('fieldset').setTitle(selectedRec.get('name'));
//                    form.resumeEvents();
                    highlightCompanyPriceBar(selectedRec);
                    updateRadarChart(selectedRec);
                }
            }
        }
    });
        
        Ext.define('CardTabs', {
		    extend: 'Ext.tab.Panel',
		    requires: [
		        'Ext.layout.container.Card'
		    ],
		    xtype: 'layout-cardtabs',
		
		    style: 'background-color:#dfe8f6; ',
             cls: 'quarterly-chart',
	        flex: 1,
	        insetPadding: '40px 40px 20px 30px',
	        margin: '20, 20, 20, 20',
		    defaults: {
		        //bodyPadding: 15
		    },
		
		    items:[
			gridPanel
			/*
			,
		        {
		            title: '프로젝트',
		            html: 'This is tab 2 content.'
		        }
		    */
		    ]
		    
		
		});
		
		
		
		var tabView = Ext.create('CardTabs', {});
        
		this.add(tabView);
        
        //this.add(dataView);

        
        
		this.doLayout();
    },

    cls: 'quarterly-main',

    config: {
        activeState: null,
        defaultActiveState: 'AAPL'
    },

    controller: 'quarterly',

    viewModel: {
        type: 'quarterly'
    },

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    overflowY: 'auto',

    items: [],

    validStates: {
        AAPL: 1,
        GOOG: 1
    },

    isValidState: function (state) {
        return state in this.validStates;
    }
});
