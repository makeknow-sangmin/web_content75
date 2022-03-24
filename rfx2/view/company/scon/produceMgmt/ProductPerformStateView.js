//설비현황
Ext.define('Rfx2.view.company.scon.produceMgmt.ProductPerformStateView', {
	extend: 'Rfx2.base.BaseView',
	xtype: 'machine-view',
	initComponent: function () {

		//검색툴바 필드 초기화
		this.initSearchField();

		this.addSearchField(
			{
				// type: 'combo',
				field_id: 'mchn_code'
				, store: 'MchnCodeStore'
				, emptyText: '양생실'
				, displayField: 'display'
				, valueField: 'value'
				, innerTpl: '{display}'
			});

		this.addSearchField({
			type: 'dateRange',
			id : gu.id('start_date'),
			field_id: 'produce_start_date',
			text: gm.getMC('CMD_Work_Date', '생산일자'),
			sdate: Ext.Date.add(new Date(), new Date()),
			edate: new Date()
		});

		this.printProduceResult = Ext.create('Ext.Action', {
			iconCls: 'af-pdf',
			text: '생산실적입력결과 출력',
			tooltip: '실적입력결과를 출력합니다.',
			disabled: false,
			handler: function () {
				// var machineStore = Ext.create('')
				var form = Ext.create('Ext.form.Panel', {
					xtype: 'form',
					frame: false,
					border: false,
					bodyPadding: 10,
					region: 'center',
					layout: 'form',
					fieldDefaults: {
						labelAlign: 'right',
						msgTarget: 'side'
					},
					items: [
						{
							xtype: 'fieldset',
							title: '출력할 일자를 선택하십시오.',
							items: [
								
								{
									xtype: 'datefield',
									id: gu.id('print_date'),
									anchor: '97%',
									name: 'print_date',
									fieldLabel: '생산일자',
									format: 'Y-m-d',
									value: new Date()
								}
							]
						}
					]
				});

				var prWin = Ext.create('Ext.Window', {
					modal: true,
					title: '생산실적입력결과 출력',
					width: 450,
					height: 200,
					items: form,
					buttons: [
						{
							text: CMD_OK,
							scope: this,
							handler: function () {
								Ext.MessageBox.show({
									title: '',
									msg: '선택한 일자로 생산실적출력을 하시겠습니까?',
									buttons: Ext.MessageBox.YESNO,
									icon: Ext.MessageBox.QUESTION,
									fn: function (btn) {
										if (btn == "no") {
											return;
										} else {
											prWin.setLoading(true);
											Ext.Ajax.request({
												url: CONTEXT_PATH + '/pdf.do?method=printProduce',
												params: {
													print_date: gu.getCmp('print_date').getValue(),
													rtgast_uid: -1,
													is_rotate: 'N',
												},
												success: function (result, request) {
													var jsonData = Ext.JSON.decode(result.responseText);
													var pdfPath = jsonData.pdfPath;
													console_log(pdfPath);
													if (pdfPath.length > 0) {
														var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + pdfPath;
														top.location.href = url;
													}
													if (prWin) {
														prWin.close();
													}
													prWin.setLoading(false);
													Ext.MessageBox.alert('알림', '문서생성이 완료되었습니다.');
												},
												failure: function (result, request) {
													prWin.setLoading(false);
													Ext.MessageBox.alert('알림', '문서생성이 요청하였으나 실패하였습니다.');
												}
											});
											// }

										}
									}
								});
							}
						},
						{
							text: CMD_CANCEL,
							scope: this,
							handler: function () {
								prWin.close();
							}
						}
					]
				});
				prWin.show();
			}
		});

		this.downloadSheetActionByProduct = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-excel',
            text: '규격별 생산실적 출력',
            disabled: false,
            handler: function () {
				var valSdate = Ext.Date.getFirstDateOfMonth(new Date());
				var form = Ext.create('Ext.form.Panel', {
					xtype: 'form',
					frame: false,
					border: false,
					bodyPadding: 10,
					region: 'center',
					layout: 'form',
					fieldDefaults: {
						labelAlign: 'right',
						msgTarget: 'side'
					},
					items: [
						{
							xtype: 'fieldset',
							title: '기준이 되는 시작일자와 종료일자를 선택하십시오.',
							items: [
								{
									xtype: 'datefield',
									id: gu.id('start_date'),
									anchor: '97%',
									name: 'start_date',
									fieldLabel: '시작일자',
									format: 'Y-m-d',
									value: valSdate
								},
								{
									xtype: 'datefield',
									id: gu.id('end_date'),
									anchor: '97%',
									name: 'end_date',
									fieldLabel: '종료일자',
									format: 'Y-m-d',
									value: new Date()
								}
							]
						}
					]
				});

				var prWin = Ext.create('Ext.Window', {
					modal: true,
					title: 'Excel 출력',
					width: 450,
					height: 250,
					items: form,
					buttons: [
						{
							text: CMD_OK,
							scope: this,
							handler: function () {
								gm.setCenterLoading(true);
								prWin.setLoading(true);
								var store = Ext.create('Rfx2.store.company.chmr.ProducePerformanceExcelStore', {});
								store.getProxy().setExtraParam("srch_type", 'excelPrint');
								store.getProxy().setExtraParam("srch_fields", 'major');
								store.getProxy().setExtraParam("srch_rows", 'all');
								store.getProxy().setExtraParam("is_excel_print", 'Y');
								store.getProxy().setExtraParam("is_based_product",'Y');
								store.getProxy().setExtraParam("menuCode", 'SRO5_PERF_EXL_PRD');
								var start_date = gu.getCmp('start_date').getValue();

								var start_date_year = start_date.getFullYear();
								var start_date_month = start_date.getMonth() +1;
								var start_date_day = start_date.getDate();
								
								if(start_date_month < 10) {
									start_date_month = '0' + start_date_month;
								} 
								if(start_date_day < 10) {
									start_date_day = '0' + start_date_day;
								}

								var start_date_parse = start_date_year + '-' + start_date_month+ '-' +  start_date_day;

								// 종료일
								var end_date = gu.getCmp('end_date').getValue();

								var end_date_year = end_date.getFullYear();
								var end_date_month = end_date.getMonth() +1;
								var end_date_day = end_date.getDate();
								
								if(end_date_month < 10) {
									end_date_month = '0' + end_date_month;
								} 
								if(end_date_day < 10) {
									end_date_day = '0' + end_date_day;
								}

								var end_date_parse = end_date_year + '-' + end_date_month+ '-' +  end_date_day;
								
								store.getProxy().setExtraParam("start_date", start_date_parse);
								store.getProxy().setExtraParam("end_date", end_date_parse);
								// store.getProxy().setExtraParam("mchn_code", gu.getCmp('mchn_code').getValue());
								var items = searchToolbar.items.items;
								for (var i = 0; i < items.length; i++) {
									var item = items[i];
									store.getProxy().setExtraParam(item.name, item.value);
								}
								var arrField = gm.me().gSearchField;
								try {
									Ext.each(arrField, function (fieldObj, index) {
										console_log(typeof fieldObj);
										var dataIndex = '';
										if (typeof fieldObj == 'string') { //text search
											dataIndex = fieldObj;
										} else {
											dataIndex = fieldObj['field_id'];
										}
										var srchId = gm.getSearchField(dataIndex); //'srch' + dataIndex.substring(0,1).toUpperCase()+ dataIndex.substring(1);
										var value = Ext.getCmp(srchId).getValue();
										if (value != null && value != '') {
											if (dataIndex == 'unique_id' || typeof fieldObj == 'object') {
												store.getProxy().setExtraParam(dataIndex, value);
											} else {
												var enValue = Ext.JSON.encode('%' + value + '%');
												console_info(enValue);
												store.getProxy().setExtraParam(dataIndex, enValue);
											}//endofelse
										}//endofif

									});
								} catch (noError) { }

								store.load({
									scope: this,
									callback: function (records, operation, success) {
										Ext.Ajax.request({
											url: CONTEXT_PATH + '/filedown.do?method=myExcelPath',
											params: {
												mc_codes: gUtil.getMcCodes()
											},
											success: function (response, request) {
												gm.setCenterLoading(false);
												//console_logs('response.responseText', response.responseText);
												store.getProxy().setExtraParam("srch_type", null);
												var excelPath = response.responseText;
												if (excelPath != null && excelPath.length > 0) {
													prWin.setLoading(false);
													var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
													top.location.href = url;
													if(prWin) {
														prWin.close();
													}

												} else {
													prWin.setLoading(false);
													Ext.Msg.alert('경고', '엑셀 다운로드 경로를 찾을 수 없습니다.<br>엑셀 출력정책이 정의되지 않았습니다.');
													if(prWin) {
														prWin.close();
													}
												}
											}
										});

									}
								});
							}
						},
						{
							text: CMD_CANCEL,
							scope: this,
							handler: function () {
								prWin.close();
							}
						}
					]
				});
				prWin.show();
            }
        });

		this.downloadSheetAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-excel',
            text: 'Excel',
            disabled: false,
            handler: function () {
				var valSdate = Ext.Date.getFirstDateOfMonth(new Date());
				var consumeRateStore =   Ext.create('Mplm.store.MchnCodeStore', {parentCode: 'LABEL_PRINTERS'});
				var form = Ext.create('Ext.form.Panel', {
					xtype: 'form',
					frame: false,
					border: false,
					bodyPadding: 10,
					region: 'center',
					layout: 'form',
					fieldDefaults: {
						labelAlign: 'right',
						msgTarget: 'side'
					},
					items: [
						{
							xtype: 'fieldset',
							title: '기준이 되는 시작일자와 종료일자를 선택하십시오.',
							items: [
								{
									xtype: 'combo',
									fieldLabel: '양생실',
									anchor: '97%',
									id: gu.id('mchn_code'),
									store: consumeRateStore,
									name: 'machine_code',
									valueField: 'value',
									displayField: 'display',
									emptyText: '선택해주세요.',
									listConfig: {
										loadingText: '검색중...',
										emptyText: '일치하는 항목 없음',
										getInnerTpl: function () {
											return '<div data-qtip="{value}">{display}</div>';
										}
									},
								},
								{
									xtype: 'datefield',
									id: gu.id('start_date'),
									anchor: '97%',
									name: 'start_date',
									fieldLabel: '시작일자',
									format: 'Y-m-d',
									value: valSdate
								},
								{
									xtype: 'datefield',
									id: gu.id('end_date'),
									anchor: '97%',
									name: 'end_date',
									fieldLabel: '종료일자',
									format: 'Y-m-d',
									value: new Date()
								}
							]
						}
					]
				});

				var prWin = Ext.create('Ext.Window', {
					modal: true,
					title: 'Excel 출력',
					width: 450,
					height: 250,
					items: form,
					buttons: [
						{
							text: CMD_OK,
							scope: this,
							handler: function () {
								gm.setCenterLoading(true);
								prWin.setLoading(true);
								var store = Ext.create('Rfx2.store.company.chmr.ProducePerformanceExcelStore', {});
								store.getProxy().setExtraParam("srch_type", 'excelPrint');
								store.getProxy().setExtraParam("srch_fields", 'major');
								store.getProxy().setExtraParam("srch_rows", 'all');
								store.getProxy().setExtraParam("is_excel_print", 'Y');
								store.getProxy().setExtraParam("menuCode", 'SRO5_PERF_EXL');
								var start_date = gu.getCmp('start_date').getValue();

								var start_date_year = start_date.getFullYear();
								var start_date_month = start_date.getMonth() +1;
								var start_date_day = start_date.getDate();
								
								if(start_date_month < 10) {
									start_date_month = '0' + start_date_month;
								} 
								if(start_date_day < 10) {
									start_date_day = '0' + start_date_day;
								}

								var start_date_parse = start_date_year + '-' + start_date_month+ '-' +  start_date_day;

								// 종료일
								var end_date = gu.getCmp('end_date').getValue();

								var end_date_year = end_date.getFullYear();
								var end_date_month = end_date.getMonth() +1;
								var end_date_day = end_date.getDate();
								
								if(end_date_month < 10) {
									end_date_month = '0' + end_date_month;
								} 
								if(end_date_day < 10) {
									end_date_day = '0' + end_date_day;
								}

								var end_date_parse = end_date_year + '-' + end_date_month+ '-' +  end_date_day;
								
								store.getProxy().setExtraParam("start_date", start_date_parse);
								store.getProxy().setExtraParam("end_date", end_date_parse);
								store.getProxy().setExtraParam("mchn_code", gu.getCmp('mchn_code').getValue());
								var items = searchToolbar.items.items;
								for (var i = 0; i < items.length; i++) {
									var item = items[i];
									store.getProxy().setExtraParam(item.name, item.value);
								}
								var arrField = gm.me().gSearchField;
								try {
									Ext.each(arrField, function (fieldObj, index) {
										console_log(typeof fieldObj);
										var dataIndex = '';
										if (typeof fieldObj == 'string') { //text search
											dataIndex = fieldObj;
										} else {
											dataIndex = fieldObj['field_id'];
										}
										var srchId = gm.getSearchField(dataIndex); //'srch' + dataIndex.substring(0,1).toUpperCase()+ dataIndex.substring(1);
										var value = Ext.getCmp(srchId).getValue();
										if (value != null && value != '') {
											if (dataIndex == 'unique_id' || typeof fieldObj == 'object') {
												store.getProxy().setExtraParam(dataIndex, value);
											} else {
												var enValue = Ext.JSON.encode('%' + value + '%');
												console_info(enValue);
												store.getProxy().setExtraParam(dataIndex, enValue);
											}//endofelse
										}//endofif

									});
								} catch (noError) { }

								store.load({
									scope: this,
									callback: function (records, operation, success) {
										Ext.Ajax.request({
											url: CONTEXT_PATH + '/filedown.do?method=myExcelPath',
											params: {
												mc_codes: gUtil.getMcCodes()
											},
											success: function (response, request) {
												gm.setCenterLoading(false);
												//console_logs('response.responseText', response.responseText);
												store.getProxy().setExtraParam("srch_type", null);
												var excelPath = response.responseText;
												if (excelPath != null && excelPath.length > 0) {
													prWin.setLoading(false);
													var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
													top.location.href = url;
													if(prWin) {
														prWin.close();
													}

												} else {
													prWin.setLoading(false);
													Ext.Msg.alert('경고', '엑셀 다운로드 경로를 찾을 수 없습니다.<br>엑셀 출력정책이 정의되지 않았습니다.');
													if(prWin) {
														prWin.close();
													}
												}
											}
										});

									}
								});
							}
						},
						{
							text: CMD_CANCEL,
							scope: this,
							handler: function () {
								prWin.close();
							}
						}
					]
				});
				prWin.show();
            }
        });

		//검색툴바 생성
		var searchToolbar = this.createSearchToolbar();
		//명령툴바 생성
		var buttonToolbar = this.createCommandToolbar({
			REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE', 'EXCEL']
		});

		buttonToolbar.insert(1, this.printProduceResult);
		buttonToolbar.insert(2, this.downloadSheetActionByProduct);
		buttonToolbar.insert(3, '->');
		buttonToolbar.insert(4, '->');
		buttonToolbar.insert(7, this.downloadSheetAction);

		this.createStore('Rfx2.model.company.chmr.ProducePerformance', [{
			property: 'name_ko',
			direction: 'ASC'
		}],
			gMain.pageSize
			, {}
			, ['pcsmchn']
		);

		var arr = [];
		arr.push(buttonToolbar);
		arr.push(searchToolbar);

		this.purListSrch = Ext.create('Ext.Action', {
			itemId: 'putListSrch',
			iconCls: 'af-search',
			text: CMD_SEARCH/*'검색'*/,
			disabled: false,
			handler: function (widget, event) {
				// try {
				var comcst_code = '';
				if (gu.getCmp('factory_gubun_combo').getValue() !== null) {
					comcst_code = gu.getCmp('factory_gubun_combo').getValue();
					gm.me().consumeRateStore.getProxy().setExtraParam('comcst_code', comcst_code);
				}

				if (gu.getCmp('stock_date_search').getValue() !== null) {
					var stock_date = gu.getCmp('stock_date_search').getValue();
					var year = stock_date.getFullYear();
					var month = stock_date.getMonth() + 1;
					month = month >= 10 ? month : '0' + month;
					var day = stock_date.getDate();
					day = day >= 10 ? day : '0' + day;
					var stock_date_parse = year.toString() + month.toString() + day.toString();
					gm.me().consumeRateStore.getProxy().setExtraParam('stock_date', stock_date_parse);
				}

				gm.me().consumeRateStore.load();
			}
		});

		this.gridContractCompany = Ext.create('Ext.grid.Panel', {
			cls: 'rfx-panel',
			id: gu.id('gridContractCompany'),
			store: this.consumeRateStore,
			viewConfig: {
				markDirty: false
			},
			collapsible: false,
			multiSelect: false,
			region: 'center',
			autoScroll: true,
			autoHeight: true,
			flex: 0.5,
			frame: true,
			bbar: getPageToolbar(this.poPrdDetailStore),
			border: true,
			layout: 'fit',
			forceFit: false,
			plugins: {
				ptype: 'cellediting',
				clicksToEdit: 1
			},
			selModel: Ext.create("Ext.selection.CheckboxModel", {}),
			margin: '0 0 0 0',
			dockedItems: [
				{
					dock: 'top',
					xtype: 'toolbar',
					cls: 'my-x-toolbar-default1',
					items: [
						{
							id: gu.id('factory_gubun_combo'),
							labelStyle: 'width:60px; color: #ffffff;',
							fieldLabel: '공장선택',
							// allowBlank: false,
							xtype: 'combo',
							width: '40%',
							// padding: '0 0 5px 30px',
							fieldStyle: 'background-image: none;',
							store: this.factoryGubunStore,
							emptyText: '선택해주세요',
							displayField: 'display',
							valueField: 'value',
							sortInfo: { field: 'display', direction: 'ASC' },
							typeAhead: false,
							minChars: 1,
							listConfig: {
								loadingText: 'Searching...',
								emptyText: 'No matching posts found.',
								getInnerTpl: function () {
									return '<div data-qtip="{value}">{display}</div>';
								}
							},
							listeners: {
								select: function (combo, record) {
									// gu.getCmp('final_order_com_unique').setValue(gu.getCmp('order_com_unique').getValue());
									// Ext.getCmp('reserved_varchar3').setValue(record.get('address_1'));
								}// endofselect
							}
						},
						{
							xtype: 'datefield',
							id: gu.id('stock_date_search'),
							// name: 'stock_date',
							padding: '0 0 5px 5px',
							width: '40%',
							labelStyle: 'width:60px; color: #ffffff;',
							// allowBlank: true,
							fieldLabel: '소모일자',
							format: 'Y-m-d',
							value: Ext.Date.add(new Date(), Ext.Date.DAY, -1),
						},
						this.purListSrch
					]
				},
			],
			columns: [
				{
					text: '구분',
					width: 80,
					style: 'text-align:center',
					dataIndex: 'factory_gubun',
					sortable: false
				},
				{
					text: '소모일자',
					width: 90,
					style: 'text-align:center',
					dataIndex: 'stock_date_format',
					sortable: false
				},
				{
					text: '소모자재',
					width: 100,
					style: 'text-align:center',
					dataIndex: 'item_name',
					sortable: false
				},
				{
					text: '소요량',
					width: 100,
					style: 'text-align:center',
					dataIndex: 'use_qty',
					align: "right",
					sortable: false,
					renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
				},
				{
					text: '회전수',
					width: 100,
					style: 'text-align:center',
					dataIndex: 'gr_qty',
					sortable: false,
					align: "right",
					renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
				},

			],
			title: '원자재소모 리스트',
			name: 'po',
			autoScroll: true,

		});



		this.gridContractCompany.getSelectionModel().on({
			selectionchange: function (sm, selections) {
				console_logs('>>>>>>> rec', selections);

			}
		});

		//grid 생성
		this.usePagingToolbar = false;
		this.createGrid(arr, function () { });
		this.createCrudTab();

		Ext.apply(this, {
			layout: 'border',
			items: [
				{
					//title: '제품 및 템플릿 선택',
					collapsible: false,
					frame: false,
					region: 'north',
					layout: {
						type: 'hbox',
						pack: 'start',
						align: 'stretch'
					},
					margin: '5 0 0 0',
					flex: 0.5,
					items: [{
						region: 'west',
						layout: 'fit',
						margin: '0 0 0 0',
						width: '100%',
						items: [this.grid]
					}]
				}, this.gridContractCompany
			]
		});

		this.callParent(arguments);

		//디폴트 로드
		gMain.setCenterLoading(false);
		this.store.load(function (records) {
		});
		// var date = new Date = Ext.Date.add(new Date(), Ext.Date.DAY, -1);
		// var year = date.getFullYear();
		// var month = date.getMonth() + 1;
		// if(month < 10) {
		// 	month = '0' + month;
		// }
		// var day = date.getDate();
		// var stock_date = year + month + day;
		// this.consumeRateStore.getProxy().setExtraParam('stock_date', stock_date);
		this.consumeRateStore.load();
	},
	items: [],
	factoryGubunStore: Ext.create('Mplm.store.FactoryGubunStore', {}),
	consumeRateStore: Ext.create('Rfx2.store.company.chmr.ConsumeRateStore', {pageSize: 100}),
});
