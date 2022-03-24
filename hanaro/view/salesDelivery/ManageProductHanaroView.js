//제품생산 바코드 출력
Ext.define('Hanaro.view.salesDelivery.ManageProductHanaroView', {
    extend: 'Hanaro.base.HanaroBaseView',
    xtype: 'manage-product-view',
    initComponent: function(){
    
    	//검색툴바 필드 초기화
    	this.initSearchField();
	
		//this.addSearchField('unique_id');
		this.addSearchField('barcode');
		this.addSearchField('item_name');
		this.addSearchField('specification');
		this.addSearchField('item_code');
		
    	this.setDefValue('create_date', new Date());
    	
    	var next7 = gUtil.getNextday(7);
    	this.setDefValue('change_date', next7);
    	
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
		var buttonToolbar = this.createCommandToolbar();
		
		(buttonToolbar.items).each(function(item, index, length) {
			if (index == 1 || index == 2  || index == 3 || index == 4 || index == 5) {
				buttonToolbar.items.remove(item);
			}
		});

        this.createStoreSimple({
			modelClass: 'Rfx2.model.company.hanaro.ProductMgmtHanaro',
			//modelClass: 'Rfx.model.ManageProduct',
			pageSize: 100,
			sorters: [{
				property: 'unique_id',
				direction: 'desc'
			}],
			byReplacer: {

			},
			deleteClass: ['product']

		}, {
			//groupField: 'parent_code'
		});

		this.store.getProxy().setExtraParam('bom_flag', 'T');
		this.store.getProxy().setExtraParam('sg_code', 'BOM');
		this.store.getProxy().setExtraParam('ac_uid', '-1');
		//this.store.getProxy().setExtraParam('parent_uid', '-1');
        
		this.doProduceAction = Ext.create('Ext.Action', {
			xtype : 'button',
			text: '생산작업지시',
			tooltip: '생산작업지시',
			iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			disabled: true,
		//pressed: true,
			handler: function() {
				gm.me().registPj();
			}
		});
		// 바코드 출력 버튼
		this.barcodePrintAction = Ext.create('Ext.Action', {
			iconCls: 'barcode',
			text: '제품바코드',
			tooltip: '제품의 바코드를 출력합니다.',
			hidden: (vCompanyReserved4 == 'KSCM01KR'),
			disabled: true,
			handler: function () {
				gm.me().printBarcode();
			}
		});


		buttonToolbar.insert(1, '-');
		buttonToolbar.insert(2, this.barcodePrintAction);
		buttonToolbar.insert(2, '-');
		buttonToolbar.insert(2, this.doProduceAction);
        
        var arr=[];
        arr.push(buttonToolbar);
		arr.push(searchToolbar);
		
		Ext.each(this.columns, function(columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
			switch(dataIndex) {
				case 'ship_req_qty':
					columnObj["renderer"] = function(value, meta) {
						meta.css = 'custom-column';
						return value;
					};
				break;
			}
		});
        

		// 안전재고수량 보다 출하가능수량이 적으면 표시
		this.rowClassFc = function(record, index) {
			var ship_avail_qty = record.get('ship_avail_qty');
				stock_qty_safe	= record.get('stock_qty_safe');

				if(ship_avail_qty == null || ship_avail_qty == undefined) {
					ship_avail_qty = 0;
				}
				if(stock_qty_safe == null || stock_qty_safe == undefined) {
					stock_qty_safe = 0;
				}
				 
				if(ship_avail_qty < stock_qty_safe) {
					return 'red-row';
				}
		}
        
      //grid 생성.
        //this.createGrid(searchToolbar, buttonToolbar);
		this.createGrid(arr);
		
		this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
			items: [this.grid, this.crudTab]
        });


		this.callParent(arguments);
		
  
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
				gm.me().doProduceAction.enable();

				gm.me().barcodePrintAction.enable();

				var rec = gm.me().grid.getSelectionModel().getSelection()[0];
				if(rec==null) {
					return;
				}
				var stock_quan = rec.get('stock_qty');
				var product_uid = rec.get('unique_id_long');

            } else {
            	gm.me().doProduceAction.disable();
				gm.me().barcodePrintAction.disable();
            }
        	
        });

        //디폴트 로드
      
        gMain.setCenterLoading(false);
        
        this.store.load();

	},
	printBarcode: function () {
		var selection = gm.me().grid.getSelectionModel().getSelection()[0];
		var item_code = selection.get('item_code');
		var specification = selection.get('specification');
		var item_name = selection.get('item_name');
		var product_uid = selection.get('product_uid');
		var order_multiple = selection.get('order_multiple');
		Ext.Ajax.request({
			url: CONTEXT_PATH + '/index/process.do?method=getLotlistByTopAssy',				
			params:{
				topProduct_uid : product_uid
			},
			
			success : function(result, request) {
				var resultText = result.responseText;
				console_logs('resultText', resultText);
				var form = Ext.create('Ext.form.Panel', {
					id: gu.id('formPanel'),
					xtype: 'form',
					frame: false,
					border: false,
					bodyPadding: '5 5 5 5',
					region: 'center',
					
					layout: {
						type: 'vbox',
						align: 'stretch'
					},
					fieldDefaults: {
						labelAlign: 'right',
						msgTarget: 'side'
					},
					defaults: {
						anchor: '100%',
						labelWidth: 60,
						margins: 10,
					},
					
					items : [
						{
							xtype: 'fieldcontainer',
							flex:1,
							layout: {
								type: 'vbox',
								align: 'stretch'
							},
							bodyPadding: '15 15 15 15',
							items: [
								{
									xtype: 'textfield',
									fieldLabel: '제품번호',
									margin: '3 3 3 3',
									allowBlank: true,
									value: item_code,
									readOnly: true,
									fieldStyle: 'overflow:scroll ;overflow-x:hidden; background-color: #F0F0F0; background-image: none;border-bottom: #999999 1px solid;border-left: #999999 1px solid;border-right: #999999 1px solid;border-top: #999999 1px solid;',
								},
								{
									xtype: 'textfield',
									fieldLabel: '품명',
									margin: '3 3 3 3',
									allowBlank: true,
									value: item_name,
									readOnly: true,
									fieldStyle: 'overflow:scroll ;overflow-x:hidden; background-color: #F0F0F0; background-image: none;border-bottom: #999999 1px solid;border-left: #999999 1px solid;border-right: #999999 1px solid;border-top: #999999 1px solid;',

								},
								{
									xtype: 'textfield',
									fieldLabel: '규격',
									margin: '3 3 3 3',
									value: specification,
									readOnly: true,
									fieldStyle: 'overflow:scroll ;overflow-x:hidden; background-color: #F0F0F0; background-image: none;border-bottom: #999999 1px solid;border-left: #999999 1px solid;border-right: #999999 1px solid;border-top: #999999 1px solid;',

								}
							]
						},
						
							{

								xtype: 'fieldcontainer',
								flex:1,
								layout: {
									type: 'hbox',
									align: 'stretch'
								},
								items: [
									{
										xtype: 'fieldset',
										title: '제품 바코드',
										collapsible: false,
										margin: '10 10 10 10',
										flex: 1,
										height:160,
										defaults: {
											labelWidth: 60,
											anchor: '100%',
											layout: {
												type: 'hbox',
												defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
											}
										},
										items: [
												{
													xtype: 'numberfield',
													name: 'print_qty',
													fieldLabel: '출력매수',
													margin: '5 5 5 5',
													width: 200,
													allowBlank: false,
													value: 1,
													maxlength: '1',
												},
												{
													xtype: 'radiogroup',
													fieldLabel: '출력 구분',
													margin: '5 5 5 5',
													width: 200,
													allowBlank: false,
													items: [
														{boxLabel: '개별', name: 'print_type', inputValue: 'EACH', checked: true},
														{boxLabel: '동일', name: 'print_type', inputValue: 'SAME'},
													]
												},
												{
													xtype: 'numberfield',
													name: 'order_multiple',
													fieldLabel: '포장단위',
													emptyText: '포장단위',
													margin: '5 5 5 5',
													width: 200,
													allowBlank: true,
													value: order_multiple,
												}
					
										]
									}, //endof fieldset
									{
										xtype: 'fieldset',
										title: '자재생산 LOT 연결',
										collapsible: true,
										collapsed: true,
										margin: '10 10 10 10',
										flex: 1,
										height:160,
										defaults: {
											labelWidth: 60,
											anchor: '100%',
											layout: {
												type: 'hbox',
												defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
											}
										},
										items: [
											{
												xtype: 'triggerfield',
												name: 'lot_no1',
												fieldLabel: 'LOT 번호1',
												emptyText: 'LOT 번호1',
												margin: '5 5 5 5',
												width: 200,
												fieldStyle: 'background-color: #FBF8E6; background-image: none;',
												listeners :
													{
														specialkey : function(fieldObj, e) {
															if (e.getKey() == Ext.EventObject.ENTER) {
																var o1 = Ext.getCmp(this.getId() );
																var val = o1.getValue();
											
																if(val!=null && val!='') {
																	val = val.replace(/;/gi,  '\n');
																} else {
																	val ='';
																}
																if(val!='') {
																	gm.me().checkLotno(val);
																}
																console_logs('value=', val);
															}
														}
													},
												allowBlank : true,
												trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger',
												trigger2Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
												'onTrigger2Click': function() {
													var o1 = Ext.getCmp(this.getId() );
													o1.setValue('');
								
												},
												'onTrigger1Click': function() {
													var o1 = Ext.getCmp(this.getId() );
													var val = o1.getValue();
								
													if(val!=null && val!='') {
														val = val.replace(/;/gi,  '\n');
													} else {
														val ='';
													}
													if(val!='') {
														gm.me().checkLotno(val);
													}
													console_logs('value=', val);
												}

											},
											{
												xtype: 'triggerfield',
												name: 'lot_no2',
												fieldLabel: 'LOT 번호2',
												emptyText: 'LOT 번호2',
												margin: '5 5 5 5',
												width: 200,
												fieldStyle: 'background-color: #FBF8E6; background-image: none;',
												listeners :
													{
														specialkey : function(fieldObj, e) {
															if (e.getKey() == Ext.EventObject.ENTER) {
																var o1 = Ext.getCmp(this.getId() );
																var val = o1.getValue();
											
																if(val!=null && val!='') {
																	val = val.replace(/;/gi,  '\n');
																} else {
																	val ='';
																}
																if(val!='') {
																	gm.me().checkLotno(val);
																}
																console_logs('value=', val);
															}
														}
													},
												allowBlank : true,
												trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger',
												trigger2Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
												'onTrigger2Click': function() {
													var o1 = Ext.getCmp(this.getId() );
													o1.setValue('');
								
												},
												'onTrigger1Click': function() {
													var o1 = Ext.getCmp(this.getId() );
													var val = o1.getValue();
								
													if(val!=null && val!='') {
														val = val.replace(/;/gi,  '\n');
													} else {
														val ='';
													}
													if(val!='') {
														gm.me().checkLotno(val);
													}
													console_logs('value=', val);
												}
											},
											{
												xtype: 'triggerfield',
												name: 'lot_no3',
												fieldLabel: 'LOT 번호3',
												emptyText: 'LOT 번호3',
												margin: '5 5 5 5',
												width: 200,
												fieldStyle: 'background-color: #FBF8E6; background-image: none;',
												listeners :
													{
														specialkey : function(fieldObj, e) {
															if (e.getKey() == Ext.EventObject.ENTER) {
																var o1 = Ext.getCmp(this.getId() );
																var val = o1.getValue();
											
																if(val!=null && val!='') {
																	val = val.replace(/;/gi,  '\n');
																} else {
																	val ='';
																}
																if(val!='') {
																	gm.me().checkLotno(val);
																}
																console_logs('value=', val);
															}
														}
													},
												allowBlank : true,
												trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger',
												trigger2Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
												'onTrigger2Click': function() {
													var o1 = Ext.getCmp(this.getId() );
													o1.setValue('');
								
												},
												'onTrigger1Click': function() {
													var o1 = Ext.getCmp(this.getId() );
													var val = o1.getValue();
								
													if(val!=null && val!='') {
														val = val.replace(/;/gi,  '\n');
													} else {
														val ='';
													}
													if(val!='') {
														gm.me().checkLotno(val);
													}
													console_logs('value=', val);
												}
											},
											{
												xtype: 'triggerfield',
												name: 'lot_no4',
												fieldLabel: 'LOT 번호4',
												emptyText: 'LOT 번호4',
												margin: '5 5 5 5',
												width: 200,
												fieldStyle: 'background-color: #FBF8E6; background-image: none;',
												listeners :
													{
														specialkey : function(fieldObj, e) {
															if (e.getKey() == Ext.EventObject.ENTER) {
																var o1 = Ext.getCmp(this.getId() );
																var val = o1.getValue();
											
																if(val!=null && val!='') {
																	val = val.replace(/;/gi,  '\n');
																} else {
																	val ='';
																}
																if(val!='') {
																	gm.me().checkLotno(val);
																}
																console_logs('value=', val);
															}
														}
													},
												allowBlank : true,
												trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger',
												trigger2Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
												'onTrigger2Click': function() {
													var o1 = Ext.getCmp(this.getId() );
													o1.setValue('');
								
												},
												'onTrigger1Click': function() {
													var o1 = Ext.getCmp(this.getId() );
													var val = o1.getValue();
								
													if(val!=null && val!='') {
														val = val.replace(/;/gi,  '\n');
													} else {
														val ='';
													}
													if(val!='') {
														gm.me().checkLotno(val);
													}
													console_logs('value=', val);
												}
											}
					
										]
									}//endof fieldset
								]
							}
						
						
					]



				});//Panel end...
				prwin = gMain.selPanel.prbarcodeopen(form);
			},//Ajax success
			failure: extjsUtil.failureMessage
		}); 
		
									

        // var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

        // var uniqueIdArr = [];

        // for (var i = 0; i < selections.length; i++) {
        //     var rec = selections[i];
        //     var uid = rec.get('unique_id');  //Srcahd unique_id
        //     uniqueIdArr.push(uid);
        // }

        // if (uniqueIdArr.length > 0) {

        //}
    },

    prbarcodeopen: function (form) {

        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '바코드 출력',
			plain: true,
			width: 600,
			height: 400,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function () {

                    var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

                    var uniqueIdArr = [];
                    var bararr = [];
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        var uid = rec.get('product_uid');  //Product unique_id
                        var item_code = rec.get('item_code');
                        var item_name = rec.get('item_name'); 
                        var specification = rec.get('specification'); 
                        var bar_spec =  item_code + '|' + item_name + '|' +specification;
                        uniqueIdArr.push(uid);
                        bararr.push(bar_spec);
                    }

					var form = gu.getCmp('formPanel').getForm();
					var val = form.getValues(false);
					
					var checkLot = '';

					var lot_no1 = val.lot_no1;
					if(lot_no1!=null && lot_no1.length>0) {
						if(checkLot=='') {
							checkLot = lot_no1;
						} else {
							checkLot = checkLot + ',' + lot_no1;
						}
					}
					var lot_no2 = val.lot_no2;
					if(lot_no2!=null && lot_no2.length>0) {
						if(checkLot=='') {
							checkLot = lot_no2;
						} else {
							checkLot = checkLot + ',' + lot_no2;
						}
					}
					var lot_no3 = val.lot_no3;
					if(lot_no3!=null && lot_no3.length>0) {
						if(checkLot=='') {
							checkLot = lot_no3;
						} else {
							checkLot = checkLot + ',' + lot_no3;
						}
					}
					var lot_no4 = val.lot_no4;
					if(lot_no4!=null && lot_no4.length>0) {
						if(checkLot=='') {
							checkLot = lot_no4;
						} else {
							checkLot = checkLot + ',' + lot_no4;
						}
					}
					console_logs('PRINT checkLot', checkLot);
					if(checkLot=='') {
						console_logs('PRINT', 1);
						form.submit({
							url: CONTEXT_PATH + '/sales/productStock.do?method=printBarcode',
							params: {
								productUids: uniqueIdArr,
								barcodes: bararr
							},
							success: function (val, action) {
								prWin.close();
								gm.me().showToast('결과', '바코드 정보를  프린터에 전송하였습니다.');
								// gMain.selPanel.store.load(function () {
								// });
							},
							failure: function (val, action) {
								prWin.close();
								Ext.Msg.alert('메시지', '바코드 출력 요청을 하였으나 실패하였습니다.');
								// gMain.selPanel.store.load(function () {
								// });
							}
						});
					} else {
						var checkLotMark = checkLot;
						var arr = checkLot.split(',');
						var len = arr.length;

						console_logs('PRINT checkLotMark', checkLotMark);

						Ext.Ajax.request({
							url: CONTEXT_PATH + '/index/process.do?method=checkLotno',				
							params:{
								po_nos : checkLot
							},
							
							success : function(result, request) {
								var resultText = result.responseText;
				
								console_logs('resultText', resultText);

								var result = false;

								if(resultText.length>0) {
									var iutArr = resultText.split(',');
									var iutLen = iutArr.length;
									if(iutLen==len) {
										result = true;
									}
								}

								if(result==false) {
									Ext.Msg.alert('오류', '존재하지 않는 LOT 번호가 있습니다.');
								} else {
									form.setValues({
										lot_no: checkLotMark
									});

									console_logs('PRINT', 1);

									form.submit({
										url: CONTEXT_PATH + '/sales/productStock.do?method=printBarcode',
										params: {
											productUids: uniqueIdArr,
											barcodes: bararr,
											lot_no: checkLotMark
										},
										success: function (val, action) {
											prWin.close();
											gm.me().showToast('결과', '바코드 정보를  프린터에 전송하였습니다.');
											// gMain.selPanel.store.load(function () {
											// });
										},
										failure: function (val, action) {
											prWin.close();
											Ext.Msg.alert('메시지', '바코드 출력 요청을 하였으나 실패하였습니다.');
											// gMain.selPanel.store.load(function () {
											// });
										}
									});
								}

				
							},//Ajax success
							failure: extjsUtil.failureMessage
						});
					}


                }//btn handler
            }, {
                text: CMD_CANCEL,
                handler: function () {
                    if (prWin) {

                        prWin.close();

                    }
                }
            }]
        });
        prWin.show();
    },
	registPj: function() {
		var selection = gm.me().grid.getSelectionModel().getSelection()[0];
		var pj_code = Ext.Date.format(new Date(), 'YmdHis');
		var srcahd_uid = selection.get('unique_id_long');
		var pj_uid = selection.get('pj_uid');
		var sales_price = selection.get('sales_price');

		var itemsInner = [
			new Ext.form.Hidden({
				name: 'pj_type',
				value: 'P'
			}),
			new Ext.form.Hidden({
				name: 'pj_code',
				value: pj_code
			}),
			new Ext.form.Hidden({
				name: 'pj_uid',
				value: pj_uid
			}),
			new Ext.form.Hidden({
				name: 'srcahd_uid',
				value: srcahd_uid
			}),
			new Ext.form.Hidden({
				name: 'order_com_unique',
				value: 79070000001
			}),
			new Ext.form.Hidden({
				name: 'big_pcs_code',
				value: 'FN'
			})];


			if(vCompanyReserved4 == 'KSCM01KR') {
				var projectStore = Ext.create('Hanaro.store.HanaroProjectlotStore', {} );
				projectStore.getProxy().setExtraParam('reserved_varchar1', 'TYPE');
				itemsInner.push({
					fieldLabel: '수주번호',
					xtype: 'combo',
					store: projectStore,
					width: '100%',
					displayField: 'pj_name',
					valueField: 'pj_code',
					emptyText: '수주번호를 검색하세요.',
					allowBlank: true,
					sortInfo: {
						field: 'create_date',
						direction: 'DESC'
					},
					typeAhead: false,
					minChars: 2,
					listConfig: {
						loadingText: '검색중...',
						emptyText: '일치하는 항목 없음.',
						getInnerTpl: function() {
							return '<div data-qtip="{unique_id}">[{pj_code}] {reserved_varchar2} / {item_name} ({quan} SET)</div>';
						}
					},
					listeners: {
						select: function(combo, record) {
							console_logs('record', record);
							var oLotNo	= gu.getCmp('lot_no');
							oLotNo.setValue(record.get('pj_code'));
						}
					}
				});
			}

			itemsInner.push({
				xtype: 'fieldcontainer',
				fieldLabel: '작업지시 번호',
				combineErrors: true,
				msgTarget : 'side',
				width: '100%',
				layout: 'hbox',
				defaults: {
					flex: 1,
					hideLabel: true,
				},
				items: [
					{
						xtype     : 'textfield',
						id: gu.id('lot_no'),
						name      : 'lot_no',
						fieldLabel: 'LOT 명',
						margin: '0 5 0 0',
						width: 360,
						allowBlank: true,
						value : gm.me().lotname,
						fieldStyle: 'text-transform:uppercase',
						emptyText: '영문 대문자 및 숫자',
						validator: function(v) {
							gm.me().setCheckname(false);
							if (/[^a-zA-Z0-9_-]/g.test(v)) {
								v = v.replace(/[^a-zA-Z0-9_-]/g,'');
							}
							this.setValue(v.toUpperCase());
							return true;
						}
					},
					{
						xtype:'button',
						style: 'margin-left: 3px;',
						flex: 1,
						text: '중복'+CMD_CONFIRM,
						//style : "width : 50px;",
						handler : function(){
							
							var lot_no = gu.getCmp('lot_no').getValue();
							console_logs('lot_no', lot_no);
							if(lot_no==null || lot_no.length==0) {
								gm.me().setCheckname(false);
							} else {
								//중복 코드 체크
									Ext.Ajax.request({
									 url: CONTEXT_PATH + '/index/process.do?method=checkName',				
									 params:{
										 po_no : lot_no
									 },
									 
									 success : function(result, request) {
										 var resultText = result.responseText;
										 
										 if(resultText=='0') {
											 gm.me().setCheckname(true);
											 Ext.MessageBox.alert('정상', '사용가능합니다.');
											 
										 }else {
											 gm.me().setCheckname(false);
											 Ext.MessageBox.alert('사용불가', '이미 사용중인 코드입니다.');
										 }
										 
				 
									 },//Ajax success
									 failure: extjsUtil.failureMessage
								 }); 
																			   
							}
								
						}//endofhandler
					 }
				]
			});
			itemsInner.push({
				fieldLabel: '생산납기',
				xtype: 'datefield',
				name: 'req_date',
				format: 'Y-m-d',
				submitFormat: 'Y-m-d',
				dateFormat: 'Y-m-d',
				width:'100%',
				anchor: '100%'
			});
			itemsInner.push({
				fieldLabel: '생산수량',
				xtype: 'numberfield',
				width:'100%',
				name: 'quan',
				value: 1,
				minValue: 1,
				listeners: {
					change: function(combo, value) {
						var sales_price = Ext.getCmp('sales_price').getValue();
						Ext.getCmp('selling_price').setValue(value * sales_price);
					}
				}
			});
			itemsInner.push({
				fieldLabel: '수주금액',
				xtype: 'numberfield',
				width:'100%',
				name : 'selling_price',
				hidden: true,
				value: 0
			});
			itemsInner.push({
				fieldLabel: '수주단가',
				xtype: 'numberfield',
				width:'100%',
				name : 'sales_price',
				hidden: true,
				value: sales_price,
				listeners: {
					change: function(combo, value) {
						var quan = Ext.getCmp('quan').getValue();
						Ext.getCmp('selling_price').setValue(value * quan);
					}
				}
			}
		);
		
		if(vCompanyReserved4=='KSCM01KR') {
			itemsInner.push({
				xtype: 'numberfield',
				name:'reserved_double5',
				fieldLabel: '금형벌수',
				value:1,
				width: '100%'
			});
		} else if (vCompanyReserved4=='MJCM01KR') {
			itemsInner.push({
				xtype: 'numberfield',
				name:'reserved_double5',
				fieldLabel: '단위포장수량',
				value:1,
				width: '100%'
			});
		} else{
			itemsInner.push({
				xtype: 'textarea',
				name:'reserved_varchark',
				rows:5,
				fieldLabel: '설명',
				width: '100%'
			});
		}
		

		var formItems = [
			{
				xtype: 'fieldset',
				title: '생산정보',
				collapsible: false,
				width: '100%',
				style: 'padding:10px',
				default: {
					width: '100%',
					layout: {
						type: 'hbox'
					}
				},
				items: itemsInner
			},
			{
				xtype: 'fieldset',
				title: '제품정보',
				collapsible: false,
				width: '100%',
				style: 'padding:10px',
				default: {
					width: '100%',
					layout: {
						type: 'hbox'
					}
				},
				items: [
					{
						xtype: 'textfield',
						fieldLabel: MSG_BUYER,
						value: selection.get('wa_name'),
						height: 30,
						width: '100%',
						editable: false,
						hidden: true,
						fieldStyle: 'background-color: #FBF8E6;  background-image: none; '
					},
					{
						xtype: 'textfield',
						fieldLabel: '품명',
						value: selection.get('item_name'),
						height: 30,
						width: '100%',
						editable: false,
						fieldStyle: 'background-color: #FBF8E6;  background-image: none; '
					},
					{
						xtype: 'textfield',
						fieldLabel: '규격',
						value: selection.get('specification'),
						height: 30,
						width: '100%',
						editable: false,
						fieldStyle: 'background-color: #FBF8E6;  background-image: none; '
					},
					{
						xtype: 'textfield',
						fieldLabel: '재고수량',
						value: selection.get('stock_qty'),
						height: 30,
						width: '100%',
						editable: false,
						fieldStyle: 'background-color: #FBF8E6;  background-image: none; '
					}, {
						fieldLabel: '기존단가',
						xtype: 'textfield',
						width:'100%',
						name : 'pre_sales_price',
						editable: false,
						hidden: true,
						fieldStyle: 'background-color: #FBF8E6;  background-image: none; ',
						value: sales_price
					}
				]
			}			
		]

		var form = Ext.create('Ext.form.Panel', {
			id: gu.id('formRegistPj'),
			xtype: 'form',
			frame : false,
			border: false,
			width: '100%',
			bodyPadding: 10,
			region: 'center',
			layout: 'column',
			fieldDefaults: {
				labelAlign: 'right',
				msgTarget: 'side'
			},
			defaults: {
                anchor: '100%',
                labelWidth: 100,
                margins: 10,
			},
			items: formItems
		});

		var items = [form];

		var prWin = Ext.create('Ext.Window', {
			modal: true,
			title: '생산작업지시',
			width: 600,
			height: 500,
			plain: true,
			items: items,
			buttons: [
				{
					text: CMD_OK,
					id: gu.id('prwinopen-OK-button'),
					handler: function(btn) {
						if(btn == 'no') {
							prWin.close();
						} else {
							if(form.isValid()) {
								var val = form.getValues(false);
								console_logs('>>>>>Val', val);

								Ext.Ajax.request({
									url: CONTEXT_PATH + '/sales/productStock.do?method=stockHanaroProjectRegist',
									params: val,
									success: function(result, request) {
										gm.me().store.load();
										if(prWin) {
											prWin.close();
										}
										Ext.Msg.alert('안내', '등록하였습니다.', function() {});
									},
									failure: extjsUtil.failureMessage
								});

							}
						}
					}
				}, {
					text: CMD_CANCEL,
					handler: function(btn) {
						prWin.close();
					}
				}
			]
		});
		prWin.show();
	},

	produceRequest : function() {
		var selection = gm.me().grid.getSelectionModel().getSelection()[0];

		var formItems = [
			{
				xtype: 'fieldset',
				title: '요청정보',
				collapsible: false,
				width: '100%',
				style: 'padding:10px',
				default: {
					width: '100%',
					layout: {
						type: 'hbox'
					}
				},
				items: [
					{
						fieldLabel: '생산요청 수량',
						xtype: 'numberfield',
						name: 'prd_req_qty',
						value: 0,
						minValue: 1
					}
				]
			}, {
				xtype: 'fieldset',
				title: '재고정보',
				collapsible: false,
				width: '100%',
				style: 'padding:10px',
				default: {
					width: '100%',
					layout: {
						type: 'hbox'
					}
				},
				items: [
					{
						xtype: 'textfield',
						fieldLabel: MSG_BUYER,
						value: selection.get('wa_name'),
						height: 30,
						width: '100%',
						editable: false,
						fieldStyle: 'background-color: #FBF8E6;  background-image: none; '
					},
					{
						xtype: 'textfield',
						fieldLabel: '품명',
						value: selection.get('item_name'),
						height: 30,
						width: '100%',
						editable: false,
						fieldStyle: 'background-color: #FBF8E6;  background-image: none; '
					},
					{
						xtype: 'textfield',
						fieldLabel: '규격',
						value: selection.get('specification'),
						height: 30,
						width: '100%',
						editable: false,
						fieldStyle: 'background-color: #FBF8E6;  background-image: none; '
					},
					{
						fieldLabel: '재고 수량',
						xtype: 'textfield',
						name: 'stock_qty',
						value: selection.get('stock_qty'),
						editable: false,
						height: 30,
						width: '100%',
						fieldStyle: 'background-color: #FBF8E6;  background-image: none; '
					}, {
						fieldLabel: '생산중 수량',
						xtype: 'textfield',
						name: 'produce_qty',
						value: selection.get('produce_qty'),
						editable: false,
						height: 30,
						width: '100%',
						fieldStyle: 'background-color: #FBF8E6;  background-image: none; '
					}, {
						fieldLabel: '출하가능 수량',
						xtype: 'textfield',
						name: 'ship_avail_qty',
						value: selection.get('ship_avail_qty'),
						editable: false,
						height: 30,
						width: '100%',
						fieldStyle: 'background-color: #FBF8E6;  background-image: none; '
					}
				]
			}
		]

		var form = Ext.create('Ext.form.Panel', {
			id: gu.id('formRegistPrd'),
			xtype: 'form',
			frame : false,
			border: false,
			width: '100%',
			bodyPadding: 10,
			region: 'center',
			fieldDefaults: {
				labelAlign: 'right',
				msgTarget: 'side'
			},
			items: formItems
		});

		var items = [form];

		var prWin = Ext.create('Ext.Window', {
			modal: true,
			title: '생산요청',
			width: 700,
			height: 600,
			plain: true,
			items: items,
			buttons: [
				{
					text: CMD_OK,
					handler: function(btn) {
						if(btn == 'no') {
							prWin.close();
						} else {
							if(form.isValid()) {
								var val = form.getValues(false);
								var selection = gm.me().grid.getSelectionModel().getSelection()[0];
								var assymapUid = selection.get('assymap_uid');
								var ac_uid = selection.get('pj_uid');
								var pj_code = new Date();
								pj_code = Ext.Date.format(pj_code, 'YmdHis');

								form.submit({
									url: CONTEXT_PATH + '/index/process.do?method=addRequestStock',
									params:{
										assymapUid: assymapUid,
										ac_uid: ac_uid,
										pj_code:pj_code
									},
									success : function(result, request) { 
										gMain.selPanel.store.load();
										if(prWin) {
											prWin.close();
										}
										Ext.Msg.alert('안내', '요청하였습니다.', function() {});
										
									},// endofsuccess
									failure: extjsUtil.failureMessage
								});

								// Ext.Ajax.request({
								// 	url: CONTEXT_PATH + '/index/process.do?method=addRequest',
								// 	params:{
								// 		assymapUid: assymapUid,
								// 		ac_uid: ac_uid
								// 	},
								// 	success : function(result, request) { 
								// 		gMain.selPanel.store.load();
								// 		Ext.Msg.alert('안내', '요청하였습니다.', function() {});
										
								// 	},// endofsuccess
								// 	failure: extjsUtil.failureMessage
								// });// endofajax
							}
						}
					}
				}, {
					text: CMD_CANCEL,
					handler: function(btn) {
						prWin.close();
					}
				}
			]
		});
		prWin.show();
	},

	
	setCheckname: function(b) {
    	this.checkname=b;
    	
    	var btn = gu.getCmp('prwinopen-OK-button');
    	if(b==true) {
    		btn.enable();
    	} else {
    		btn.disable();
    	}
    	
	},
	checkLotno: function(val) {
		var inPo = val;
		Ext.Ajax.request({
			url: CONTEXT_PATH + '/index/process.do?method=checkLotno',				
			params:{
				po_nos : inPo
			},
			
			success : function(result, request) {
				var resultText = result.responseText;

				console_logs('resultText', resultText);
				if(resultText==inPo) {
					Ext.Msg.alert('확인', '정상적인 LOT 번호입니다.');
				} else {
					Ext.Msg.alert('오류', '존재하지 않습니다.');
				}

			},//Ajax success
			failure: extjsUtil.failureMessage
		});
	}
});
