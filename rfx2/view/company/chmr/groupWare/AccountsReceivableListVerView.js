Ext.define('Rfx2.view.company.chmr.groupWare.AccountsReceivableListVerView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'account-receivable-list-ver-view',


    initComponent: function () {

        //검색툴바 필드 초기화
		this.initSearchField();
		// this.addSearchField('reserved_varchard');
        // this.addSearchField('pj_name');

        var now = new Date();
        var firstDate;
        var lastDate;
        firstDate = new Date(now.getFullYear(), 1-1, 1);
        lastDate = new Date(now.getFullYear(), now.getMonth() + 1,0);

        this.addSearchField({
            type: 'dateRange',
            field_id: 'aprv_date',
            text: '발행일',
            sdate: firstDate,
            edate: lastDate
        });

        this.addSearchField({
            type: 'text',
            field_id: 'wa_name',
            emptyText: '고객명'
        });

        this.addSearchField({
            type: 'text',
            field_id: 'pj_name',
            emptyText: '현장명'
        });

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE', 'EXCEL', 'VIEW']
        });
        var searchToolbar = this.createSearchToolbar();

        //모델을 통한 스토어 생성
        this.createStore('Rfx.model.RtgTypeAd', [{
            property: 'unique_id',
            direction: 'ASC'
        }],
            gm.pageSize
            , {}
            , ['']
        );

        var arr = [];
        

        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);
        this.createCrudTab();

        // CAPAMAP 스토어
        this.curingState = Ext.create('Rfx2.store.company.chmr.ClosalStore', { pageSize: 100 });
        this.projectMoneyIn = Ext.create('Rfx2.store.company.chmr.ProjectMoneyInStore', { pageSize: 100 });
        buttonToolbar.insert(1, this.downloadSheetAction);
        

        this.receiveAction = Ext.create('Ext.Action',{
            itemId : 'receiveAction',
            iconCls: 'af-dollar',
            text : '입금 입력',
            disabled : true,
            handler: function (widget, event) {
                var selectedUid = [];
                var selection = gm.me().grid.getSelectionModel().getSelection();

                selectedUid.push(selection[0]['data']['unique_id_long']);
                var wa_name = selection[0]['data']['wa_name'];
                var combst_uid = selection[0]['data']['combst_uid'];
                var rtgast_uid = selection[0]['data']['unique_id_long'];
                var rtg_type = selection[0]['data']['rtg_type'];
                var pj_uid = selection[0]['data']['pj_uid'];
                var price = selection[0]['data']['total_price'];
                var myWidth = 600;
				var myHeight = 300;

                // var projectStore = Ext.create('Rfx2.store.company.chmr.ClosalStoreByProject', { pageSize: 100 });
                // projectStore.getProxy().setExtraParam('order_com_unique',combst_uid);
                // projectStore.load();

                var paytype = Ext.create('Ext.data.Store', {
					fields: ['var_value', 'var_name'],
					data: [
						{ "var_value": "현금", "var_name": "현금" },
						{ "var_value": "카드", "var_name": "카드" },
						{ "var_value": "어음", "var_name": "어음" }
					]
				});

                paytype.load();

                var formItems = [
                    {
						xtype: 'textfield',
						id: gu.id('wa_name'),
                        readonly : true,
						name: 'wa_name',
						padding: '0 0 5px 10px',
						style: 'width: 99%',
						allowBlank: true,
                        fieldStyle: 'background-color: #ebe8e8; background-image: none; font-weight: bold; text-align: left',
                        editable : false,
						fieldLabel: '고객사',
						value : wa_name
					},
                    {
						xtype: 'numberfield',
						id: gu.id('money'),
						name: 'money',
						padding: '0 0 5px 10px',
                        fieldStyle: 'background-color: #D9E5FF; background-image: none;  font-weight: bold; text-align: right',
						style: 'width: 99%',
						allowBlank: true,
                        value : price,
						fieldLabel: '입금금액',
					},
					{
						xtype: 'datefield',
						id: gu.id('in_date'),
						name: 'in_date',
						padding: '0 0 5px 10px',
						style: 'width: 99%',
						allowBlank: false,
						value : new Date(),
						fieldLabel: '입금일',
						format: 'Y-m-d',
					},
					{
						xtype: 'combo',
						fieldLabel: '결제방법',
						id: gu.id('pay_type'),
						padding: '0 0 5px 10px',
						store: paytype,
						width: '99%',
						name: 'pay_type',
						style: 'width: 99%',
						valueField: 'var_value',
						displayField: 'var_name',
						selectOnFocus: true,
                        // value : rec.get('pay_type'),
						emptyText: '선택해주세요.',
						listConfig: {
							loadingText: '검색중...',
							emptyText: '일치하는 항목 없음',
							getInnerTpl: function () {
								return '<div data-qtip="{var_value}">{var_name}</div>';
							}
						},
						listeners: {
							afterrender: function (combo) {

							}
						}

					},
                    {
						xtype: 'textfield',
						id: gu.id('desc'),
						name: 'desc',
						padding: '0 0 5px 10px',
						style: 'width: 99%',
						allowBlank: true,
						fieldLabel: '비고',
					},
				];

                var form = Ext.create('Ext.form.Panel', {
					id: gu.id('formPanel'),
					xtype: 'form',
					frame: false,
					border: false,
					width: '100%',
					bodyPadding: 10,
					region: 'center',
					layout: 'column',
					fieldDefaults: {
						labelAlign: 'left',
						msgTarget: 'side'
					},
					items: [
						{
							xtype: 'container',
							width: '100%',
							border: true,
							defaultMargins: {
								top: 0,
								right: 0,
								bottom: 0,
								left: 10
							},
							items: formItems

						}
					]
				})

                var item = [form];

                var prWin = Ext.create('Ext.Window', {
                    modal: true, 
                    title: '입금실행',
                    width: myWidth,
                    height: myHeight,
                    items: item,
                    buttons: [{
                        text: CMD_OK,
                        handler: function (btn) {
                            if (btn == "no") {
                                prWin.close();
                            } else {
                                if (form.isValid()) {
                                    // var rtg_type = "GS";
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/account/arap.do?method=insertMoneyIn',
                                        params: {
                                            money : gu.getCmp('money').getValue(),
											in_date : gu.getCmp('in_date').getValue(),
                                            pay_type : gu.getCmp('pay_type').getValue(),
                                            pj_uid : pj_uid,
                                            desc : gu.getCmp('desc').getValue(),
                                            combst_uid : combst_uid,
                                            rtgast_uid : rtgast_uid,
                                            rtg_type : rtg_type
                                        },
                                        success: function (result, request) {
                                            gm.me().store.load();
                                            gm.me().gridCuring.store.load();
                                            gm.me().projectMoneyIn.load();
                                            Ext.Msg.alert('안내', '입금기록이 입력되었습니다.', function () { });
                                            prWin.close();
                                        },// endofsuccess
                                        failure: extjsUtil.failureMessage
                                    });// endofajax
                                }
                            }
                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function (btn) {
                            prWin.close();
                        }
                    }]
                });
                prWin.show();
            }
        });

        this.modifyDefectAction = Ext.create('Ext.Action',{
            iconCls : 'af-edit',
            text : '입금 수정',
            tooltip : '해당 입금 내역을 수정합니다',
            disabled : true,
            handler : function(){
                var rec = gm.me().moneyInGrid.getSelectionModel().getSelection()[0];
                console_logs('rec 확인 >>>>>>>>>>>>>>>>>>>>>>',rec);

                var myWidth = 600;
				var myHeight = 250;

                var money = rec.get('money');
                var moneyin_uid = rec.get('unique_id');

                var paytype = Ext.create('Ext.data.Store', {
					fields: ['var_value', 'var_name'],
					data: [
						{ "var_value": "현금", "var_name": "현금" },
						{ "var_value": "카드", "var_name": "카드" },
						{ "var_value": "어음", "var_name": "어음" }
					]
				});

                var selection = gm.me().grid.getSelectionModel().getSelection();
                var combst_uid = selection[0]['data']['combst_uid'];
                var pj_uid = selection[0]['data']['pj_uid'];

                var formItems = [
                    {
						xtype: 'numberfield',
						id: gu.id('money'),
						name: 'money',
						padding: '0 0 5px 10px',
						style: 'width: 99%',
						allowBlank: true,
                        value : money,
						fieldLabel: '입금금액',
					},
					{
						xtype: 'datefield',
						id: gu.id('in_date'),
						name: 'in_date',
						padding: '0 0 5px 10px',
						style: 'width: 99%',
						allowBlank: true,
						value : new Date(),
						fieldLabel: '입금일',
						format: 'Y-m-d',
					},
					{
						xtype: 'combo',
						fieldLabel: '결제방법',
						id: gu.id('pay_type'),
						padding: '0 0 5px 10px',
						store: paytype,
						width: '99%',
						name: 'pay_type',
						style: 'width: 99%',
						valueField: 'var_value',
						displayField: 'var_name',
                        emptyText: '선택해주세요.',
						selectOnFocus: true,
                        value : rec.get('pay_type'),
						listConfig: {
							loadingText: '검색중...',
							emptyText: '일치하는 항목 없음',
							getInnerTpl: function () {
								return '<div data-qtip="{var_value}">{var_name}</div>';
							}
						},
						listeners: {
							afterrender: function (combo) {

							}
						}

					},
                    {
						xtype: 'textfield',
						id: gu.id('desc_edit'),
						name: 'desc',
						padding: '0 0 5px 10px',
						style: 'width: 99%',
						allowBlank: true,
						fieldLabel: '비고',
                        value : rec.get('description'),
					},
				];

                var form = Ext.create('Ext.form.Panel', {
					id: gu.id('formPanel'),
					xtype: 'form',
					frame: false,
					border: false,
					width: '100%',
					bodyPadding: 10,
					region: 'center',
					layout: 'column',
					fieldDefaults: {
						labelAlign: 'right',
						msgTarget: 'side'
					},
					items: [
						{
							xtype: 'container',
							width: '100%',
							border: true,
							defaultMargins: {
								top: 0,
								right: 0,
								bottom: 0,
								left: 10
							},
							items: formItems

						}
					]
				})

                var item = [form];

                var prWin = Ext.create('Ext.Window', {
                    modal: true, 
                    title: '입금수정',
                    width: myWidth,
                    height: myHeight,
                    items: item,
                    buttons: [{
                        text: CMD_OK,
                        handler: function (btn) {
                            if (btn == "no") {
                                prWin.close();
                            } else {
                                if (form.isValid()) {
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/account/arap.do?method=ModifyMoneyIn',
                                        params: {
                                            money : gu.getCmp('money').getValue(),
											in_date : gu.getCmp('in_date').getValue(),
                                            pay_type : gu.getCmp('pay_type').getValue(),
                                            moneyin_uid : moneyin_uid,
                                            project_uid : pj_uid,
                                            description : gu.getCmp('desc_edit').getValue()
                                        },
                                        success: function (result, request) {
                                            gm.me().store.load();
                                            gm.me().gridCuring.store.load();
                                            gm.me().projectMoneyIn.load();
                                            Ext.Msg.alert('안내', '입금 내역을 수정하였습니다.', function () { });
                                            prWin.close();
                                        },// endofsuccess
                                        failure: extjsUtil.failureMessage
                                    });// endofajax
                                }
                            }
                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function (btn) {
                            prWin.close();
                        }
                    }]
                });
                prWin.show();
            }
        });

        this.removeDefectAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: '입금 삭제',
            disabled : true,
            tooltip: '해당 입금 내역을 삭제합니다.',
            handler: function () {
                var rec = gm.me().moneyInGrid.getSelectionModel().getSelection()[0];
                var moneyin_uid = rec.get('unique_id');
                Ext.MessageBox.show({
                    title: '확인',
                    msg: '입금내역을 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        if (result == 'yes') {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/account/arap.do?method=RemoveMoneyIn',
                                params: {
                                    moneyin_uid : moneyin_uid
                                },
                                success: function (result, request) {
                                    gm.me().store.load();
                                    gm.me().gridCuring.store.load();
                                    gm.me().projectMoneyIn.load();
                                    Ext.Msg.alert('안내', '삭제 되었습니다.', function () { });
                                },
                                failure: extjsUtil.failureMessage
                            });
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.downloadSheetAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-excel',
            text: 'Excel',
            tooltip: '선택한 양생실의 현황을 다운로드 합니다.',
            disabled: true,
            handler: function () {
                gm.setCenterLoading(true);
                var rec = gm.me().grid.getSelectionModel().getSelection();
                var uids = [];
                var selections = rec[0];
                // for (var i = 0; i < rec.length; i++) {
                //     var selections = rec[i];
                //     uids.push(selections.get('unique_id_long'));
                // }
                console_logs('>>>> UIDS', uids);
                var store = Ext.create('Rfx2.store.company.chmr.ClosalStore', {});
                store.getProxy().setExtraParam("srch_type", 'excelPrint');
                store.getProxy().setExtraParam("srch_fields", 'major');
                store.getProxy().setExtraParam("srch_rows", 'all');
                store.getProxy().setExtraParam("is_excel_print", 'Y');
                store.getProxy().setExtraParam('rtgast_uid', selections.get('unique_id_long'))
                store.getProxy().setExtraParam("menuCode", 'ACT4_EXL');

                // store.getProxy().setExtraParam('orderBy', 'item_code');
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
                                    var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
                                    top.location.href = url;

                                } else {
                                    Ext.Msg.alert('경고', '엑셀 다운로드 경로를 찾을 수 없습니다.<br>엑셀 출력정책이 정의되지 않았습니다.');
                                }
                            }
                        });

                    }
                });
            }
        });

        buttonToolbar.insert(1, this.receiveAction);
        buttonToolbar.insert(2, '->');
        buttonToolbar.insert(5, this.downloadSheetAction);
        


        this.moneyInGrid = Ext.create('Ext.grid.Panel', {
            store: this.projectMoneyIn,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            flex: 1,
            bbar: getPageToolbar(this.projectMoneyIn),
            border: true,
            region: 'center',
            layout: 'fit',
            forceFit: false,
            viewConfig: {
                emptyText: '<div style="text-align:center; padding-top:10% ">조회된 데이터가 없습니다.</div>'
            },
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '5 0 0 0',
            dockedItems: [

                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        // this.receiveAction,
                        // this.modifyDefectAction,
                        // this.removeDefectAction
                    ]
                },
            ],
            columns: [
                { 
                    text: '입금 날짜', 
                    width: 120, 
                    style: 'text-align:center', 
                    align: 'left', 
                    dataIndex: 'in_date',
                    format: 'Y-m-d',
                    dateFormat: 'Y-m-d',
                    sortable: false,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d')
                },
                { 
                    text: '입금 금액',
                    width: 120, 
                    style: 'text-align:center', 
                    dataIndex: 'money',
                    align : 'right',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                { 
                    text: '지급 방법', 
                    width: 100, 
                    align: 'left',
                    style: 'text-align:center',
                    dataIndex: 'pay_type',
                },
                { 
                    text: '비고', 
                    width: 100, 
                    align: 'left',
                    style: 'text-align:center',
                    dataIndex: 'description',
                }
            ],
            title: '입금관리',
            autoScroll: true,
           
        });

        this.moneyInGrid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if (selections.length) {
                    console_logs('curing ??????', selections);
                    gm.me().modifyDefectAction.enable();
                    gm.me().removeDefectAction.enable();
                } else {
                    gm.me().modifyDefectAction.disable();
                    gm.me().removeDefectAction.disable();
                }
            }
        });

        this.gridCuring = Ext.create('Ext.grid.Panel', {
            store: this.curingState,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            bbar: getPageToolbar(this.curingState),
            border: true,
            region: 'center',
            layout: 'fit',
            flex: 1,
            forceFit: false,
            viewConfig: {
                emptyText: '<div style="text-align:center; padding-top:30% ">조회된 데이터가 없습니다.</div>'
            },
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            margin: '5 0 0 0',
            columns: [
                { 
                    text: '납품요구일자', 
                    width: 120, 
                    style: 'text-align:center', 
                    align: 'left', 
                    dataIndex: 'delivery_date',
                    format: 'Y-m-d',
                    dateFormat: 'Y-m-d',
                    sortable: false,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d')
                },
                { 
                    text: '수주번호', 
                    width: 100, 
                    style: 'text-align:center', 
                    align: 'left', 
                    dataIndex: 'pj_code',
                },
                { 
                    text: '납품요구번호', 
                    width: 100, 
                    style: 'text-align:center', 
                    align: 'left', 
                    dataIndex: 'reserved_varchard',
                },
                { 
                    text: '현장명', 
                    width: 120, 
                    style: 'text-align:center', 
                    align: 'left', 
                    dataIndex: 'pj_name',
                },
                { 
                    text: '품명', 
                    width: 140, 
                    style: 'text-align:center', 
                    align: 'left', 
                    dataIndex: 'item_name',
                },
                { 
                    text: '규격', 
                    width: 120, 
                    style: 'text-align:center', 
                    align: 'left', 
                    dataIndex: 'concat_spec_desc',
                },
                { 
                    text: '수량',
                    width: 80, 
                    align: 'left',
                    style: 'text-align:center', 
                    dataIndex: 'gr_qty',
                    align : 'right',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                { 
                    text: '단가', 
                    width: 100, 
                    align: 'left',
                    style: 'text-align:center', 
                    align : 'right',
                    dataIndex: 'sales_price',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                { 
                    text: '공급가액',
                    width: 100, 
                    align: 'left',
                    style: 'text-align:center', 
                    dataIndex: 'supply_price',
                    align : 'right',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                { 
                    text: '세액',
                    width: 100, 
                    align: 'left',
                    style: 'text-align:center', 
                    dataIndex: 'tax_rate',
                    align : 'right',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                { 
                    text: '합계', 
                    width: 140, 
                    align: 'left',
                    style: 'text-align:center', 
                    align : 'right',
                    dataIndex: 'total_price',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                }
            ],
            // title: '매출 정산 내역',
            name: 'capa',
            autoScroll: true,
            
        });

        var temp2 = {
            title: '매출정산내역',
            collapsible: false,
            frame: true,
            region: 'center',
            layout: {
                type: 'vbox',
                pack: 'start',
                align: 'stretch'
            },
            margin: '0 0 0 0',
            flex: 1,
            items: [this.gridCuring/*, this.moneyInGrid*/],
            
        };


        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    collapsible: false,
                    frame: true,
                    region: 'west',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    width: '45%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        flex: 0,
                        items: [this.grid]
                    }]
                }, temp2
            ]
        });

        this.callParent(arguments);

        //디폴트 로드
        gm.setCenterLoading(false);

        this.storeLoad();

        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                console_logs('rec ??????', selections);
                var rec = selections[0];
                var rtgast_uid = rec.get('unique_id_long');
                this.gridCuring.getStore().getProxy().setExtraParam('rtgast_uid', rtgast_uid);
                gm.me().downloadSheetAction.enable();
                gm.me().receiveAction.enable();
                this.gridCuring.getStore().load(function (record) {
                });
                gm.me().projectMoneyIn.getProxy().setExtraParam('rtg_type', rec.get('rtg_type'));
                gm.me().projectMoneyIn.getProxy().setExtraParam('combst_uid', rec.get('combst_uid'));
                gm.me().projectMoneyIn.getProxy().setExtraParam('rtgast_uid', rtgast_uid);
                gm.me().projectMoneyIn.load();
            } else {
                gm.me().downloadSheetAction.disable();
                gm.me().receiveAction.disable();
            }
        });

        this.gridCuring.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if (selections) {
                    console_logs('curing ??????', selections);
                } else {
                }
            }
        });
    },




});