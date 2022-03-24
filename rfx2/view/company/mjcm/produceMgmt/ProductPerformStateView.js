Ext.define('Rfx2.view.company.mjcm.produceMgmt.ProductPerformStateView', {
	extend: 'Rfx2.base.BaseView',
	xtype: 'machine-view',
	initComponent: function () {

		//검색툴바 필드 초기화
		this.initSearchField();

		this.addSearchField({
			type: 'dateRange',
			field_id: 'start_date',
			text: gm.getMC('CMD_Work_Date', '생산일자'),
			sdate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
			edate: new Date()
		});

		// this.addSearchField({
		// 	type: 'combo'
		// 	, field_id: 'gubun'
		// 	, store: "ProductionGubunStore"
		// 	, displayField: 'codeName'
		// 	, valueField: 'systemCode'
		// 	, innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
		// });

		// this.addSearchField({
		//     type: 'combo',
		//      field_id: 'product_group'
		//     , emptyText: gm.getMC('CMD_Product', '제품군')
		//     , store: "CommonCodeStore"
		//     , params: { parentCode: 'PRD_GROUP' }
		//     , displayField: 'code_name_kr'
		//     , valueField: 'system_code'
		//     , value: 'code_name_kr'
		//     , innerTpl: '<div data-qtip="{system_code}">{code_name_kr}</div>'
		// });

		//  주/야간 구분 콤보
		// this.addSearchField({
		// 	type: 'combo'
		// 	, field_id: 'work_type'
		// 	, store: "ProductionWorkTypeStore"
		// 	, displayField: 'codeName'
		// 	, valueField: 'systemCode'
		// 	, innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
		// });

		//  라인명 검색조건
		this.addSearchField('name_ko');
		this.addSearchField('pcs_desc_group');

		this.addSearchField('item_name');
		// this.addSearchField('order_number');
		// this.addSearchField('final_wa_name');

		//검색툴바 생성
		var searchToolbar = this.createSearchToolbar();

		//명령툴바 생성
		var buttonToolbar = this.createCommandToolbar({
			REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE']
		});

		this.createStore('Rfx2.model.company.bioprotech.ProducePerformance', [{
			property: 'name_ko',
			direction: 'ASC'
		}],
			gMain.pageSize
			, {}
			, ['pcsmchn']
		);

		this.modifyProductionAction = Ext.create('Ext.Action', {
			iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			text: this.getMC('CMD_PERFORMANCE_REVISE', '실적수정'),
			tooltip: '해당 작업의 실적을 수정합니다',
			disabled: true,
			hidden: true,
			handler: function () {

				var rec = gm.me().grid.getSelectionModel().getSelection()[0];
				console_logs('>>>> rec', rec);
				var pcs_name = rec.get('pcs_name');
				var process_code = rec.get('pcs_code');
				var work_type = rec.get('work_type');
				var work_qty = rec.get('work_qty');
				var pcswork_uid = rec.get('unique_id_long');
				var change_date = rec.get('change_date');
				var start_date = rec.get('start_date');


				// var selections = currentTab.getSelectionModel().getSelection();
				// var selection = selections[0];

				// var radioValues = [];

				// for (var i = 0; i < pcs_codes.length; i++) {

				//     var radioValue = {
				//         boxLabel: pcs_codes[i].name,
				//         name: 'pcs_radio',
				//         readOnly: true,
				//         inputValue: selection.get(/*pcs_codes[i].code*/ processCode + i + '|step_uid'),
				//         checked: pcs_codes[i].name == pcs_name ? true : false
				//     };

				//     radioValues.push(radioValue);
				// }

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
							layout: 'column',
							title: '생산 날짜를 수정합니다.',
							defaults: {
								margin: '3 3 3 3'
							},
							items: [
								{
									xtype: 'hiddenfield',
									id: gu.id('pcswork_uid'),
									value: pcswork_uid
								},
								{
									xtype: 'datefield',
									id: gu.id('ref_date'),
									width: '96%',
									readOnly: false,
									name: 'ref_date',
									value: Ext.Date.add(new Date(start_date), 'Y-m-d'),
									submitFormat: 'Y-m-d',
									dateFormat: 'Y-m-d',
									format: 'Y-m-d',
									// fieldStyle: 'background-color: #EAEAEA; background-image: none;',
									fieldLabel: '생산일자'
								},
								// {
								//     xtype: 'datefield',
								//     id: gu.id('process_date'),
								//     width: '65%',
								//     name: 'process_date',
								//     value: Ext.Date.add(new Date(change_date), 'Y-m-d'),
								//     dateFormat: 'Y-m-d',
								//     submitFormat: 'Y-m-d',
								//     format: 'Y-m-d',
								//     fieldLabel: '입력시간',
								//     listeners: {
								//         change: function (field, newValue, oldValue) {
								//             gm.me().setRefDate();
								//         }
								//     }
								// }, 
								// {
								//     xtype: 'timefield',
								//     name: 'process_time',
								//     id: gu.id('process_time'),
								//     width: '29.6%',
								//     minValue: '0:00',
								//     maxValue: '23:30',
								//     format: 'H:i',
								//     dateFormat: 'H:i',
								//     submitFormat: 'H:i',
								//     value: gm.me().getThirtyMinites(new Date(change_date)),
								//     increment: 30,
								//     anchor: '50%',
								//     listeners: {
								//         change: function (field, newValue, oldValue) {
								//             gm.me().setRefDate();
								//         }
								//     }
								// },
								{
									xtype: 'hiddenfield',
									id: gu.id('complete_qty'),
									width: '96%',
									name: 'complete_qty',
									value: work_qty,
									//readOnly: true,
									//fieldStyle: 'background-color: #EAEAEA; background-image: none;',
									fieldLabel: '진행수량'
								},
								{
									xtype: 'hiddenfield',
									id: gu.id('previous_qty'),
									name: 'previous_qty',
									value: work_qty
								}
							]
						}
					]
				});

				var prWin = Ext.create('Ext.Window', {
					modal: true,
					title: gm.me().getMC('CMD_EDIT_PERFORMANCE', '실적수정'),
					width: 450,
					height: 200,
					items: form,
					buttons: [
						{
							text: CMD_OK,
							scope: this,
							handler: function () {

								Ext.MessageBox.show({
									title: '확인',
									msg: '실적을 수정하시겠습니까?',
									buttons: Ext.MessageBox.YESNO,
									fn: function (result) {
										if (result == 'yes') {
											var ref_date = gu.getCmp('ref_date').getValue();
											// var process_date = gu.getCmp('process_date').getValue();
											// var process_time = gu.getCmp('process_time').getValue();
											var startDate = new Date(start_date);
											var refDate = new Date(ref_date);
											refDate.setHours(startDate.getHours());
											refDate.setMinutes(startDate.getMinutes());
											var pcswork_uid = gu.getCmp('pcswork_uid').getValue();
											var complete_qty = gu.getCmp('complete_qty').getValue();
											var previous_qty = gu.getCmp('previous_qty').getValue();
											var work_type = 'day';
											console_logs('>>>> ref_date', refDate);
											Ext.Ajax.request({
												url: CONTEXT_PATH + '/index/process.do?method=updateProcessWorkPc',
												params: {
													//'pcsstep_uid': pcsCodeGroup.pcs_radio,
													'gr_quan': complete_qty,
													'previous_qty': previous_qty,
													//'do_complete': do_complete,
													'ref_date': ref_date,
													'process_date': '',
													'process_time': '',
													'work_type': work_type,
													'pcswork_uid': pcswork_uid
												},
												success: function (result, request) {
													gm.me().store.load();
													Ext.Msg.alert('안내', '수정 처리 되었습니다', function () {
													});
													prWin.close();
												},//endofsuccess
												failure: extjsUtil.failureMessage
											});//endofajax
										}
									},
									icon: Ext.MessageBox.QUESTION
								});
							}
						},
						{
							text: CMD_CANCEL,
							scope: this,
							handler: function () {
								if (prWin) {
									prWin.close();
								}
							}
						}
					]
				});

				prWin.show();
			}
		});

		var printPDFAction = {
			xtype: 'button',
			iconCls: 'af-pdf',
			text: 'PDF 출력',
			tooltip: 'PDF 출력',
			disabled: false,
			handler: function () {
				// var myObj = [];

				//     myObj.push({"item_code":"ASS-S2","item_qty":"20","prc_cd":"TOM","ma_cd":"ETOM02","user_cd":"29698872"});
				//     myObj.push({"item_code":"ASS-S3","item_qty":"30","prc_cd":"TOM","ma_cd":"ETOM02","user_cd":"29698872"});
				//     myObj.push({"item_code":"ASS-S4","item_qty":"40","prc_cd":"TOM","ma_cd":"ETOM02","user_cd":"29698872"});

				// var jsonData = Ext.util.JSON.encode(myObj)

				// Ext.Ajax.request({
				//     url: CONTEXT_PATH + '/production/popcontroller.do?method=popBuyingRequest',
				//     params:{
				//         pop_pur_info:jsonData
				//     },
				//     success : function(result, request) {

				//     },
				//     failure: extjsUtil.failureMessage
				// });
				var pcs_code = gm.me().multi_grid_id;
				pcs_name = gm.me().multi_grid_title;
				menu_code = this.link;
				console_logs('createPcsToobars code', menu_code);
				selections = gm.me().grid.getSelectionModel().getSelection();
				uids = [];

				for (var i = 0; i < selections.length; i++) {
					var rec = selections[i];
					uids.push(rec.get('unique_id_long'));
				}

				// return;

				Ext.Ajax.request({
					url: CONTEXT_PATH + '/pdf.do?method=printPs',
					params: {
						pcsstep_uids: uids,
						pdfPrint: 'pdfPrint',
						is_rotate: 'N',
						pcs_code: 'FN-WORK',
						pcs_name: pcs_name,
						menu_code: menu_code
					},
					reader: {
						pdfPath: 'pdfPath'
					},
					success: function (result, request) {
						var jsonData = Ext.JSON.decode(result.responseText);
						var pdfPath = jsonData.pdfPath;
						console_log(pdfPath);
						if (pdfPath.length > 0) {
							var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + pdfPath;
							top.location.href = url;
						}
					},
					failure: extjsUtil.failureMessage
				});
			}
		};
		// buttonToolbar.insert(1, printPDFAction);
		buttonToolbar.insert(1, this.modifyProductionAction);

		var arr = [];
		arr.push(buttonToolbar);
		arr.push(searchToolbar);

		this.setGridOnCallback(function (selections) {
			if (selections.length) {
				gm.me().modifyProductionAction.enable();
			} else {
				gm.me().modifyProductionAction.disable();
			}
		});


		//grid 생성.
		this.createGrid(arr, function () { });


		this.createCrudTab();

		Ext.apply(this, {
			layout: 'border',
			items: [this.grid, this.crudTab]
		});

		this.callParent(arguments);

		//디폴트 로드
		gMain.setCenterLoading(false);
		this.store.getProxy().setExtraParam('gubun', 'FN-WORK');
		this.store.load(function (records) {
		});
	},
	items: []
});
