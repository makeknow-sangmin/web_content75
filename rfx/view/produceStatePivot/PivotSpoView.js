Ext.define('Rfx.view.produceStatePivot.PivotSpoView', {
	extend: 'Rfx.base.BaseView',
	xtype: 'pivot-spo-view',

	south: null,

	initComponent: function () {
		console_logs('this', 'Rfx.view.produceStatePivot.PivotSpoView');


		var pivotGrid = this.createPivot();

		this.center = Ext.create('Ext.panel.Panel', {
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
				pivotGrid
			]
		});

		Ext.apply(this, {
			layout: 'border',
			items: [this.center/*, {
				xtype: 'component',
				region: 'south',
				height: '50%',
				html: '<div class="cont" id="pivot-spo-view-chart">target</div>'
			}*/]
		});

		this.callParent(arguments);
	},

	createPivot: function () {

		Ext.define('Sale', function () {
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
					{ name: 'id', type: 'int' },
					{ name: 'company', type: 'string' },
					{ name: 'country', type: 'string' },
					{ name: 'person', type: 'string' },
					{ name: 'date', type: 'date', dateFormat: 'c' },
					{ name: 'value', type: 'float', allowNull: true },
					{ name: 'quantity', type: 'float', allowNull: true },
					{
						name: 'year',
						calculate: function (data) {
							return parseInt(Ext.Date.format(data.date, "Y"), 10);
						}
					}, {
						name: 'month',
						calculate: function (data) {
							return parseInt(Ext.Date.format(data.date, "m"), 10) - 1;
						}
					}, {
						name: 'continent',
						calculate: function (data) {
							return regions[data.country];
						}
					}
				]
			};
		});


		var saleStore = Ext.create('Ext.data.Store', {
			model: 'Sale'
		});

		var yearLabelRenderer = function (value) {
			return value + '년';
		};

		var monthLabelRenderer = function (value) {
			return Ext.Date.monthNames[value];
		};
		var onBeforeDocumentSave = function (view) {
			this.center.mask('Please wait ...');
		};

		var onDocumentSave = function (view) {
			this.center.unmask();
		};

		var items = 500,
			rand = 37,
			companies = ['삼성', 'Apple', 'Dell', 'LG', 'Hynix'],
			countries = ['한국', '일본', '중국', 'Canada', 'USA', '독일'],
			persons = ['김영철', '이상훈', 'Kim Chul', '주강록', 'Robert'],
			randomItem = function (data) {
				var k = rand % data.length;

				rand = rand * 1664525 + 1013904223;
				rand &= 0x7FFFFFFF;
				return data[k];
			},
			randomDate = function (start, end) {
				return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
			},
			i, j;

		for (i = 0; i < items; i++) {
			j = rand % companies
			saleStore.add({
				id: i,
				company: randomItem(companies),
				country: randomItem(countries),
				person: randomItem(persons),
				date: randomDate(new Date(2012, 0, 1), new Date()),
				value: Math.random() * 1000 + 1,
				quantity: Math.floor(Math.random() * 30 + 1)
			});
		}

		var me
			= Ext.create('Ext.pivot.Grid', {
				title: makeGridTitle('<span>전체 </span> 수주현황'),
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
							header: 'Company',

							settings: {
								// Define here what aggregator functions can be used when this
								// field is used as an aggregate dimension
								aggregators: ['count']
							}
						}, {
							dataIndex: 'country',
							header: 'Country',

							settings: {
								// Define here what aggregator functions can be used when this
								// field is used as an aggregate dimension
								aggregators: ['count']
							}
						}, {
							dataIndex: 'person',
							header: 'Person',

							settings: {
								// Define here what aggregator functions can be used when this
								// field is used as an aggregate dimension
								aggregators: 'count'
							}
						}, {
							dataIndex: 'year',
							header: 'Year',

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
				getMyMatrix: function () {
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
						header: '담당자',
						width: 80
					}, {
						dataIndex: 'company',
						header: '발주처',
						sortable: false,
						width: 80
					}],

					topAxis: [{
						dataIndex: 'year',
						header: 'Year'
					}, {
						dataIndex: 'country',
						header: 'Country'
					}]
				},
				listeners: {
					// this event notifies us when the document was saved
					documentsave: function () { this.unmask(); }, //onDocumentSave,
					beforedocumentsave: function () { this.mask('Please wait ...'); }, //onBeforeDocumentSave,
					pivotdone: function () {

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
								handler: function (btn) {
									var cfg = Ext.merge({
										title: '매출 현황',
										fileName: 'PivotGridExport' + (btn.cfg.onlyExpandedNodes ? 'Visible' : '') + '.' + (btn.cfg.ext || btn.cfg.type)
									}, btn.cfg);

									me.doExport(cfg)
								},
							},
							items: [{
								text: 'Excel xlsx (pivot table definition)',
								handler: function () {
									console.log('exportToPivotXlsx');
									me.doExport({
										type: 'pivotxlsx',
										matrix: me.getMatrix(),
										title: '매출 현황',
										fileName: 'ExportPivot.xlsx'
									});
								}
							}, {
								text: 'Excel xlsx (all items)',
								cfg: {
									type: 'excel07',
									ext: 'xlsx'
								}
							}, {
								text: 'Excel xlsx (visible items)',
								cfg: {
									type: 'excel07',
									onlyExpandedNodes: true,
									ext: 'xlsx'
								}
							}, {
								text: 'Excel xml (all items)',
								cfg: {
									type: 'excel03',
									ext: 'xml'
								}
							}, {
								text: 'Excel xml (visible items)',
								cfg: {
									type: 'excel03',
									onlyExpandedNodes: true,
									ext: 'xml'
								}
							}, {
								text: 'CSV (all items)',
								cfg: {
									type: 'csv'
								}
							}, {
								text: 'CSV (visible items)',
								cfg: {
									type: 'csv',
									onlyExpandedNodes: true
								}
							}, {
								text: 'TSV (all items)',
								cfg: {
									type: 'tsv',
									ext: 'csv'
								}
							}, {
								text: 'TSV (visible items)',
								cfg: {
									type: 'tsv',
									onlyExpandedNodes: true,
									ext: 'csv'
								}
							}, {
								text: 'HTML (all items)',
								cfg: {
									type: 'html'
								}
							}, {
								text: 'HTML (visible items)',
								cfg: {
									type: 'html',
									onlyExpandedNodes: true
								}
							}]
						}
					}]
				}
			});
		return me;
	},
	checkbox: null
});
