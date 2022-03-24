/*
Rfx.view.produceStatePivot.PivotProdSbView
*/
Ext.define('Rfx2.view.produceStatePivot.PivotProdSbView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'pivot-prodsb-view',

    south: null,

    initComponent: function(){
    	console_logs('this','Rfx.view.ProduceState');
    	
				
		Ext.define('MenuModel', {
			extend: 'Ext.data.Model',
			fields: [
			{name: 'name'},
			{name: 'link'}
			]
		});

		this.store = Ext.create('Ext.data.Store', {
			model: 'MenuModel',
			data: []
		});


        Ext.apply(this, {
            layout: 'border',
			items: [ this.createPivot() ]
        });

        this.callParent(arguments);



    },
	
	createPivot: function() {
		
	
	Ext.define('Sale', function() {
	    var regions = {
	        "한국": '아시아',
	        "일본": '아시아',
	        "중국": '아시아',
	        "Canada": 'North America',
	        "USA": 'North America',
	        "독일": 'Europe'
	    };

	    return {
	        extend: 'Ext.data.Model',

	        fields: [
	            {name: 'id',        type: 'int'},
	            {name: 'company',   type: 'string'},
	            {name: 'country',   type: 'string'},
	            {name: 'person',    type: 'string'},
	            {name: 'date',      type: 'date', dateFormat: 'c'},
	            {name: 'value',     type: 'float', allowNull: true},
	            {name: 'quantity',  type: 'float', allowNull: true},
	           /* {
	                name: 'year',
	                calculate: function(data){
	                    return parseInt(Ext.Date.format(data.date, "Y"), 10);
	                }
	            },*/{
	                name: 'month',
	                calculate: function(data){
	                    return parseInt(Ext.Date.format(data.date, "m"), 10) - 1;
	                }
	            },{
	                name: 'continent',
	                calculate: function(data){
	                    return regions[data.country];
	                }
	            }
	        ]
	    };
	});
	
	
	var saleStore = Ext.create('Ext.data.Store', {
	    model : 'Sale'
	});

	var yearLabelRenderer = function(value){
        return  value + '년';
	};
	
	var monthLabelRenderer = function(value) {
        return Ext.Date.monthNames[value];
	};
	var onBeforeDocumentSave = function (view) {
        this.center.mask('Please wait ...');
    };

    var onDocumentSave = function (view) {
        this.center.unmask();
	};

	var 
		items = 500,
		rand = 37,
		companies = ['FG340000', 'FG890000', 'FLKK0000', 'FLIO0001', 'FLIO0002'],
		countries = ['Alloying', 'Ball Forming', 'Sorting', 'Test&Inst', '완료'],
		persons = ['삼성전자', 'LG전자', '하이닉스', '도시바', 'SONY'],
		randomItem = function(data){
			var k = rand % data.length;

			rand = rand * 1664525 + 1013904223;
			rand &= 0x7FFFFFFF;
			return data[k];
		},
		randomDate = function(start, end){
			return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime() ));
		},
		i, j;

	for (i = 0; i < items; i++){
		j = rand % companies
		saleStore.add ( {
			id:         i,
			company:    randomItem(companies),
			country:    randomItem(countries),
			person:     randomItem(persons),
			date:       randomDate(new Date(2012, 0, 1), new Date()),
			value:      Math.random() * 1000 + 1,
			quantity:   Math.floor(Math.random() * 30 + 1)
		});
	}

	var me
	 = Ext.create('Ext.pivot.Grid', {
		title: makeGridTitle('<span>S/B </span> 생산현황'),
		//border: true,
		//resizable: true,
		scroll: true,
		//minWidth: 200,
		//height: "100%",
		//region: 'center',
		//collapsible: false,
		layout: 'fit',
		forceFit: true,
		selModel: {
			type: 'rowmodel'
		},

		plugins: {

			pivotexporter: true,
			pivotconfigurator: {
				id: 'configurator',
				// It is possible to configure a list of fields that can be used to
				// configure the pivot grid
				// If no fields list is supplied then all fields from the Store model
				// are fetched automatically
				fields: [{
					dataIndex: 'quantity',
					header: 'Qty',
					// You can even provide a default aggregator function to be used
					// when this field is dropped
					// on the agg dimensions
					aggregator: 'min',
					formatter: 'number("0")',
	
					settings: {
						// Define here in which areas this field could be used
						allowed: ['aggregate'],
						// Set a custom style for this field to inform the user that
						// it can be dragged only to "Values"
						style: {
							fontWeight: 'bold'
						},
						// Define here custom formatters that ca be used on this dimension
						formatters: {
							'0': 'number("0")',
							'0%': 'number("0%")'
						}
					}
				}, {
					dataIndex: 'value',
					header: 'Value',
	
					settings: {
						// Define here in which areas this field could be used
						allowed: 'aggregate',
						// Define here what aggregator functions can be used when this
						// field is used as an aggregate dimension
						aggregators: ['sum', 'avg', 'count'],
						// Set a custom style for this field to inform the user that it
						// can be dragged only to "Values"
						style: {
							fontWeight: 'bold'
						},
						// Define here custom renderers that can be used on this dimension
						renderers: {
							'Colored 0,000.00': 'coloredRenderer'
						},
						// Define here custom formatters that ca be used on this dimension
						formatters: {
							'0': 'number("0")',
							'0.00': 'number("0.00")',
							'0,000.00': 'number("0,000.00")',
							'0%': 'number("0%")',
							'0.00%': 'number("0.00%")'
						}
					}
				}, {
					dataIndex: 'company',
					header: '고객사',
	
					settings: {
						// Define here what aggregator functions can be used when this
						// field is used as an aggregate dimension
						aggregators: ['count']
					}
				}/*, {
					dataIndex: 'country',
					header: 'Country',
	
					settings: {
						// Define here what aggregator functions can be used when this
						// field is used as an aggregate dimension
						aggregators: ['count']
					}
				}*/, {
					dataIndex: 'person',
					header: '영업담당',
	
					settings: {
						// Define here what aggregator functions can be used when this
						// field is used as an aggregate dimension
						aggregators: 'count'
					}
				}, {
					dataIndex: 'country',
					header: '공정',
	
					settings: {
						// Define here the areas in which this field is fixed and cannot
						// be moved from
						fixed: ['topAxis']
					}
				}, {
					dataIndex: 'month',
					header: 'Month',
					labelRenderer: monthLabelRenderer,
	
					settings: {
						// Define here what aggregator functions can be used when this
						// field is used as an aggregate dimension
						aggregators: ['count'],
						// Define here in which areas this field could be used
						allowed: ['leftAxis', 'topAxis']
					}
				}]
			}
			/*
			생산현황
			로트번호
			고객사
			수주수량
			생산수량
			불량수량
			시작일
			종료일
			진행상태
			제품규격
			영업담당
			*/
		},
	
		// Set this to true to lock leftAxis dimensions
		enableLocking: true,
	    // Set this to false if multiple dimensions are configured on leftAxis and
	    // you want to automatically expand the row groups when calculations are ready.
	    startRowGroupsCollapsed: false,
	
		doExport: function (config) {
			console.log('config', config);
			me.saveDocumentAs(config).then(null, this.onError);
		},
		onError: function (error) {
			Ext.Msg.alert('Error', typeof error === 'string' ? error : 'Unknown error');
		},
		getMyMatrix: function() {
			return this.matrix;
		},
	    matrix: {
	        type: 'local',
			store: saleStore,
			
		// Set layout type to "tabular". If this config is missing then the
        // default layout is "outline"
        viewLayoutType: 'tabular',

	        // Configure the aggregate dimensions. Multiple dimensions are supported.
	        aggregate: [{
	            dataIndex: 'value',
	            header: 'Total',
	            aggregator: 'sum',
	            width: 90
	        }],

	        // Configure the left axis dimensions that will be used to generate
	        // the grid rows
	        leftAxis: [{
	            dataIndex: 'person',
	            header: '고객사',
	            width: 80
	        }, {
	            dataIndex: 'company',
	            header: '로트번호',
	            sortable: false,
	            width: 80
	        }],

	        /**
	         * Configure the top axis dimensions that will be used to generate
	         * the columns.
	         *
	         * When columns are generated the aggregate dimensions are also used.
	         * If multiple aggregation dimensions are defined then each top axis
	         * result will have in the end a column header with children columns
	         * for each aggregate dimension defined.
	         */
	        // topAxis: [{
	        //     dataIndex: 'country',
	        //     header: '국가'
			// }]
			topAxis: [/*{
				dataIndex: 'year',
				header: 'Year'
			}, */{
				dataIndex: 'country',
				header: '공정'
			}]
		},
		listeners: {
			// this event notifies us when the document was saved
			documentsave: function() {this.unmask();}, //onDocumentSave,
			beforedocumentsave: function() {this.mask('Please wait ...');}, //onBeforeDocumentSave,
			pivotdone: function(){
				// var me = this,
				// 	view = me.getView(),
				// 	pivot = view.down('pivotgrid'),
				// 	chart = view.down('chart');
	
				// if(chart){
				// 	view.remove(chart);
				// }
	
				// view.add({
				// 	xtype: 'cartesian',
				// 	region: 'south',
				// 	flex: 1,
				// 	legend: {
				// 		docked: 'bottom'
				// 	},
				// 	store: pivot.getPivotStore(),
				// 	axes: [{
				// 		type: 'numeric',
				// 		position: 'left',
				// 		adjustByMajorUnit: true,
				// 		fields: ['id'],
				// 		renderer: function(axis, v) {
				// 			return (v * 100).toFixed(0) + '%';
				// 		},
				// 		grid: true
				// 	},{
				// 		type: 'category',
				// 		position: 'bottom',
				// 		grid: true,
				// 		fields: ['id'],
				// 		renderer: Ext.bind(me.chartRenderer, pivot)
				// 	}],
				// 	series: [{
				// 		type: 'bar',
				// 		axis: 'left',
				// 		title: me.getTitles(pivot),
				// 		yField: me.getFields(pivot),
				// 		xField: 'id',
				// 		stacked: true
				// 	}]
				// });
			}
		},
	
		header: {
			itemPosition: 1, // after title before collapse tool
			items: [{
				ui: 'default-toolbar',
				xtype: 'button',
				text: '파일 내보내기...',
				menu: {
					defaults: {
						handler: function(btn){
							var cfg = Ext.merge({
								title: '매출 현황',
								fileName: 'PivotGridExport' + (btn.cfg.onlyExpandedNodes ? 'Visible' : '') + '.' + (btn.cfg.ext || btn.cfg.type)
							}, btn.cfg);
					
							me.doExport(cfg)
						},
					},
					items: [{
						text:   'Excel xlsx (pivot table definition)',
						handler: function () {
							console.log('exportToPivotXlsx');
							me.doExport({
								type: 'pivotxlsx',
								matrix: me.getMatrix(),
								title: '매출 현황',
								fileName: 'ExportPivot.xlsx'
							});
						}
					},{
						text:   'Excel xlsx (all items)',
						cfg: {
							type: 'excel07',
							ext: 'xlsx'
						}
					},{
						text:   'Excel xlsx (visible items)',
						cfg: {
							type: 'excel07',
							onlyExpandedNodes: true,
							ext: 'xlsx'
						}
					},{
						text: 'Excel xml (all items)',
						cfg: {
							type: 'excel03',
							ext: 'xml'
						}
					},{
						text:   'Excel xml (visible items)',
						cfg: {
							type: 'excel03',
							onlyExpandedNodes: true,
							ext: 'xml'
						}
					},{
						text:   'CSV (all items)',
						cfg: {
							type: 'csv'
						}
					},{
						text:   'CSV (visible items)',
						cfg: {
							type: 'csv',
							onlyExpandedNodes: true
						}
					},{
						text:   'TSV (all items)',
						cfg: {
							type: 'tsv',
							ext: 'csv'
						}
					},{
						text:   'TSV (visible items)',
						cfg: {
							type: 'tsv',
							onlyExpandedNodes: true,
							ext: 'csv'
						}
					},{
						text:   'HTML (all items)',
						cfg: {
							type: 'html'
						}
					},{
						text:   'HTML (visible items)',
						cfg: {
							type: 'html',
							onlyExpandedNodes: true
						}
					}]
				}
			}]
		}
		});
		 this.center =  Ext.create('Ext.panel.Panel', {
			//title: makeGridTitle('<span>전체 </span> 생산현황'),
			border: true,
			resizable: true,
			scroll: true,
			minWidth: 200,
			height: "100%",
			region: 'center',
			collapsible: false,
			layout: 'fit',
			forceFit: true,
			items: [ 
			me
			
		]
				});

		return this.center;
	},
	checkbox: null
});
