/**
 * This example shows how to create a grid from Array data. The grid is stateful so you
 * can move or hide columns, reload the page, and come back to the grid in the same state
 * you left it in.
 *
 * The cells are selectable due to use of the `enableTextSelection` option.
 */
Ext.define('Rfx.view.salesDelivery.HEAVY5_SalesPlan', {
    extend: 'Rfx.base.BaseView',
    xtype: 'heavy5-salesplan-view',
    initComponent: function(){
    	
		//this.initDefValue();
		
		Ext.each(this.columns, function(columnObj, index) {
			var dataIndex = columnObj["dataIndex"];
			
            switch (dataIndex) {
				case 'sub_cur_estimated_price':
				case 'sub_estimated_price':
				case 'sub_productgoal_price':
				case 'sub_month':
				case 'sub_percent':
				case 'sub_po_price':
				case 'sub_wa_name':
                    columnObj["width"] = 0;
                    break;
            }

        });
		
    	//생성시 디폴트 값.
//		this.setDefValue('board_email', /*GLOBAL*/vCUR_EMAIL);
//		this.setDefValue('user_id', /*GLOBAL*/vCUR_USER_ID);
//		this.setDefValue('board_name', /*GLOBAL*/vCUR_USER_NAME);
//		this.setDefValue('board_count', 0); //Hidden Value임.
//		switch(vSYSTEM_TYPE) {
//		case 'MES':
//			this.setDefComboValue('gubun', 'valueField', '0');//ComboBOX의 ValueField 기준으로 디폴트 설정.
//			break;
//		case 'PLACE':
//			this.setDefComboValue('gubun', 'valueField', 'notice');//ComboBOX의 ValueField 기준으로 디폴트 설정.
//		}


		//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
		this.addSearchField('month');

		this.createStore('Rfx.model.HEAVY5SalesPlan', [{
	            property: 'create_date',
	            direction: 'DESC'
	        }],
	        /*pageSize*/
	        gMain.pageSize
	        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
        	//Orderby list key change
        	//ordery create_date -> p.create로 변경.
	        ,{}
        	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
        	, ['sleast']
			);
		
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		var remove_buttons = [];

		remove_buttons.push('REGIST', 'EDIT', 'COPY', 'REMOVE');

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
			REMOVE_BUTTONS : remove_buttons
		});

		buttonToolbar.insert(1, this.planRegistAction);
		buttonToolbar.insert(2, this.deleteAction);

		var BuyerStore = Ext.create('Mplm.store.BuyerStore',{});
		searchToolbar.insert(9,{
            xtype: 'combo'
            ,anchor: '100%'
            ,width:175
            ,field_id: 'wa_code'
            ,store: BuyerStore
            ,displayField: 'wa_name'
            ,valueField: 'wa_code'
            ,emptyText: '고객사'
            ,innerTpl	: '<div data-qtip="{wa_code}">[{wa_code}]{wa_name}</div>'
            ,minChars: 1
            ,typeAhead:true
            ,queryMode: 'remote'
            ,fieldStyle: 'background-color: #FBF8E6'
            ,listeners: {
                select: function(combo, record) {
                    var selected = combo.getValue();
                    gm.me().store.getProxy().setExtraParam('wa_code', selected);
                    this.store.removeAll();
                    this.store.reload();
                }
            }
		});
		
		 //tab grid 생성
// 		var tab = this.createTabGrid('Rfx.model.ProduceAdjustPcs', items, 'big_pcs_code', arr, function(curTab, prevtab) {
// 						var multi_grid_id = curTab.multi_grid_id;
// 					gm.me().multi_grid_id = multi_grid_id;
					
// 						console_logs('multi_grid_id: ',  multi_grid_id);
// 						if(multi_grid_id == undefined) {//Main Grid
// //	                    	  store.getProxy().setExtraParam('pcs_code', '');
						
						
// 						} else {//추가 탭그리드
// 						var store = gm.me().store_map[multi_grid_id];
// 						store.getProxy().setExtraParam('pcs_code', multi_grid_id);
// 						store.load(function(records) {
// //	                        	console_logs('records',records);
// 						});
// 						}
						
// 				});

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);

		this.store.load();

        Ext.apply(this, {
            layout: 'border',
            items: [this.createWest(),this.createCenter()]
        });


        this.callParent(arguments);
        
        //디폴트 로드
		gMain.setCenterLoading(false);
		
		//grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {

			if(selections.length) {
				gm.me().deleteAction.enable();
			} else {
				gm.me().deleteAction.disable();
			}
		});

	},

	deleteAction : Ext.create('Ext.Action', {
		iconCls: 'af-remove',
		text: gm.getMC('CMD_DELETE', '삭제'),
		tooltip: '삭제',
		disabled: true,
		handler: function() {		 	
			gMain.selPanel.removeRegistHandler();
		}
	}),

	planRegistAction : Ext.create('Ext.Action', {
		iconCls: 'af-plus-circle',
		text: '계획등록',
		tooltip: '계획등록',
		disabled: false,
		handler: function() {		 	
			gMain.selPanel.palnRegistHandler();
		}
	}),

	removeRegistHandler: function() {

		Ext.MessageBox.show({
			title: '삭제',
			msg: '삭제하시겠습니까?',

			buttons: Ext.MessageBox.YESNO,
			icon: Ext.MessageBox.QUESTION,
			fn: function(btn) {
				if(btn == "no") {
					return;
				} else {
					var rec = gm.me().grid.getSelectionModel().getSelection()[0];
					console_logs('===rec', rec);
						
					Ext.Ajax.request({
						url: CONTEXT_PATH + '/production/schdule.do?method=removeSalePlan',
						params: {
							wa_code: rec.get('wa_code'),
							month:rec.get('month')
						},
						success: function(result, request) {
							gm.me().store.load();
							gm.me().sleastStore.load();
							Ext.Msg.alert('안내', '삭제가 완료 되었습니다.', function() {});

						}, //endofsuccess
						failure: extjsUtil.failureMessage
					}); //endofajax
				}
			}
		});
	},

	palnRegistHandler: function() {
		var BuyerStore = Ext.create('Mplm.store.BuyerStore',{});

		var form = Ext.create('Ext.form.Panel', {
			id: gu.id('formPanel'),
			xtype: 'form',
			frame: false,
			border: false,
			width: 1000,
			height: 400,
			autoScroll:true,
			bodyPadding: '3 3 0',
			region: 'center',
			fieldDefaults: {
				labelAlign: 'right',
				msgTarget: 'side'
			},
			// defaults: {
			// 	anchor: '100%',
			// 	labelWidth: 60,
			// 	margins: 60
			// },
			items: [
				{
					xtype: 'combo'
					,emptyText: '고객사 선택'
					,fieldLabel:'고객사'
					,width:300
					,field_id: 'wa_code'
					,id:'wa_code'
					,name:'wa_code'
					,store: BuyerStore
					,displayField: 'wa_name'
					,valueField: 'wa_code'
					,innerTpl	: '<div data-qtip="{wa_code}">[{wa_code}]{wa_name}</div>'
					,minChars: 1
					,typeAhead:true
					,queryMode: 'remote'
					,fieldStyle: 'background-color: #FBF8E6'
					,listeners: {
						// select: function(combo, record) {
						// 	console_logs('==combo', combo);
						// 	console_logs('==record', record);
						// 	Ext.getCmp('wa_name').setValue(record.get('wa_name'));
						// }
					}
				}, 
				{
					xtype:'textfield',
					fieldLabel: '연도',
					id:'month',
					name:'month',
					width:250,
					editable:false,
					fieldStyle: 'background-color: #FBF8E6',
					value:Ext.Date.dateFormat(new Date, 'Y')
				},
				{
					xtype: 'fieldset',
					title: '고객사별 입력사항',
					// columnWidth: 0.5,
					frame:true,
					layout: 'column',
					// collapsible: true,
					items: [
						new Ext.form.Hidden({
							name: 'menu_code',
							value: 'INNB_CLD'
						}),
						{
							xtype: 'fieldset',
							title: '매출목표',
							layout: 'fit',
							defaults: {anchor: '100%'},
							width: 500,
							items: [
								{
									xtype: 'numberfield',
									fieldLabel: '1월',
									id: 'January',
									name: 'January',
									width: 400,
									minValue: 0,
									value:0,
									allowBlank: false,
									listeners: {
										change: function(selections, value) {
											Ext.getCmp('plan_total_amount').setValue(value);
										}
									}
								},{
									xtype: 'numberfield',
									fieldLabel: '2월',
									id: 'February',
									name: 'February',
									width: 400,
									allowBlank: false,
									value:0,
									minValue: 0,
									listeners: {
										change: function(selections, value) {
											Ext.getCmp('plan_total_amount').setValue(value);
										}
									}
								},{
									xtype: 'numberfield',
									fieldLabel: '3월',
									id: 'March',
									name: 'March',
									width: 400,
									minValue: 0,
									value:0,
									allowBlank: false,
									listeners: {
										change: function(selections, value) {
											Ext.getCmp('plan_total_amount').setValue(value);
										}
									}
								},{
									xtype: 'numberfield',
									fieldLabel: '4월',
									id: 'April',
									name: 'April',
									width: 400,
									minValue: 0,
									allowBlank: false,
									value:0,
									listeners: {
										change: function(selections, value) {
											Ext.getCmp('plan_total_amount').setValue(value);
										}
									}
								},{
									xtype: 'numberfield',
									fieldLabel: '5월',
									id: 'May',
									name: 'May',
									width: 400,
									minValue: 0,
									value:0,
									allowBlank: false,
									listeners: {
										change: function(selections, value) {
											Ext.getCmp('plan_total_amount').setValue(value);
										}
									}
								},{
									xtype: 'numberfield',
									fieldLabel: '6월',
									id: 'June',
									name: 'June',
									width: 400,
									value:0,
									allowBlank: false,
									listeners: {
										change: function(selections, value) {
											Ext.getCmp('plan_total_amount').setValue(value);
										}
									}
								},{
									xtype: 'numberfield',
									fieldLabel: '7월',
									id: 'July',
									name: 'July',
									minValue: 0,
									width: 400,
									value:0,
									allowBlank: false,
									listeners: {
										change: function(selections, value) {
											Ext.getCmp('plan_total_amount').setValue(value);
										}
									}
								},{
									xtype: 'numberfield',
									fieldLabel: '8월',
									id: 'August',
									name: 'August',
									minValue: 0,
									value:0,
									width: 400,
									allowBlank: false,
									listeners: {
										change: function(selections, value) {
											Ext.getCmp('plan_total_amount').setValue(value);
										}
									}
								},{
									xtype: 'numberfield',
									fieldLabel: '9월',
									id: 'September',
									name: 'September',
									minValue: 0,
									width: 400,
									value:0,
									allowBlank: false,
									listeners: {
										change: function(selections, value) {
											Ext.getCmp('plan_total_amount').setValue(value);
										}
									}
								},{
									xtype: 'numberfield',
									fieldLabel: '10월',
									id: 'October',
									name: 'October',
									minValue: 0,
									value:0,
									width: 400,
									allowBlank: false,
									listeners: {
										change: function(selections, value) {
											Ext.getCmp('plan_total_amount').setValue(value);
										}
									}
								},{
									xtype: 'numberfield',
									fieldLabel: '11월',
									id: 'November',
									minValue: 0,
									value:0,
									name: 'November',
									width: 400,
									allowBlank: false,
									listeners: {
										change: function(selections, value) {
											Ext.getCmp('plan_total_amount').setValue(value);
										}
									}
								},{
									xtype: 'numberfield',
									fieldLabel: '12월',
									minValue: 0,
									value:0,
									id: 'December',
									name: 'December',
									width: 400,
									allowBlank: false,
									listeners: {
										change: function(selections, value) {
											Ext.getCmp('plan_total_amount').setValue(value);
										}
									}
								}, {
									xtype: 'numberfield',
									fieldLabel: '합계금액',
									id: 'plan_total_amount',
									name: 'plan_total_amount',
									width: 400,
									style: 'padding-top: 50px',
									value: 0,
									editable:false,
									listeners: {
										change: function(selections, value) {
											var a = Ext.getCmp('January').getValue();
											var b = Ext.getCmp('February').getValue();
											var c = Ext.getCmp('March').getValue();
											var d = Ext.getCmp('April').getValue();
											var e = Ext.getCmp('June').getValue();
											var f = Ext.getCmp('May').getValue();
											var g = Ext.getCmp('July').getValue();
											var h = Ext.getCmp('August').getValue();
											var i = Ext.getCmp('September').getValue();
											var j = Ext.getCmp('October').getValue();
											var k = Ext.getCmp('November').getValue();
											var l = Ext.getCmp('December').getValue();
											
											var total = a+b+c+d+e+f+g+h+i+j+k+l;
											Ext.getCmp('plan_total_amount').setValue(total);
										}
									}
								}
							]
						},{
							xtype: 'fieldset',
							title: '생산목표',
							layout: 'fit',
							defaults: {anchor: '100%'},
							width: 500,
							items: [
								{
									xtype: 'numberfield',
									fieldLabel: '1월',
									id: 'January_m',
									name: 'January_m',
									width: 400,
									minValue: 0,
									value:0,
									allowBlank: false,
									listeners: {
										change: function(selections, value) {
											Ext.getCmp('plan_total_amount_m').setValue(value);
										}
									}
								},{
									xtype: 'numberfield',
									fieldLabel: '2월',
									id: 'February_m',
									name: 'February_m',
									width: 400,
									allowBlank: false,
									value:0,
									minValue: 0,
									listeners: {
										change: function(selections, value) {
											Ext.getCmp('plan_total_amount_m').setValue(value);
										}
									}
								},{
									xtype: 'numberfield',
									fieldLabel: '3월',
									id: 'March_m',
									name: 'March_m',
									width: 400,
									minValue: 0,
									value:0,
									allowBlank: false,
									listeners: {
										change: function(selections, value) {
											Ext.getCmp('plan_total_amount_m').setValue(value);
										}
									}
								},{
									xtype: 'numberfield',
									fieldLabel: '4월',
									id: 'April_m',
									name: 'April_m',
									width: 400,
									minValue: 0,
									allowBlank: false,
									value:0,
									listeners: {
										change: function(selections, value) {
											Ext.getCmp('plan_total_amount_m').setValue(value);
										}
									}
								},{
									xtype: 'numberfield',
									fieldLabel: '5월',
									id: 'May_m',
									name: 'May_m',
									width: 400,
									minValue: 0,
									value:0,
									allowBlank: false,
									listeners: {
										change: function(selections, value) {
											Ext.getCmp('plan_total_amount_m').setValue(value);
										}
									}
								},{
									xtype: 'numberfield',
									fieldLabel: '6월',
									id: 'June_m',
									name: 'June_m',
									width: 400,
									value:0,
									allowBlank: false,
									listeners: {
										change: function(selections, value) {
											Ext.getCmp('plan_total_amount_m').setValue(value);
										}
									}
								},{
									xtype: 'numberfield',
									fieldLabel: '7월',
									id: 'July_m',
									name: 'July_m',
									minValue: 0,
									width: 400,
									value:0,
									allowBlank: false,
									listeners: {
										change: function(selections, value) {
											Ext.getCmp('plan_total_amount_m').setValue(value);
										}
									}
								},{
									xtype: 'numberfield',
									fieldLabel: '8월',
									id: 'August_m',
									name: 'August_m',
									minValue: 0,
									value:0,
									width: 400,
									allowBlank: false,
									listeners: {
										change: function(selections, value) {
											Ext.getCmp('plan_total_amount_m').setValue(value);
										}
									}
								},{
									xtype: 'numberfield',
									fieldLabel: '9월',
									id: 'September_m',
									name: 'September_m',
									minValue: 0,
									width: 400,
									value:0,
									allowBlank: false,
									listeners: {
										change: function(selections, value) {
											Ext.getCmp('plan_total_amount_m').setValue(value);
										}
									}
								},{
									xtype: 'numberfield',
									fieldLabel: '10월',
									id: 'October_m',
									name: 'October_m',
									minValue: 0,
									value:0,
									width: 400,
									allowBlank: false,
									listeners: {
										change: function(selections, value) {
											Ext.getCmp('plan_total_amount_m').setValue(value);
										}
									}
								},{
									xtype: 'numberfield',
									fieldLabel: '11월',
									id: 'November_m',
									minValue: 0,
									value:0,
									name: 'November_m',
									width: 400,
									allowBlank: false,
									listeners: {
										change: function(selections, value) {
											Ext.getCmp('plan_total_amount_m').setValue(value);
										}
									}
								},{
									xtype: 'numberfield',
									fieldLabel: '12월',
									minValue: 0,
									value:0,
									id: 'December_m',
									name: 'December_m',
									width: 400,
									allowBlank: false,
									listeners: {
										change: function(selections, value) {
											Ext.getCmp('plan_total_amount_m').setValue(value);
										}
									}
								}, {
									xtype: 'numberfield',
									fieldLabel: '합계금액',
									id: 'plan_total_amount_m',
									name: 'plan_total_amount_m',
									width: 400,
									value: 0,
									style: 'padding-top: 50px',
									editable:false,
									listeners: {
										change: function(selections, value) {
											var a = Ext.getCmp('January_m').getValue();
											var b = Ext.getCmp('February_m').getValue();
											var c = Ext.getCmp('March_m').getValue();
											var d = Ext.getCmp('April_m').getValue();
											var e = Ext.getCmp('June_m').getValue();
											var f = Ext.getCmp('May_m').getValue();
											var g = Ext.getCmp('July_m').getValue();
											var h = Ext.getCmp('August_m').getValue();
											var i = Ext.getCmp('September_m').getValue();
											var j = Ext.getCmp('October_m').getValue();
											var k = Ext.getCmp('November_m').getValue();
											var l = Ext.getCmp('December_m').getValue();
											
											var total = a+b+c+d+e+f+g+h+i+j+k+l;
											Ext.getCmp('plan_total_amount_m').setValue(total);
										}
									}
								}
							]
						}
						
						
					]
				}
			]
		});

		var prWin = Ext.create('ModalWindow', {
			modal: true,
			title: '계획등록',
			plain:true,
			width: 1100,
			height: 600,
			items: form,
			buttons: [{
				text: CMD_OK,
				handler: function(btn) {
					if(btn == "no") {
						prWin.close();
					} else {
						if(form.isValid()) {
							var wa_code = Ext.getCmp('wa_code').getValue();
							if(wa_code == null || wa_code == '') {
								Ext.MessageBox.alert('알림', '고객사를 지정해주세요.');
								return;
							}
							var val = form.getValues(false);

							form.submit({
								url: CONTEXT_PATH + '/production/schdule.do?method=addSalePlan',
								params: val,
								success: function(result, response) {
									console_logs('result', result);
									console_logs('response', response);
									prWin.close();
									gm.me().store.load();
								},
								failure: extjsUtil.failureMessage
							})
						}
					}
				}
			},{
				text: CMD_CANCEL,
        		handler: function(){
        		if(prWin) {
        			
        			prWin.close();
        			
        		}
        	}
			}]
		});
		prWin.show();
	},
	
	createCenter: function() {

		var detailColumn = [];

		Ext.each(this.columns, function(columnObj, index) {
			var dataIndex = columnObj["dataIndex"];
			
            switch (dataIndex) {
				case 'sub_month':
                case 'sub_cur_estimated_price':
				case 'sub_estimated_price':
				case 'sub_productgoal_price':
				case 'sub_percent':
				case 'sub_po_price':
				case 'sub_wa_name':
					columnObj["width"] = 100;
					detailColumn.push(columnObj);
                    break;
			}
        });

		this.pjInfoGrid = 
			Ext.create('Ext.grid.Panel', {
	    	 //id: gm.me().link + 'DBM7-Assembly',
//			 id: 'PPO1_TURN_PREQ',
	    	 title: '세부사항',// cloud_product_class,
			 border: true,
	         resizable: true,
	         scroll: true,
	         collapsible: false,
			 store: this.sleastStore,
			 columns: detailColumn,
			 autoScroll:true,
			 cls : 'rfx-panel',
	         //layout          :'fit',
	         //forceFit: true,
	         multiSelect: true,
			 selModel: Ext.create("Ext.selection.CheckboxModel", {} ),
	         bbar: Ext.create('Ext.PagingToolbar', {
		            store: null,
		            displayInfo: true,
		            displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
		            emptyMsg: "표시할 항목이 없습니다."
	                ,listeners: {
	                    beforechange: function (page, currentPage) {
	//		                        //--- Get Proxy ------//
	//		                        var myProxy = this.store.getProxy();                        
	//		                 //--- Define Your Parameter for send to server ----//
	//		                        myProxy.params = {
	//		                            MENU_NAME: '',
	//		                            MENU_DETAIL: ''
	//		                        };
	//		                  //--- Set value to your parameter  ----//
	//		                        myProxy.setExtraParam('MENU_NAME', '222222');
	//		                        myProxy.setExtraParam('MENU_DETAIL', '555555');
	                    }
	                }
		         
		        }),
	            dockedItems: [
	            {
				    dock: 'top',
				    xtype: 'toolbar',
				    cls: 'my-x-toolbar-default2',
					items: [
						// this.purListSrch//, 
					        //this.removeAssyAction, 
					        //'->', 
					        //this.expandAllTreeAction 
					        ]
				},
				{
				    dock: 'top',
				    xtype: 'toolbar',
				    cls: 'my-x-toolbar-default1',
					items: [{
					    xtype:'label',
					    width:40,
					    text: '기간',
					    style: 'color:white;'
						 
			    	},{
						  id: gu.id('s_date_arv'),
			              name: 's_date',
			              format: 'Y-m-d',
			              fieldStyle: 'background-color: #FBF8E6; background-image: none;',
			              submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
					    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
						    	xtype: 'datefield',
						    	value: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
						    	width: 98

			        },{
					    xtype:'label',
					    text: "~",
					    style: 'color:white;'
			        },{
						  id: gu.id('e_date_arv'),
			              name: 'e_date',
			              format: 'Y-m-d',
			              fieldStyle: 'background-color: #FBF8E6; background-image: none;',
			              submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
					    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
						    	xtype: 'datefield',
						    	value: new Date(),
						    	width: 98

			        }
			    	]
				}
	    	] //dockedItems of End
			
		
		});//supplierGrid of End

		this.center = Ext.widget('tabpanel', {
			layout:'border',
			border: true,
			region: 'center',
			width: '55%',
			items: [this.pjInfoGrid]
		});

		return this.center;
	},

	createWest: function() {
		this.grid.setTitle('고객사목록');
		this.west = Ext.widget('tabpanel', {
			layout:'border',
			border: true,
			region: 'west',
			width: '45%',
			layoutConfig: {columns: 2, rows:1},

			items: [this.grid]
		});

		this.grid.getSelectionModel().on({
			selectionchange: function(sm, selections) {
				console_logs('==sm', sm);
				console_logs('==selectrions', selections);
				if(selections.length > 0) {
					gm.me().sleastStore.getProxy().setExtraParam('month', selections[0].get('month'));
					// gm.me().sleastStore.getProxy().setExtraParam('order_com_unique', selections[0].get('order_com_unique'));
					gm.me().sleastStore.getProxy().setExtraParam('wa_code', selections[0].get('wa_code'));
					gm.me().sleastStore.load();
				}
			}
		});

		return this.west;
	},

    items : [],
    // itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
    // 	//console_logs('boardview itemdblclick record', record);
    	  	
    // 	Rfx.model.Board.load(record.get('unique_id'), {
    // 	    success: function(board) {
    //         	console_logs('board', board);
    // 	    	var form = gm.me().createViewForm(board);
    // 	    	var win = Ext.create('ModalWindow', {
    // 	            title: gm.me().getMC('CMD_VIEW_DTL','상세보기'),
    // 	            width: 700,
    // 	            height: 530,
    // 	            minWidth: 250,
    // 	            minHeight: 180,
    // 	            layout: 'absolute',
    // 	            plain:true,
    // 	            items: form,
    // 	            buttons: [{
    // 	                text: CMD_OK,
    // 	            	handler: function(){
    // 	                       	if(win) 
    // 	                       	{
    // 	                       		win.close();
    // 	                       	} 
    // 	                  }
    // 	            }]
    // 	        });
    // 	    	win.show();
    // 	    }
    // 	});
    	
    	
    // },
    createViewForm: function (board) {
    	//Ext.MessageBox.alert('Find Board', "unique_id : " + board.get('unique_id'));
    	console_logs('board', board);
//    	var lineGap = 30;
     	var unique_id = board.get('unique_id');
    	var user_id = board.get('user_id');
    	var board_email = board.get('board_email'  );
    	var board_title = board.get('board_title' );
    	var board_content = board.get('board_content' );
    	var htmlFileNames = board.get('htmlFileNames' );
    	var fileQty = board.get('fileQty' );
    	var form = Ext.create('Ext.form.Panel', {
            defaultType: 'displayfield',
            bodyPadding: 3,
            height: 650,
            defaults: {
                anchor: '100%',
                allowBlank: false,
                msgTarget: 'side',
                labelWidth: 60
            },
            items: [{
	    			fieldLabel: '등록자',
	    			value: user_id + '(' + board_email + ')'
    		    },{
    		    	fieldLabel: gm.getColName('board_title'),
    		    	value: board_title,
    		    	name: 'board_title'
    		    },{
    		    	fieldLabel: '첨부파일',
    		    	value: htmlFileNames
    		    },{
                    value: board_content,
                    xtype:          'textarea',
                    fieldStyle: 'overflow:scroll ;overflow-x:hidden; background-color: #F0F0F0; background-image: none;border-bottom: #999999 1px solid;border-left: #999999 1px solid;border-right: #999999 1px solid;border-top: #999999 1px solid;',
                    height: 340,
                    readOnly: true,
                    anchor: '100%'
                }  
    		    ]
        }); //endof form
    	
    	return form;
	},
	
	sleastStore: Ext.create('Mplm.store.SleAstStore',{}),

});
