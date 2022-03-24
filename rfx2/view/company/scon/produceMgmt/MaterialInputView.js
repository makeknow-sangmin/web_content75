Ext.define('Rfx2.view.company.scon.produceMgmt.MaterialInputView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'contract-material-view',
    sliagStore: Ext.create('Rfx2.store.company.chmr.RealLoadCellData', {}),

    partOneInfoStore: Ext.create('Rfx2.store.company.chmr.ProduceSummaryStore', {}),
    partTwoInfoStore: Ext.create('Rfx2.store.company.chmr.ProduceSummaryStore', {}),

    partOneWorkTimeStore: Ext.create('Rfx2.store.company.chmr.WorkTimeStorePartOne', {}),
    partTwoWorkTimeStore: Ext.create('Rfx2.store.company.chmr.WorkTimeStorePartTwo', {}),

    initComponent: function () {
        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;
        useMultitoolbar = false;
        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.setDefComboValue('standard_flag', 'valueField', 'R');

        this.addCallback('CHECK_SP_CODE', function (combo, record) {

            gMain.selPanel.refreshStandard_flag(record);

        });
        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        // remove the items
        var buttonToolbar = this.createCommandToolbar({
			REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE', 'EXCEL']
		});

        this.createStore('Rfx2.model.company.chmr.MaterialUseRatio', [{
            property: 'unique_id',
            direction: 'DESC'
        }], gm.pageSize
            , {},
            ['srcahd']
        );

        var arr = [];
        arr.push(buttonToolbar);

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        this.contractMaterialStore = Ext.create('Rfx2.store.company.chmr.MaterialUseRatioStore', { pageSize: 100 });

        this.downloadSheetActionByProduct = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-excel',
            text: '기간별 자재소모량 출력',
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
								var store = Ext.create('Rfx2.store.company.chmr.MaterialReduceRatioExcelStore', {});
								store.getProxy().setExtraParam("srch_type", 'excelPrint');
								store.getProxy().setExtraParam("srch_fields", 'major');
								store.getProxy().setExtraParam("srch_rows", 'all');
								store.getProxy().setExtraParam("is_excel_print", 'Y');
								store.getProxy().setExtraParam("menuCode", 'MATERIAL_INPUT');
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

								var start_date_parse = start_date_year.toString() + start_date_month.toString() +  start_date_day.toString();

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

								var end_date_parse = end_date_year.toString() + end_date_month.toString()+   end_date_day.toString();

								store.getProxy().setExtraParam("start_date", start_date_parse);
								store.getProxy().setExtraParam("end_date", end_date_parse);
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
										var srchId = gm.getSearchField(dataIndex);
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


        this.reduceMaterialOne = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '1공장 자재소모',
            disabled: false,
            handler: function () {

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
                            title: '1공장 자재소모를 실시합니다.<br>회전수를 정확히 입력하여 주십시오.<br><font color=red><b>위 작업은 취소할 수 없습니다.</b></font>',
                            items: [

                                {
                                    xtype: 'numberfield',
                                    fieldLabel: '회전수',
                                    id: gu.id('cycle'),
                                    anchor: '97%',
                                    name: 'cycle',
                                    value: 0
                                }
                            ]
                        }
                    ]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '1공장 자재소모',
                    width: 500,
                    height: 230,
                    items: form,
                    buttons: [
                        {
                            text: CMD_OK,
                            scope: this,
                            handler: function () {
                                Ext.MessageBox.show({
                                    title: '자재소모',
                                    msg: '입력한 회전수로 자재를 소모하겠습니까?',
                                    buttons: Ext.MessageBox.YESNO,
                                    icon: Ext.MessageBox.QUESTION,
                                    fn: function (btn) {
                                        if (btn == "no") {
                                            // gm.me().store.load();
                                            return;
                                        } else {
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/index/process.do?method=backflushingByCycle',
                                                params: {
                                                    site: 'CH01',
                                                    cycle: gu.getCmp('cycle').getValue()
                                                },
                                                success: function (val, action) {
                                                    Ext.Msg.alert('완료', '처리 되었습니다.');
                                                    gm.me().store.load();
                                                    if (prWin) {
                                                        prWin.close();
                                                    }
                                                },
                                                failure: function (val, action) {

                                                }
                                            });
                                        }
                                    }
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

        this.reduceMaterialOneEdit = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: '1공장 자재소모 수정',
            disabled: false,
            handler: function () {

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
                            title: '입력한 회전수로 기존 자재소모를 취소한 후<br>변경된 회전수로 재소모를 실시합니다.<br><font color=red><b>본 기능은 현 일자의 자재소모 기록이 존재해야 실행됩니다.</b></font>',
                            items: [

                                {
                                    xtype: 'numberfield',
                                    fieldLabel: '회전수',
                                    id: gu.id('cycle_edit'),
                                    anchor: '97%',
                                    name: 'cycle',
                                    value: 0
                                }
                            ]
                        }
                    ]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '1공장 자재소모 수정',
                    width: 500,
                    height: 230,
                    items: form,
                    buttons: [
                        {
                            text: CMD_OK,
                            scope: this,
                            handler: function () {

                                Ext.MessageBox.show({
                                    title: '자재소모 수정',
                                    msg: '입력한 회전수로 기존 자재소모를 취소한 후 변경된 회전수로 재소모를 실시하시겠습니까?',
                                    buttons: Ext.MessageBox.YESNO,
                                    icon: Ext.MessageBox.QUESTION,
                                    fn: function (btn) {
                                        if (btn == "no") {
                                            return;
                                        } else {
                                            prWin.setLoading(true);
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/index/process.do?method=backflushingByCycleEdit',
                                                waitMsg: '데이터를 처리중입니다.<br>잠시만 기다려주세요.',
                                                params: {
                                                    site: 'CH01',
                                                    cycle: gu.getCmp('cycle_edit').getValue()
                                                },
                                                success: function (val, action) {
                                                    prWin.setLoading(false);
                                                    Ext.Msg.alert('완료', '처리 되었습니다.');
                                                    gm.me().store.load();
                                                    if (prWin) {
                                                        prWin.close();
                                                    }
                                                },
                                                failure: function (val, action) {
                                                    prWin.setLoading(false);
                                                }
                                            });
                                        }
                                    }
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


        this.reduceMaterialTwo = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '2공장 자재소모',
            disabled: false,
            handler: function () {
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
                            title: '회전수를 정확히 입력하시기 바랍니다.<br><font color=red><b>위 작업은 취소할 수 없습니다.</b></font>',
                            items: [

                                {
                                    xtype: 'numberfield',
                                    fieldLabel: '회전수',
                                    id: gu.id('cycle'),
                                    anchor: '97%',
                                    name: 'cycle',
                                    value: 0
                                }
                            ]
                        }
                    ]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '2공장 자재소모',
                    width: 500,
                    height: 200,
                    items: form,
                    buttons: [
                        {
                            text: CMD_OK,
                            scope: this,
                            handler: function () {
                                Ext.MessageBox.show({
                                    title: '자재소모',
                                    msg: '입력한 회전수로 자재를 소모하겠습니까?',
                                    buttons: Ext.MessageBox.YESNO,
                                    icon: Ext.MessageBox.QUESTION,
                                    fn: function (btn) {
                                        if (btn == "no") {
                                            gm.me().contractMaterialStore.load();
                                            return;
                                        } else {
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/index/process.do?method=backflushingByCycle',
                                                params: {
                                                    site: 'CH02',
                                                    cycle: gu.getCmp('cycle').getValue()
                                                },
                                                success: function (val, action) {
                                                    Ext.Msg.alert('완료', '처리 되었습니다.');
                                                    gm.me().contractMaterialStore.load();
                                                    if (prWin) {
                                                        prWin.close();
                                                    }
                                                },
                                                failure: function (val, action) {

                                                }
                                            });
                                        }
                                    }
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

        this.reduceMaterialTwoEdit = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: '2공장 자재소모 수정',
            disabled: false,
            handler: function () {

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
                            title: '입력한 회전수로 기존 자재소모를 취소한 후<br>변경된 회전수로 재소모를 실시합니다.<br><font color=red><b>본 기능은 현 일자의 자재소모 기록이 존재해야 실행됩니다.</b></font>',
                            items: [

                                {
                                    xtype: 'numberfield',
                                    fieldLabel: '회전수',
                                    id: gu.id('cycle_edit_two'),
                                    anchor: '97%',
                                    name: 'cycle',
                                    value: 0
                                }
                            ]
                        }
                    ]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '2공장 자재소모 수정',
                    width: 500,
                    height: 230,
                    items: form,
                    buttons: [
                        {
                            text: CMD_OK,
                            scope: this,
                            handler: function () {

                                Ext.MessageBox.show({
                                    title: '자재소모 수정',
                                    msg: '입력한 회전수로 기존 자재소모를 취소한 후 변경된 회전수로 재소모를 실시하시겠습니까?',
                                    buttons: Ext.MessageBox.YESNO,
                                    icon: Ext.MessageBox.QUESTION,
                                    fn: function (btn) {
                                        if (btn == "no") {
                                            return;
                                        } else {
                                            prWin.setLoading(true);
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/index/process.do?method=backflushingByCycleEdit',
                                                waitMsg: '데이터를 처리중입니다.<br>잠시만 기다려주세요.',
                                                params: {
                                                    site: 'CH02',
                                                    cycle: gu.getCmp('cycle_edit_two').getValue()
                                                },
                                                success: function (val, action) {
                                                    prWin.setLoading(false);
                                                    Ext.Msg.alert('완료', '처리 되었습니다.');
                                                    gm.me().contractMaterialStore.load();
                                                    if (prWin) {
                                                        prWin.close();
                                                    }
                                                },
                                                failure: function (val, action) {
                                                    prWin.setLoading(false);
                                                }
                                            });
                                        }
                                    }
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

        this.writeWorkHistoryChangeOne = Ext.create('Ext.Action',{
            text : '시간변경',
            disabled : true,
            handler : function(){
                var record = gm.me().dailyWorkHistoryOne.getSelectionModel().getSelection();
                var rec = record[0];
                var pjtgongsu_uid = rec.get('unique_id_long');
                var before_start =  rec.get('start_time');
                var before_end =  rec.get('end_time');

                var form = Ext.create('Ext.form.Panel',{
                    xtype : 'form',
                    frame : false,
                    border : false,
                    bodyPadding : 10,
                    region : 'center',
                    layout : 'form',
                    fieldDefaults : {
                        labelAlign : 'right',
                        msgTarget : 'side'
                    },
                    items : [
                        {
                            xtype: 'textfield',
                            editable : false,
                            fieldLabel: '변경전 시작시간',
                            id: gu.id('start_time_before_display'),
                            anchor: '97%',
                            fieldStyle: 'background-color: #FFFCCC;',
                            name: 'start_time_one_disp',
                            value: before_start
                        },
                        {
                            xtype: 'textfield',
                            editable : false,
                            fieldLabel: '변경전 종료시간',
                            id: gu.id('end_time_before_display'),
                            anchor: '97%',
                            fieldStyle: 'background-color: #FFFCCC;',
                            name: 'end_time_one_disp',
                            value: before_end
                        },
                        {
                            xtype: 'timefield',
                            name: 'start_time',
                            minValue: '00:00',
                            maxValue: '24:00',
                            format: 'H:i',
                            increment: 10,
                            dateFormat: 'H:i',
                            submitFormat: 'H:i',
                            fieldLabel: '변경 시작시간',
                            id: gu.id('start_time_one'),
                            anchor: '97%',
                            name: 'start_time_one',
                        },
                        {
                            xtype: 'timefield',
                            name: 'end_time',
                            minValue: '00:00',
                            maxValue: '24:00',
                            format: 'H:i',
                            increment: 10,
                            dateFormat: 'H:i',
                            submitFormat: 'H:i',
                            fieldLabel: '변경 종료시간',
                            id: gu.id('end_time_one'),
                            anchor: '97%',
                            name: 'end_time_one',
                        }
                    ]
                }) // form

                var prWin = Ext.create('Ext.Window',{
                    modal : true,
                    title : '시간변경',
                    width : 400,
                    height : 250,
                    items : form,
                    buttons: [
                        {
                            text: CMD_OK,
                            scope: this,
                            handler: function () {
                                Ext.MessageBox.show({
                                    title: '시간 변경',
                                    msg: '선택한 시간으로 작업시간을 변경하시겠습니까?',
                                    buttons: Ext.MessageBox.YESNO,
                                    icon: Ext.MessageBox.QUESTION,
                                    fn: function (btn) {
                                        if (btn == "no") {
                                            return;
                                        } else {
                                            prWin.setLoading(true);
                                            var start_time = gu.getCmp('start_time_one').getValue();
                                            var end_time = gu.getCmp('end_time_one').getValue();
                                            var start_time_concat = (start_time.getHours() < 10 ? '0'+ start_time.getHours() : start_time.getHours())  + ':' + (start_time.getMinutes()  < 10 ? '0'+ start_time.getMinutes() : start_time.getMinutes());
                                            var end_time_concat = (end_time.getHours()  < 10 ? '0'+ end_time.getHours() : end_time.getHours())  + ':' + (end_time.getMinutes() < 10 ? '0'+ end_time.getMinutes() : end_time.getMinutes());
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/index/process.do?method=writeWorkHistoryChangeTime',
                                                waitMsg: '데이터를 처리중입니다.<br>잠시만 기다려주세요.',
                                                params: {
                                                    start_time: start_time_concat,
                                                    end_time : end_time_concat,
                                                    pjtgongsu_uid : pjtgongsu_uid
                                                },
                                                success: function (val, action) {
                                                    prWin.setLoading(false);
                                                    Ext.Msg.alert('완료', '처리 되었습니다.');
                                                    gm.me().partOneWorkTimeStore.load();
                                                    if (prWin) {
                                                        prWin.close();
                                                    }
                                                },
                                                failure: function (val, action) {
                                                    prWin.setLoading(false);
                                                }
                                            });
                                        }
                                    }
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
                    ] // button
                }) // prWin
                prWin.show();
            } // handler
        }); // writeWorkHistoryChange


        this.writeWorkHistoryChangeTwo = Ext.create('Ext.Action',{
            text : '시간변경',
            disabled : true,
            handler : function(){
                var record = gm.me().dailyWorkHistoryTwo.getSelectionModel().getSelection();
                var rec = record[0];
                var pjtgongsu_uid = rec.get('unique_id_long');
                var before_start =  rec.get('start_time');
                var before_end =  rec.get('end_time');

                var form = Ext.create('Ext.form.Panel',{
                    xtype : 'form',
                    frame : false,
                    border : false,
                    bodyPadding : 10,
                    region : 'center',
                    layout : 'form',
                    fieldDefaults : {
                        labelAlign : 'right',
                        msgTarget : 'side'
                    },
                    items : [
                        {
                            xtype: 'textfield',
                            editable : false,
                            fieldLabel: '변경전 시작시간',
                            id: gu.id('start_time_before_display'),
                            anchor: '97%',
                            fieldStyle: 'background-color: #FFFCCC;',
                            name: 'start_time_one_disp',
                            value: before_start
                        },
                        {
                            xtype: 'textfield',
                            editable : false,
                            fieldLabel: '변경전 종료시간',
                            id: gu.id('end_time_before_display'),
                            anchor: '97%',
                            fieldStyle: 'background-color: #FFFCCC;',
                            name: 'end_time_one_disp',
                            value: before_end
                        },
                        {
                            xtype: 'timefield',
                            name: 'start_time',
                            minValue: '00:00',
                            maxValue: '24:00',
                            format: 'H:i',
                            increment: 10,
                            dateFormat: 'H:i',
                            submitFormat: 'H:i',
                            fieldLabel: '변경 시작시간',
                            id: gu.id('start_time_one'),
                            anchor: '97%',
                            name: 'start_time_one',
                        },
                        {
                            xtype: 'timefield',
                            name: 'end_time',
                            minValue: '00:00',
                            maxValue: '24:00',
                            format: 'H:i',
                            increment: 10,
                            dateFormat: 'H:i',
                            submitFormat: 'H:i',
                            fieldLabel: '변경 종료시간',
                            id: gu.id('end_time_one'),
                            anchor: '97%',
                            name: 'end_time_one',
                        }
                    ]
                }) // form

                var prWin = Ext.create('Ext.Window',{
                    modal : true,
                    title : '시간변경',
                    width : 400,
                    height : 250,
                    items : form,
                    buttons: [
                        {
                            text: CMD_OK,
                            scope: this,
                            handler: function () {
                                Ext.MessageBox.show({
                                    title: '시간 변경',
                                    msg: '선택한 시간으로 작업시간을 변경하시겠습니까?',
                                    buttons: Ext.MessageBox.YESNO,
                                    icon: Ext.MessageBox.QUESTION,
                                    fn: function (btn) {
                                        if (btn == "no") {
                                            return;
                                        } else {
                                            prWin.setLoading(true);
                                            var start_time = gu.getCmp('start_time_one').getValue();
                                            var end_time = gu.getCmp('end_time_one').getValue();
                                            var start_time_concat = (start_time.getHours() < 10 ? '0'+ start_time.getHours() : start_time.getHours())  + ':' + (start_time.getMinutes()  < 10 ? '0'+ start_time.getMinutes() : start_time.getMinutes());
                                            var end_time_concat = (end_time.getHours()  < 10 ? '0'+ end_time.getHours() : end_time.getHours())  + ':' + (end_time.getMinutes() < 10 ? '0'+ end_time.getMinutes() : end_time.getMinutes());
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/index/process.do?method=writeWorkHistoryChangeTime',
                                                waitMsg: '데이터를 처리중입니다.<br>잠시만 기다려주세요.',
                                                params: {
                                                    start_time: start_time_concat,
                                                    end_time : end_time_concat,
                                                    pjtgongsu_uid : pjtgongsu_uid
                                                },
                                                success: function (val, action) {
                                                    prWin.setLoading(false);
                                                    Ext.Msg.alert('완료', '처리 되었습니다.');
                                                    gm.me().partTwoWorkTimeStore.load();
                                                    if (prWin) {
                                                        prWin.close();
                                                    }
                                                },
                                                failure: function (val, action) {
                                                    prWin.setLoading(false);
                                                }
                                            });
                                        }
                                    }
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
                    ] // button
                }) // prWin
                prWin.show();
            } // handler
        }); // writeWorkHistoryChange

        this.writeWorkHistoryOne = Ext.create('Ext.Action', {
            iconCls: 'af-plus',
            text: '1공장 호실별 작업시간 등록',
            disabled: false,
            handler: function () {

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
                            title: '양생실 호실과, 회전수, 작업시작 시간과 종료시간을 정확히 입력하시기 바랍니다.<br><b>현 일자에 해당 정보와 일자가 등록되어 있을 시 중복 등록되지 않습니다.</b>',
                            items: [
                                {
                                    fieldLabel: '호실',
                                    xtype: 'combo',
                                    anchor: '97%',
                                    name: 'curing_rooom',
                                    id : gu.id('machine_name'),
                                    store: Ext.create('Mplm.store.OneFactoryCuringRoomStore', {}),
                                    displayField: 'code_name_kr',
                                    valueField: 'system_code',
                                    emptyText: '양생실 호실',
                                    allowBlank: false,
                                    typeAhead: false,
                                },
                                {
                                    fieldLabel: '공정',
                                    xtype: 'combo',
                                    anchor: '97%',
                                    name: 'cycle',
                                    id : gu.id('cycle'),
                                    store: Ext.create('Mplm.store.CuringCycleStore', {}),
                                    displayField: 'code_name_kr',
                                    valueField: 'system_code',
                                    allowBlank: false,
                                    typeAhead: false,
                                },
                                {
                                    fieldLabel: '회전수',
                                    xtype: 'combo',
                                    anchor: '97%',
                                    name: 'cycle',
                                    id : gu.id('cycle'),
                                    store: Ext.create('Mplm.store.CuringCycleStore', {}),
                                    displayField: 'code_name_kr',
                                    valueField: 'system_code',
                                    allowBlank: false,
                                    typeAhead: false,
                                },
                                {
                                    fieldLabel: '공정',
                                    xtype: 'combo',
                                    anchor: '97%',
                                    name: 'process',
                                    id : gu.id('process_code'),
                                    store: Ext.create('Mplm.store.ProcessCodeStore', {}),
                                    displayField: 'code_name_kr',
                                    valueField: 'system_code',
                                    allowBlank: false,
                                    typeAhead: false,
                                },
                                {
                                    xtype: 'timefield',
                                    name: 'start_time',
                                    minValue: '00:00',
                                    maxValue: '24:00',
                                    format: 'H:i',
                                    increment: 10,
                                    dateFormat: 'H:i',
                                    submitFormat: 'H:i',
                                    fieldLabel: '시작시간',
                                    id: gu.id('start_time_one'),
                                    anchor: '97%',
                                    name: 'start_time_one',
                                    value: 0
                                },
                                {
                                    xtype: 'timefield',
                                    name: 'start_time',
                                    minValue: '00:00',
                                    maxValue: '24:00',
                                    format: 'H:i',
                                    increment: 10,
                                    dateFormat: 'H:i',
                                    submitFormat: 'H:i',
                                    fieldLabel: '종료시간',
                                    id: gu.id('end_time_one'),
                                    anchor: '97%',
                                    name: 'end_time_one',
                                    value: 0
                                }
                            ]
                        }
                    ]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '1공장 작업시간 등록',
                    width: 700,
                    height: 300,
                    items: form,
                    buttons: [
                        {
                            text: CMD_OK,
                            scope: this,
                            handler: function () {

                                Ext.MessageBox.show({
                                    title: '1공장 작업시간 등록',
                                    msg: '선택한 시간으로 작업시간을 등록하시겠습니까?',
                                    buttons: Ext.MessageBox.YESNO,
                                    icon: Ext.MessageBox.QUESTION,
                                    fn: function (btn) {
                                        if (btn == "no") {
                                            return;
                                        } else {
                                            prWin.setLoading(true);
                                            var start_time = gu.getCmp('start_time_one').getValue();
                                            var end_time = gu.getCmp('end_time_one').getValue();
                                            var start_time_concat = (start_time.getHours() < 10 ? '0'+ start_time.getHours() : start_time.getHours())  + ':' + (start_time.getMinutes()  < 10 ? '0'+ start_time.getMinutes() : start_time.getMinutes());
                                            var end_time_concat = (end_time.getHours()  < 10 ? '0'+ end_time.getHours() : end_time.getHours())  + ':' + (end_time.getMinutes() < 10 ? '0'+ end_time.getMinutes() : end_time.getMinutes());

                                            var curing_rooom = gu.getCmp('machine_name').getValue();
                                            var cycle = gu.getCmp('cycle').getValue();
                                            var process = gu.getCmp('process_code').getValue();
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/index/process.do?method=addWorkTimeHistory',
                                                waitMsg: '데이터를 처리중입니다.<br>잠시만 기다려주세요.',
                                                params: {
                                                    site: 'CH01',
                                                    start_time: start_time_concat,
                                                    end_time : end_time_concat,
                                                    curing_room : curing_rooom,
                                                    cycle : cycle,
                                                    process: process
                                                },
                                                success: function (val, action) {
                                                    prWin.setLoading(false);
                                                    Ext.Msg.alert('완료', '처리 되었습니다.');
                                                    gm.me().partOneWorkTimeStore.load();
                                                    if (prWin) {
                                                        prWin.close();
                                                    }
                                                },
                                                failure: function (val, action) {
                                                    prWin.setLoading(false);
                                                }
                                            });
                                        }
                                    }
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

        this.editWorkHistoryOne = Ext.create('Ext.Action', {
            iconCls: 'af-plus',
            text: '1공장 가동시간 입력',
            disabled: false,
            handler: function () {
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
                            title: '가동 시작시간과 종료시간을 정확히 입력하시기 바랍니다.',
                            items: [
                                {
                                    xtype: 'timefield',
                                    name: 'start_time',
                                    minValue: '00:00',
                                    maxValue: '24:00',
                                    format: 'H:i',
                                    increment: 10,
                                    dateFormat: 'H:i',
                                    allowBlank : false,
                                    submitFormat: 'H:i',
                                    fieldLabel: '시작시간',
                                    id: gu.id('start_time_one_edit'),
                                    anchor: '97%',
                                    value: 0
                                },
                                {
                                    xtype: 'timefield',
                                    name: 'start_time',
                                    minValue: '00:00',
                                    maxValue: '24:00',
                                    format: 'H:i',
                                    allowBlank : false,
                                    increment: 10,
                                    dateFormat: 'H:i',
                                    submitFormat: 'H:i',
                                    fieldLabel: '종료시간',
                                    id: gu.id('end_time_one_edit'),
                                    anchor: '97%',
                                    value: 0
                                }
                            ]
                        }
                    ]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '1공장 가동시간 입력',
                    width: 500,
                    height: 260,
                    items: form,
                    buttons: [
                        {
                            text: CMD_OK,
                            scope: this,
                            handler: function () {

                                Ext.MessageBox.show({
                                    title: '1공장 가동시간 입력',
                                    msg: '선택한 시간으로 작업시간을 입력하시겠습니까?',
                                    buttons: Ext.MessageBox.YESNO,
                                    icon: Ext.MessageBox.QUESTION,
                                    fn: function (btn) {
                                        if (btn == "no") {
                                            return;
                                        } else {
                                            prWin.setLoading(true);
                                            var start_time = gu.getCmp('start_time_one_edit').getValue();
                                            var end_time = gu.getCmp('end_time_one_edit').getValue();
                                            var start_time_concat = (start_time.getHours() < 10 ? '0'+ start_time.getHours() : start_time.getHours())  + ':' + (start_time.getMinutes()  < 10 ? '0'+ start_time.getMinutes() : start_time.getMinutes());
                                            var end_time_concat = (end_time.getHours()  < 10 ? '0'+ end_time.getHours() : end_time.getHours())  + ':' + (end_time.getMinutes() < 10 ? '0'+ end_time.getMinutes() : end_time.getMinutes());
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/index/process.do?method=addMachineWorkTimeHistory',
                                                waitMsg: '데이터를 처리중입니다.<br>잠시만 기다려주세요.',
                                                params: {
                                                    start_time: start_time_concat,
                                                    end_time : end_time_concat,
                                                    site: 'CH01',
                                                },
                                                success: function (val, action) {
                                                    prWin.setLoading(false);
                                                    Ext.Msg.alert('완료', '처리 되었습니다.');
                                                    gm.me().partOneWorkTimeStore.load();
                                                    if (prWin) {
                                                        prWin.close();
                                                    }
                                                },
                                                failure: function (val, action) {
                                                    prWin.setLoading(false);
                                                }
                                            });
                                        }
                                    }
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


        this.writeWorkHistoryTwo = Ext.create('Ext.Action', {
            iconCls: 'af-plus',
            text: '2공장 호실별 작업시간 등록',
            disabled: false,
            handler: function () {
                var selectstore =Ext.create('Mplm.store.TwoFactoryCuringRoomStore', {});
                selectstore.load();
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
                            title: '양생실 호실과, 회전수, 작업시작 시간과 종료시간을 정확히 입력하시기 바랍니다.<br><b>현 일자에 해당 정보와 일자가 등록되어 있을 시 중복 등록되지 않습니다.</b>',
                            items: [
                                {
                                    fieldLabel: '호실',
                                    xtype: 'combo',
                                    anchor: '97%',
                                    name: 'curing_rooom',
                                    id : gu.id('machine_name_two'),
                                    store: selectstore,
                                    displayField: 'code_name_kr',
                                    valueField: 'system_code',
                                    emptyText: '양생실 호실',
                                    allowBlank: false,
                                    typeAhead: false,
                                    value : 'CUR10'
                                },
                                {
                                    fieldLabel: '회전수',
                                    xtype: 'combo',
                                    anchor: '97%',
                                    name: 'cycle',
                                    id : gu.id('cycle_two'),
                                    store: Ext.create('Mplm.store.CuringCycleStore', {}),
                                    displayField: 'code_name_kr',
                                    valueField: 'system_code',
                                    allowBlank: false,
                                    typeAhead: false,
                                },
                                {
                                    fieldLabel: '공정',
                                    xtype: 'combo',
                                    anchor: '97%',
                                    name: 'process',
                                    id : gu.id('process_code_two'),
                                    store: Ext.create('Mplm.store.ProcessCodeStore', {}),
                                    displayField: 'code_name_kr',
                                    valueField: 'system_code',
                                    allowBlank: false,
                                    typeAhead: false,
                                },
                                {
                                    xtype: 'timefield',
                                    name: 'start_time',
                                    minValue: '00:00',
                                    maxValue: '24:00',
                                    format: 'H:i',
                                    increment: 10,
                                    dateFormat: 'H:i',
                                    submitFormat: 'H:i',
                                    fieldLabel: '시작시간',
                                    id: gu.id('start_time_two'),
                                    anchor: '97%',
                                    name: 'cycle',
                                    value: 0
                                },
                                {
                                    xtype: 'timefield',
                                    name: 'end_time',
                                    minValue: '00:00',
                                    maxValue: '24:00',
                                    format: 'H:i',
                                    increment: 10,
                                    dateFormat: 'H:i',
                                    submitFormat: 'H:i',
                                    fieldLabel: '종료시간',
                                    id: gu.id('end_time_two'),
                                    anchor: '97%',
                                    name: 'cycle',
                                    value: 0
                                }
                            ]
                        }
                    ]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '2공장 작업시간 등록',
                    width: 700,
                    height: 300,
                    items: form,
                    buttons: [
                        {
                            text: CMD_OK,
                            scope: this,
                            handler: function () {

                                Ext.MessageBox.show({
                                    title: '2공장 작업시간 등록',
                                    msg: '선택한 시간으로 작업시간을 등록하시겠습니까?',
                                    buttons: Ext.MessageBox.YESNO,
                                    icon: Ext.MessageBox.QUESTION,
                                    fn: function (btn) {
                                        if (btn == "no") {
                                            return;
                                        } else {
                                            prWin.setLoading(true);
                                            var start_time = gu.getCmp('start_time_two').getValue();
                                            var end_time = gu.getCmp('end_time_two').getValue();
                                            var start_time_concat = (start_time.getHours() < 10 ? '0'+ start_time.getHours() : start_time.getHours())  + ':' + (start_time.getMinutes()  < 10 ? '0'+ start_time.getMinutes() : start_time.getMinutes());
                                            var end_time_concat = (end_time.getHours()  < 10 ? '0'+ end_time.getHours() : end_time.getHours())  + ':' + (end_time.getMinutes() < 10 ? '0'+ end_time.getMinutes() : end_time.getMinutes());

                                            var curing_rooom = gu.getCmp('machine_name_two').getValue();
                                            var cycle = gu.getCmp('cycle_two').getValue();
                                            var process = gu.getCmp('process_code_two').getValue();
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/index/process.do?method=addWorkTimeHistory',
                                                waitMsg: '데이터를 처리중입니다.<br>잠시만 기다려주세요.',
                                                params: {
                                                    site: 'CH02',
                                                    start_time: start_time_concat,
                                                    end_time : end_time_concat,
                                                    curing_room : curing_rooom,
                                                    cycle : cycle,
                                                    process : process
                                                },
                                                success: function (val, action) {
                                                    prWin.setLoading(false);
                                                    Ext.Msg.alert('완료', '처리 되었습니다.');
                                                    gm.me().partTwoWorkTimeStore.load();
                                                    if (prWin) {
                                                        prWin.close();
                                                    }
                                                },
                                                failure: function (val, action) {
                                                    prWin.setLoading(false);
                                                }
                                            });
                                        }
                                    }
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


        this.editWorkHistoryTwo = Ext.create('Ext.Action', {
            iconCls: 'af-plus',
            text: '2공장 가동시간 입력',
            disabled: false,
            handler: function () {
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
                            title: '선택 일자의 작업시작 시간과 종료시간을 입력합니다.',
                            items: [
                                {
                                    xtype: 'timefield',
                                    name: 'start_time',
                                    minValue: '00:00',
                                    maxValue: '24:00',
                                    format: 'H:i',
                                    increment: 10,
                                    dateFormat: 'H:i',
                                    allowBlank : false,
                                    submitFormat: 'H:i',
                                    fieldLabel: '시작시간',
                                    id: gu.id('start_time_two_edit'),
                                    anchor: '97%',
                                    value: 0
                                },
                                {
                                    xtype: 'timefield',
                                    name: 'start_time',
                                    minValue: '00:00',
                                    maxValue: '24:00',
                                    format: 'H:i',
                                    allowBlank : false,
                                    increment: 10,
                                    dateFormat: 'H:i',
                                    submitFormat: 'H:i',
                                    fieldLabel: '종료시간',
                                    id: gu.id('end_time_two_edit'),
                                    anchor: '97%',
                                    value: 0
                                }
                            ]
                        }
                    ]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '2공장 가동시간 입력',
                    width: 500,
                    height: 260,
                    items: form,
                    buttons: [
                        {
                            text: CMD_OK,
                            scope: this,
                            handler: function () {

                                Ext.MessageBox.show({
                                    title: '1공장 가동시간 입력',
                                    msg: '선택한 시간으로 작업시간을 입력하시겠습니까?',
                                    buttons: Ext.MessageBox.YESNO,
                                    icon: Ext.MessageBox.QUESTION,
                                    fn: function (btn) {
                                        if (btn == "no") {
                                            return;
                                        } else {
                                            prWin.setLoading(true);
                                            var start_time = gu.getCmp('start_time_two_edit').getValue();
                                            var end_time = gu.getCmp('end_time_two_edit').getValue();
                                            var start_time_concat = (start_time.getHours() < 10 ? '0'+ start_time.getHours() : start_time.getHours())  + ':' + (start_time.getMinutes()  < 10 ? '0'+ start_time.getMinutes() : start_time.getMinutes());
                                            var end_time_concat = (end_time.getHours()  < 10 ? '0'+ end_time.getHours() : end_time.getHours())  + ':' + (end_time.getMinutes() < 10 ? '0'+ end_time.getMinutes() : end_time.getMinutes());
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/index/process.do?method=addMachineWorkTimeHistory',
                                                waitMsg: '데이터를 처리중입니다.<br>잠시만 기다려주세요.',
                                                params: {
                                                    start_time: start_time_concat,
                                                    end_time : end_time_concat,
                                                    site: 'CH02',
                                                },
                                                success: function (val, action) {
                                                    prWin.setLoading(false);
                                                    Ext.Msg.alert('완료', '처리 되었습니다.');
                                                    gm.me().partTwoWorkTimeStore.load();
                                                    if (prWin) {
                                                        prWin.close();
                                                    }
                                                },
                                                failure: function (val, action) {
                                                    prWin.setLoading(false);
                                                }
                                            });
                                        }
                                    }
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



        this.gridContractCompany = Ext.create('Ext.grid.Panel', {
            frame: false,
            border: false,
            width: '100%',
            collapsible: false,
            multiSelect: false,
            autoScroll: false,
            stateful : true,
            layout: 'fit',
            forceFit: true,
            store: this.partOneInfoStore,
            columns: [{
                text: '항목',
                width: 200,
                sortable: false,
                style: 'text-align:center',
                align: "left",
                dataIndex: 'properties_name'
            }, {
                text: '값',
                width: 200,
                sortable: false,
                style: 'text-align:center',
                align: "right",
                dataIndex: 'properties_value',
                renderer: function (value, context, tmeta) {
                    return Ext.util.Format.number(value, '0,00/i');
                },
            }],
            listeners: {
                itemdblclick: function(dv, record, item, index, e) {
                    var title = '';
                    var loadStore = Ext.create('Rfx2.store.company.chmr.ProduceResultByTypeStore', { pageSize: 100 });
                    if(index === 0) {
                        loadStore.getProxy().setExtraParam('site', 'CH01');
                        loadStore.getProxy().setExtraParam('type', 'daily');
                        title = '전일 양품수량 상세정보 (1공장)';
                        loadStore.load();
                    }
                    if(index === 1) {
                        loadStore.getProxy().setExtraParam('site', 'CH01');
                        loadStore.getProxy().setExtraParam('type', 'monthly');
                        title = '누적 양품수량(월) 상세정보 (1공장)';
                        loadStore.load();
                    }

                    if(index === 2) {
                        loadStore.getProxy().setExtraParam('site', 'CH01');
                        loadStore.getProxy().setExtraParam('type', 'yearly');
                        title = '누적 양품수량(년) 상세정보 (1공장)';
                        loadStore.load();
                    }

                    var loadForm = Ext.create('Ext.grid.Panel', {
                        store: loadStore,
                        // selModel: Ext.create("Ext.selection.CheckboxModel", {}),
                        id: gu.id('loadForm'),
                        layout: 'fit',
                        title : '',
                        bbar: Ext.create('Ext.PagingToolbar', {
                            store: loadStore,
                            displayInfo: true,
                            displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                            emptyMsg: "표시할 항목이 없습니다.",
                            listeners: {
                                beforechange: function (page, currentPage) {

                                }
                            }

                        }),
                        title: '총 누적수량 : ' + Ext.util.Format.number(record.get('properties_value'), '0,000') ,
                        region: 'center',
                        style: 'padding-left:0px;',
                        plugins: {
                            ptype: 'cellediting',
                            clicksToEdit: 2,
                        },
                        columns: [
                            {
                                text: "생산시작일",
                                xtype: 'datecolumn',
                                flex: 1,
                                style: 'text-align:center',
                                dataIndex: 'start_date',
                                sortable: true,
                                format: 'Y-m-d'
                            },
                            {
                                text: "품명",
                                flex: 1,
                                style: 'text-align:center',
                                dataIndex: 'item_name',
                                sortable: true,
                            },
                            {
                                text: "상세품명",
                                flex: 1,
                                dataIndex: 'description',
                                align: 'left',
                                style: 'text-align:center',
                                sortable: true,

                            },
                            {
                                text: "규격",
                                flex: 1,
                                style: 'text-align:center',
                                dataIndex: 'specification',
                                sortable: true,
                            },
                            {
                                text: "생산수량",
                                flex: 1,
                                style: 'text-align:center',
                                dataIndex: 'total_qty',
                                align : 'right',
                                sortable: true,
                                renderer: function (value, context, tmeta) {
                                    if (context.field == 'total_qty') {
                                        context.record.set('total_qty', Ext.util.Format.number(value, '0,00/i'));
                                    }
                                    if (value == null || value.length < 1) {
                                        value = 0;
                                    }
                                    return Ext.util.Format.number(value, '0,00/i');
                                },
                            },
                        ],
                        renderTo: Ext.getBody(),
                        autoScroll: true,
                        multiSelect: true,
                        pageSize: 100,
                        width: 100,
                        height: 300,
                        dockedItems: [
                            {
                                dock: 'top',
                                xtype: 'toolbar',
                                cls: '',
                                items: ['->', this.deleteWthList]
                            }
                        ]
                    });

                    loadForm.getSelectionModel().on({
                        selectionchange: function (sm, selections) {
                            if (selections.length) {
                                var rec = selections[0];
                            }
                        }
                    });

                    var winProduct = Ext.create('ModalWindow', {
                        title: title,
                        width: 200,
                        height: 600,
                        minWidth: 600,
                        minHeight: 300,
                        items: [
                            // searchPalletGrid, 
                            loadForm
                        ],
                        buttons: [{
                            text: CMD_OK,
                            handler: function (btn) {
                                winProduct.setLoading(false);
                                winProduct.close();
                            }
                        }]
                    });
                    winProduct.show();

                }
            },
            viewConfig : {
                stripeRows : true,
                enableTextSelection : false
            },
            title: '1공장 상세정보',
            // name: 'po',
            autoScroll: true,

        });

        this.dailyWorkHistoryOne = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
			id: gu.id('dailyWorkHistoryOne'),
			store: this.partOneWorkTimeStore,
			viewConfig: {
				markDirty: false
			},
			collapsible: false,
			multiSelect: false,
			region: 'center',
			autoScroll: true,
			autoHeight: true,
			flex: 1,
			frame: true,
			bbar: getPageToolbar(this.partOneWorkTimeStore),
			border: true,
			layout: 'fit',
			forceFit: true,
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
					items: [
						this.writeWorkHistoryOne,
                        this.editWorkHistoryOne,
                        this.writeWorkHistoryChangeOne
					]
				},
			],
			columns: [
				{
					text: '입력일자',
					width: 100,
					style: 'text-align:center',
					dataIndex: 'base_date_str',
					sortable: true
				},
                {
					text: '구분',
					width: 80,
					style: 'text-align:center',
					dataIndex: 'input_type',
					sortable: true
				},
                {
					text: '호실',
					width: 80,
					style: 'text-align:center',
					dataIndex: 'name_ko',
					sortable: true
				},
                {
					text: '공정명',
					width: 80,
					style: 'text-align:center',
					dataIndex: 'jobtoday_detail',
					sortable: true
				},

                {
                    text: '회전수',
                    width: 80,
                    style: 'text-align:center',
                    dataIndex: 'waste_type',
                    sortable: true
                },
				{
					text: '시작시간',
					width: 80,
					style: 'text-align:center',
					dataIndex: 'start_time',
					sortable: true
				},
				{
					text: '종료시간',
					width: 80,
					style: 'text-align:center',
					dataIndex: 'end_time',
					sortable: true
				},
			],
			autoScroll: true,

        });

        this.dailyWorkHistoryOne.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length) {
                    var rec = selections[0];
                    gm.me().writeWorkHistoryChangeOne.enable();
                } else {
                    gm.me().writeWorkHistoryChangeOne.disable();
                }
            }
        });

        this.dailyWorkHistoryTwo = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
			id: gu.id('dailyWorkHistoryTwo'),
			store: this.partTwoWorkTimeStore,
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
			bbar: getPageToolbar(this.partTwoWorkTimeStore),
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
					items: [
						this.writeWorkHistoryTwo,
                        this.editWorkHistoryTwo,
                        this.writeWorkHistoryChangeTwo
					]
				},
			],
			columns: [
				{
					text: '입력일자',
					width: 100,
					style: 'text-align:center',
					dataIndex: 'base_date_str',
					sortable: true
				},
                {
					text: '구분',
					width: 80,
					style: 'text-align:center',
					dataIndex: 'input_type',
					sortable: true
				},
                {
					text: '호실',
					width: 80,
					style: 'text-align:center',
					dataIndex: 'name_ko',
					sortable: true
				},
                {
					text: '공정명',
					width: 80,
					style: 'text-align:center',
					dataIndex: 'jobtoday_detail',
					sortable: true
				},
                {
                    text: '회전수',
                    width: 80,
                    style: 'text-align:center',
                    dataIndex: 'waste_type',
                    sortable: true
                },
				{
					text: '시작시간',
					width: 80,
					style: 'text-align:center',
					dataIndex: 'start_time',
					sortable: true
				},
				{
					text: '종료시간',
					width: 80,
					style: 'text-align:center',
					dataIndex: 'end_time',
					sortable: true
				},

			],
			// title: '2공장 작업시간',
			// name: 'po',
			autoScroll: true,

        });

        this.dailyWorkHistoryTwo.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length) {
                    var rec = selections[0];
                    gm.me().editWorkHistoryTwo.enable();
                    gm.me().writeWorkHistoryChangeTwo.enable();
                } else {
                    gm.me().editWorkHistoryTwo.disable();
                    gm.me().writeWorkHistoryChangeTwo.disable();
                }
            }
        });

        this.gridContractMaterial = Ext.create('Ext.grid.Panel', {
            frame: false,
            border: false,
            width: '100%',
            collapsible: false,
            multiSelect: false,
            autoScroll: false,
            layout: 'fit',
            forceFit: true,
            store: this.partTwoInfoStore,
            columns: [{
                text: '항목',
                width: 200,
                sortable: false,
                style: 'text-align:center',
                align: "left",
                dataIndex: 'properties_name'
            }, {
                text: '값',
                width: 200,
                sortable: false,
                style: 'text-align:center',
                align: "right",
                dataIndex: 'properties_value',
                renderer: function (value, context, tmeta) {
                    return Ext.util.Format.number(value, '0,00/i');
                },
            }],
            title: '2공장 상세정보',
            name: 'po',
            autoScroll: true,
            listeners: {
                itemdblclick: function(dv, record, item, index, e) {
                    var title = '';
                    var loadStore = Ext.create('Rfx2.store.company.chmr.ProduceResultByTypeStore', { pageSize: 100 });
                    if(index === 0) {
                        loadStore.getProxy().setExtraParam('site', 'CH02');
                        loadStore.getProxy().setExtraParam('type', 'daily');
                        title = '전일 양품수량 상세정보 (2공장)';
                        loadStore.load();
                    }
                    if(index === 1) {
                        loadStore.getProxy().setExtraParam('site', 'CH02');
                        loadStore.getProxy().setExtraParam('type', 'monthly');
                        title = '누적 양품수량(월) 상세정보 (2공장)';
                        loadStore.load();
                    }

                    if(index === 2) {
                        loadStore.getProxy().setExtraParam('site', 'CH02');
                        loadStore.getProxy().setExtraParam('type', 'yearly');
                        title = '누적 양품수량(년) 상세정보 (2공장)';
                        loadStore.load();
                    }

                    var loadForm = Ext.create('Ext.grid.Panel', {
                        store: loadStore,
                        id: gu.id('loadForm'),
                        layout: 'fit',
                        title : '',
                        bbar: Ext.create('Ext.PagingToolbar', {
                            store: loadStore,
                            displayInfo: true,
                            displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                            emptyMsg: "표시할 항목이 없습니다.",
                            listeners: {
                                beforechange: function (page, currentPage) {

                                }
                            }

                        }),
                        title: '총 누적수량 : ' + Ext.util.Format.number(record.get('properties_value'), '0,000') ,
                        region: 'center',
                        style: 'padding-left:0px;',
                        plugins: {
                            ptype: 'cellediting',
                            clicksToEdit: 2,
                        },
                        columns: [
                            {
                                text: "생산시작일",
                                xtype: 'datecolumn',
                                flex: 1,
                                style: 'text-align:center',
                                dataIndex: 'start_date',
                                sortable: true,
                                format: 'Y-m-d'
                            },
                            {
                                text: "품명",
                                flex: 1,
                                style: 'text-align:center',
                                dataIndex: 'item_name',
                                sortable: true,
                            },
                            {
                                text: "상세품명",
                                flex: 1,
                                dataIndex: 'description',
                                align: 'left',
                                style: 'text-align:center',
                                sortable: true,

                            },
                            {
                                text: "규격",
                                flex: 1,
                                style: 'text-align:center',
                                dataIndex: 'specification',
                                sortable: true,
                            },
                            {
                                text: "생산수량",
                                flex: 1,
                                style: 'text-align:center',
                                dataIndex: 'total_qty',
                                align : 'right',
                                sortable: true,
                                renderer: function (value, context, tmeta) {
                                    if (context.field == 'total_qty') {
                                        context.record.set('total_qty', Ext.util.Format.number(value, '0,00/i'));
                                    }
                                    if (value == null || value.length < 1) {
                                        value = 0;
                                    }
                                    return Ext.util.Format.number(value, '0,00/i');
                                },
                            },
                        ],
                        renderTo: Ext.getBody(),
                        autoScroll: true,
                        multiSelect: true,
                        pageSize: 100,
                        width: 200,
                        height: 400,

                    });

                    loadForm.getSelectionModel().on({
                        selectionchange: function (sm, selections) {
                            if (selections.length) {
                                var rec = selections[0];
                            }
                        }
                    });

                    var winProduct = Ext.create('ModalWindow', {
                        title: title,
                        width: 200,
                        height: 600,
                        minWidth: 600,
                        minHeight: 300,
                        items: [
                            // searchPalletGrid, 
                            loadForm
                        ],
                        buttons: [{
                            text: CMD_OK,
                            handler: function (btn) {
                                winProduct.setLoading(false);
                                winProduct.close();
                            }
                        }]
                    });
                    winProduct.show();

                }
            },
            viewConfig : {
                stripeRows : true,
                enableTextSelection : false
            },
        });

        Ext.each(this.gridContractCompany.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            switch (dataIndex) {
                case 'sales_price':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
            }

            switch (dataIndex) {
                case 'sales_price':
                    columnObj["renderer"] = function (value, meta) {
                        if (meta != null) {
                            meta.css = 'custom-column';
                        }
                        return Ext.util.Format.number(value, '0,00.#####');
                    };
                    break;
                default:
                    break;
            }

        });

        Ext.each(this.gridContractMaterial.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            switch (dataIndex) {
                case 'sales_price':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
            }

            switch (dataIndex) {
                case 'sales_price':
                    columnObj["renderer"] = function (value, meta) {
                        if (meta != null) {
                            meta.css = 'custom-column';
                        }
                        return Ext.util.Format.number(value, '0,00.#####');
                    };
                    break;
                default:
                    break;
            }
        });

        var realLoadCellData = Ext.create('Ext.grid.Panel', {
            store: this.sliagStore,
            id: 'realLoadCellData',
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: false,
            id: gu.id('realLoadCellData'),
            autoHeight: false,
            frame: false,
            layout: 'fit',
            forceFit: true,
            width: '100%',
            columns: [{
                text: '자재',
                width: 50,
                sortable: true,
                style: 'text-align:center',
                align: "left",
                dataIndex: 'properties_name'
            }, {
                text: '값',
                width: 50,
                sortable: true,
                style: 'text-align:center',
                align: "right",
                dataIndex: 'properties_value'
            }],
            listeners: {

                afterrender: function () {
                    var store = gm.me().sliagStore;

                    var runner = new Ext.util.TaskRunner();
                    todayStatusTask = runner.newTask({
                        run: function () {
                            console_logs('>>>>', 'timer on');
                            store.load();
                        },
                        interval: 60000 //60초
                    });
                    todayStatusTask.start();
                },

                onDestroy: function () {
                    todayStatusTask.destroy();
                 },

            },
        });

        var temp = {
            title: '실시간 계량기 데이터',
            collapsible: false,
            frame: true,
            region: 'west',
            layout: {
                type: 'vbox',
                pack: 'start',
                align: 'stretch'
            },
            margin: '0 0 0 0',
            flex: 2.0,
            items: [realLoadCellData]

        };


        //grid 생성.
        this.createGrid(arr);

        this.createCrudTab();

        this.grid.flex = 1;


        this.newButtonToolBar = buttonToolbar;
        this.newSearchToolBar = searchToolbar;


        this.purListSrch = Ext.create('Ext.Action', {
            itemId: 'putListSrch',
            iconCls: 'af-search',
            text: CMD_SEARCH/*'검색'*/,
            disabled: false,
            handler: function (widget, event) {
                try {
                    // var wa_name = '';

                    // if (Ext.getCmp('supplier_name').getValue().length > 0) {
                    //     reserved_varcharh = Ext.getCmp('supplier_name').getValue();
                    // }
                } catch (e) {

                }
                gm.me().supastStore.getProxy().setExtraParam('supplier_name', '%' + wa_name + '%');
                gm.me().supastStore.load();
            }
        });

        this.twoGrid = Ext.create('Rfx2.base.BaseGrid', {
            cls: 'rfx-panel',
            id: gu.id('twoGrid'),
            selModel: 'checkboxmodel',
            store: this.contractMaterialStore,
            columns: [
                {
                    text: '소모일자',
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'stock_date_format'
                },
                {
                    text: '소모자재',
                    width: 200,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'item_name'
                },
                {
                    text: '소요량',
                    width: 100,
                    sortable: true,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'use_qty',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: '회전수',
                    width: 100,
                    sortable: true,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'gr_qty',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },

            ],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        this.purListSrch,
                        this.reduceMaterialTwo,
                        this.reduceMaterialTwoEdit
                    ]
                },
                // {
                //     dock: 'top',
                //     xtype: 'toolbar',
                //     cls: 'my-x-toolbar-default1',
                //     layout: 'column',
                //     defaults: {
                //         style: 'margin-top: 1px; margin-bottom: 1px;'
                //     },
                //     items: [{
                //         xtype: 'triggerfield',
                //         emptyText: '공급사',
                //         id: gu.id('supplier_name'),
                //         width: 130,
                //         fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                //         name: 'query_sup',
                //         listeners: {
                //             specialkey: function (field, e) {
                //                 if (e.getKey() == Ext.EventObject.ENTER) {
                //                     gm.me().supastStore.getProxy().setExtraParam('supplier_name', '%' + gu.getCmp('supplier_name').getValue() + '%');
                //                     gm.me().supastStore.load(function () { });
                //                 }
                //             }
                //         },
                //         trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                //         'onTrigger1Click': function () {
                //             gu.getCmp('supplier_name').setValue('');
                //             this.supastStore.getProxy().setExtraParam('supplier_name', gu.getCmp('supplier_name').getValue());
                //             this.supastStore.load(function () { });
                //         }
                //     }]
                // }
            ],
            scrollable: true,
            flex: 1,
            bbar: Ext.create('Ext.PagingToolbar', {
                store: this.supastStore,
                displayInfo: true,
                displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                emptyMsg: "표시할 항목이 없습니다.",
                listeners: {
                    beforechange: function (page, currentPage) {
                        // console_logs('여기++++++++++++++++++++++++++++++++++++++++ : ', record);
                    }
                }

            }),
            viewConfig: {
                markDirty: false,
                stripeRows: true,
                enableTextSelection: false,
                preserveScrollOnReload: true,
                getRowClass: function (record, index) {
                    var recv_flag = record.get('recv_flag');
                    switch (recv_flag) {
                        case 'EM':
                            return 'yellow-row';
                            break;
                        case 'SE':
                            return 'red-row';
                            break;
                    }
                }
            },
            listeners: {
                afterrender: function (grid) {
                    var elments = Ext.select(".x-column-header", true);
                    elments.each(function (el) {
                    }, this);
                },
                cellclick: function (iView, iCellEl, iColIdx, iRecord, iRowEl, iRowIdx, iEvent) {
                    this.selColIdx = iColIdx;
                    console_logs('iColIdx', this.selColIdx);
                },
                edit: function (editor, e, eOpts) {
                    console_logs('record', e.record);
                    var idx = this.selColIdx;
                    var pos = Math.trunc(idx / 2);
                    var type = idx % 2 == 1 ? 'time' : 'human';
                    var name = type + (pos + 1);
                    var val = e.record.get(name);
                    console.log(name, val);
                }
            }
        });

        var leftContainer = new Ext.container.Container({
            title: this.getMC('msg_sales_price_tab1', '1공장'),
            region: 'center',
            layout: {
                type: 'border'
            },
            defaults: {
                collapsible: true,
                split: true
            },
            items: [
                {
                    collapsible: false,
                    frame: false,
                    region: 'north',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    flex: 2.0,
                    items: [
                        {
                            //title: '제품 및 템플릿 선택',
                            collapsible: false,
                            frame: true,
                            region: 'west',
                            layout: {
                                type: 'hbox',
                                pack: 'start',
                                align: 'stretch'
                            },
                            margin: '5 0 0 0',
                            width: '53%',
                            items: [{
                                region: 'west',
                                layout: 'fit',
                                margin: '0 0 0 0',
                                width: '100%',
                                items: [this.grid]
                            }]
                        }, this.dailyWorkHistoryOne
                    ]

                },
                {
                    collapsible: false,
                    frame: false,
                    region: 'center',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    flex: 1,
                    items: [this.gridContractCompany]
                }
            ]
        });

        this.twoGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                // gm.me().removeContractMatAction.disable();
                if (selections.length) {
                    var rec = selections[0];

                    // var supName = rec.get('supplier_name');

                    // gu.getCmp('selectedCompany').setHtml(supName);
                    // gm.me().contractMaterialByCompanyListStore.getProxy().setExtraParam('supast_uid', rec.get('unique_id_long'));
                    // gm.me().contractMaterialByCompanyListStore.getProxy().setExtraParam('fix_type', 'PR');    // 판매용 단가 리스트 구분
                    // gm.me().contractMaterialByCompanyListStore.load();
                    // gm.me().addContractMatByCompanyAction.enable();
                } else {
                    // gm.me().addContractMatByCompanyAction.disable();
                }
            }
        });

        var rightContainer = new Ext.container.Container({
            title: '2공장',
            region: 'center',
            layout: {
                type: 'border'
            },
            defaults: {
                collapsible: true,
                split: true
            },
            items: [
                {
                    collapsible: false,
                    frame: false,
                    region: 'north',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    flex: 2.0,
                    items: [
                        {
                            //title: '제품 및 템플릿 선택',
                            collapsible: false,
                            frame: true,
                            region: 'west',
                            layout: {
                                type: 'hbox',
                                pack: 'start',
                                align: 'stretch'
                            },
                            margin: '5 0 0 0',
                            width: '53%',
                            items: [{
                                region: 'west',
                                layout: 'fit',
                                margin: '0 0 0 0',
                                width: '100%',
                                items: [this.twoGrid]
                            }]
                        }, this.dailyWorkHistoryTwo
                    ]

                },
                {
                    collapsible: false,
                    frame: false,
                    region: 'center',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    flex: 1,
                    items: [this.gridContractMaterial]
                }
            ]
        });

        var mainTab = Ext.widget('tabpanel', {
            layout: 'border',
            border: true,
            region: 'center',
            tabPosition: 'top',
            items: [leftContainer, rightContainer]
        });

        Ext.apply(this, {
            layout: 'border',
            items: [{
                collapsible: false,
                frame: false,
                region: 'west',
                layout: {
                    type: 'hbox',
                    pack: 'start',
                    align: 'stretch'
                },
                margin: '5 0 0 0',
                width: '73%',
                items: [{
                    region: 'west',
                    layout: 'fit',
                    margin: '0 0 0 0',
                    width: '100%',
                    items: [mainTab]
                }]
            }, {
                collapsible: false,
                frame: false,
                region: 'center',
                layout: 'border',
                margin: '5 0 0 0',
                width: '20%',
                items: [
                    {
                        collapsible: false,
                        frame: false,
                        region: 'north',
                        split: true,
                        layout: {
                            type: 'hbox',
                            pack: 'start',
                            align: 'stretch'
                        },
                        height: '99%',
                        items: [temp]
                    },

                ]
            }]
        });

        //버튼 추가.
        buttonToolbar.insert(6, '-');
        buttonToolbar.insert(1, this.reduceMaterialOne);
        buttonToolbar.insert(2, this.reduceMaterialOneEdit);
        buttonToolbar.insert(3, '->');
        buttonToolbar.insert(6, this.downloadSheetActionByProduct);
        // buttonToolbar.insert(6, this.setSubMatView);
        // buttonToolbar.insert(6, this.setSaMatView);
        // buttonToolbar.insert(6, this.setSetMatView);
        // buttonToolbar.insert(6, this.setAssyMatView);
        // buttonToolbar.insert(6, this.setAllMatView);

        buttonToolbar.insert(6, '-');

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            // this.removeContractMatAction.disable();
            if (selections.length) {
                var rec = selections[0];

                // var itemCode = rec.get('item_code');
                // var itemName = rec.get('item_name');
                // var specification = rec.get('specification');

                // gu.getCmp('selectedMtrl').setHtml('[' + itemCode + '] ' + itemName + ' / ' + specification);
                // this.contractMaterialStore.getProxy().setExtraParam('srcahd_uid', rec.get('unique_id_long'));
                // this.contractMaterialStore.getProxy().setExtraParam('fix_type', 'PR');
                // this.contractMaterialStore.load();
                // this.addContractMatAction.enable();
            } else {
                // this.addContractMatAction.disable();
            }
        })

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.getProxy().setExtraParam('comcst_code', 'CH01');
        this.store.load(function (records) {
        });

        this.contractMaterialStore.getProxy().setExtraParam('comcst_code', 'CH02');
        this.contractMaterialStore.load(function (records) {
        });



        this.partOneInfoStore.getProxy().setExtraParam('produce_site', 'CH01');
        this.partOneInfoStore.load();

        this.partTwoInfoStore.getProxy().setExtraParam('produce_site', 'CH02');
        this.partTwoInfoStore.load();
        this.sliagStore.load();

        this.partOneWorkTimeStore.load();
        this.partTwoWorkTimeStore.load();
    },

    addContractMat: function (val, win) {
        Ext.MessageBox.show({
            title: '계약',
            msg: '이 회사와 자재를 계약 처리 하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn: function (btn) {
                if (btn == 'yes') {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/purchase/material.do?method=addContractMat',
                        params: {
                            currency: val['currency'],
                            sales_price: val['sales_price'],
                            srcahd_uid: val['unique_id'],
                            supast_uid: val['supast_uid'],
                            start_date: val['start_date'],
                            end_date: val['end_date']
                        },
                        success: function (result, request) {
                            var resultText = result.responseText;
                            console_log('result:' + resultText);
                            gu.getCmp('gridContractCompany').getStore().load();
                            gm.me().store.load();
                            if (win) {
                                win.close();
                            }
                        },
                        failure: extjsUtil.failureMessage
                    });//endof ajax request
                }
            },
            icon: Ext.MessageBox.QUESTION
        });
    },

    searchStore: Ext.create('Rfx2.store.company.kbtech.MaterialStore', {})
});
var todayStatusTask;


