//출하 현황
Ext.define('Rfx2.view.company.dabp01kr.salesDelivery.DeliveryPendingView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'delivery-pending-view',
    initComponent: function(){
    	
    	this.initSearchField();
    	
//    	this.setDefValue('create_date', new Date());
//    	
//    	var next7 = gUtil.getNextday(7);
//    	this.setDefValue('change_date', next7);
    	
		this.addSearchField({
			type: 'dateRange',
			field_id: 'delivery_plan',
			text: "납품예정일",
			sdate: Ext.Date.add(new Date(), Ext.Date.DAY, -14),
			edate: new Date()
		});
    	
    	this.addSearchField('name');
    	this.addSearchField('name_spec');
    	this.addSearchField('claast_varchar1');
    	
    	//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
        	REMOVE_BUTTONS : [
        	       'REGIST', 'COPY', 'REMOVE'
        	],
        	RENAME_BUTTONS : [
        	       // { key: 'EDIT', text: '출고확인'},
        	        { key: 'REMOVE', text: '출하반려'}
        	]
        });
		
        //모델 정의
        this.createStore('Rfx.model.DeliveryPending', [{
	            property: 'po_no',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/,{
        		car_name: 'r.coord_key1'
	        }
	        );

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);
        
        //작업지시 Action 생성
        this.addDeliveryConfirm = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			 text: '출고확인',
			 tooltip: '출고확인 확정',
			 disabled: true,
			 handler: function() {
				var rec = gMain.selPanel.vSELECTED_RECORD;
				var selections = gm.me().grid.getSelectionModel().getSelection();
				var check_wa_name = selections[0].get('wa_name');
				var check_sub_wa_name = selections[0].get('sub_wa_name');
				var check_driver = selections[0].get('reserved_varchar2');

				var real_out_qty = [];
				var reserved_double1s = [];
				var reserved_double2s = [];
				var rtgast_uids = [];
				var order_com_uniques = [];

				for(var i=0; i<selections.length; i++) {
					var sel = selections[i];

					var wa_name = sel.get('wa_name');
					var sub_wa_name = sel.get('sub_wa_name');
					var driver = sel.get('reserved_varchar2');
					var new_out_quan = sel.get('new_out_quan');
					if(check_wa_name != wa_name) {
						Ext.MessageBox.alert(error_msg_prompt, '고객사가 다릅니다.');
						return;
					}
					if(check_sub_wa_name != null && sub_wa_name != null && check_sub_wa_name != sub_wa_name) {
						Ext.MessageBox.alert(error_msg_prompt, '납품처가 다릅니다.');
						return;
					}
					if(check_driver != null && driver != null && check_driver != driver) {
						Ext.MessageBox.alert(error_msg_prompt, '배송기사가 다릅니다.');
						return;
					}
					if(new_out_quan == undefined || new_out_quan == '') {
						Ext.MessageBox.alert(error_msg_prompt, '납품수량을 확인해 주세요.');
						return;
					}

					// var qty = sel.get('reserved_double8') - sel.get('delivery_qty');
					var qty = sel.get('new_out_quan');
					var delivery_date = sel.get('delivery_date');
					var reserved_double1 = (delivery_date == null) ? sel.get('pj_double1') : 0; // 개발비
					var reserved_double2 = sel.get('pj_double2');
					var rtgast_uid = sel.get('unique_id');
					var order_com_unique = sel.get('order_com_unique');
					real_out_qty.push(qty);
					reserved_double1s.push(reserved_double1);
					reserved_double2s.push(reserved_double2);
					rtgast_uids.push(rtgast_uid);
					order_com_uniques.push(order_com_unique);
				}

				var msg = '납품서 생성을 위한 출고를 확정합니다.<br>이 작업은 취소할 수 없습니다.';
				msg = msg + '<hr>';
				msg = msg + '<font color=#163F69><b>고개사(수주일):</b></font> ' + selections[0].get('name') + ' 外 ' + (selections.length - 1) + ' 건' +'<br>';
				// msg = msg + '<font color=#163F69><b>제품:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b></font> ' + rec.get('item_code') + ' | ' + rec.get('specification') +'<br>';
				msg = msg + '<font color=#163F69><b>배송목적지:&nbsp;&nbsp;&nbsp;</b></font> ' + rec.get('reserved_varchar1') +'<br>';
				msg = msg + '<font color=#163F69><b>배송차량:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b></font> ' + rec.get('reserved_varchar2') +'<hr>';
				
				// var out_qty = rec.get('reserved_double1') - rec.get('delivery_qty');
				// var delivery_date = rec.get('delivery_date');
				// var reserved_double1 = (delivery_date == null) ? rec.get('pj_double1') : 0; // 개발비
				// var reserved_double2 = rec.get('pj_double2'); // 물류비

				// var real_out_qty = rec.get('reserved_double8') - rec.get('delivery_qty');

				var form = Ext.create('Ext.form.Panel', {
		            defaultType: 'textfield',
		            border: false,
		            bodyPadding: 15,
		            region: 'center',
		            defaults: {
		                anchor: '100%',
		                allowBlank: false,
		                msgTarget: 'side',
		                labelWidth: 80
		            },
		             items: [
								{
									xtype: 'component',
									html: msg,
									anchor: '100%'
								},
								new Ext.form.Hidden({
									name: 'rtgastUids',
									value: rtgast_uids
								}),
								new Ext.form.Hidden({
									name: 'out_qtys',
									value: real_out_qty
								}),
								new Ext.form.Hidden({
									name: 'reserved_double2s',
									value: reserved_double2s
								}),
								new Ext.form.Hidden({
									name: 'reserved_double1s',
									value: reserved_double1s
								}),
								new Ext.form.Hidden({
									name: 'order_com_uniques',
									value: order_com_uniques
								})
								// {
								// 	xtype: 'numberfield',
								// 	fieldLabel: '출고수량',
								// 	name: 'out_qtys',
								// 	value:  real_out_qty,
								// 	anchor: '100%'
								// },{
								// 	xtype: 'numberfield',
								// 	fieldLabel: '물류비',
								// 	name: 'reserved_double2s',
								// 	value:  reserved_double2s,
								// 	anchor: '100%'
								// },{
								// 	xtype: 'numberfield',
								// 	fieldLabel: '개발비',
								// 	name: 'reserved_double1s',
								// 	value:  reserved_double1s,
								// 	readOnly: true,
								// 	anchor: '100%'
								// }
		                     ]
		        });
		        var win = Ext.create('ModalWindow', {
		            title: '출고 확인',
		            width: 400,
		            height: 200,
		            minWidth: 400,
		            minHeight: 200,
		            items: form,
		            buttons: [{
		                text: '확인',
		            	handler: function(){
							var val = form.getValues(false);
							console_logs('====val', val);			

		            		 gMain.selPanel.addDeliveryConfirmFc(val);
			            		if(win) {
			            			win.close();
			            		}
		            	}
		            },
		            {
		            	text: '취소',
		            	handler: function(){
		            		if(win) {
		            			win.close();
		            		}
		 

		            	}
		            }]
		        });
		        win.show();
//				var dlg = Ext.MessageBox.prompt(
//			            '확인',
//			            msg,
//			            gMain.selPanel.addDeliveryConfirmFc
//			        );
//				var textboxEl = dlg.getEl().query('input')[0];
//				textboxEl.setAttribute('maxlength', 10);
//				//textboxEl.setAttribute('maskRe', /[0-9.]/);
//				
//				var reserved_double1 = rec.get('reserved_double1');
//				console_logs('reserved_double1', reserved_double1);
//				textboxEl.setAttribute('value', ''+ reserved_double1);
//				
			 }
		});

		this.removeDeliveryConfirm = Ext.create('Ext.Action', {
			iconCls: 'af-remove',
			text: '출하반려',
			tooltip: '출하반려 요청',
			disabled: true,
			handler: function() {
				var selections = gm.me().grid.getSelectionModel().getSelection();
				var unique_ids = [];
				for(var i=0; i<selections.length; i++) {
					var rec = selections[i];
					unique_ids.push(rec.get('unique_id_long'));
				}
				var form = Ext.create('Ext.form.Panel', {
					id: 'form',
					defaultType: 'textfield',
					border: false,
					bodyPadding: 15,
					width: 400,
					height: 250,
					defaults: {
						// anchor: '100%',
						editable:true,
						allowBlank: false,
						msgTarget: 'side',
						labelWidth: 100
					},
					items: [
						new Ext.form.Hidden({
							name: 'unique_ids',
							id: 'unique_ids',
							value: unique_ids
						}),
						{
							xtype: 'combo',
							name: 'back_info',
							id: 'back_info',
							allowBlank: false,
							fieldLabel: '반려사유',
							store: Ext.create('Mplm.store.CommonCodeStore',{parentCode:'DELIVERY_BACK'}),
							displayField:   'codeName',
							valueField:  'codeName',
							listeners : {
								select: function(field, value) {
									console_logs('>>>>field' + ' ' + field, value);
								}
							}
						}, {
							xtype: 'textarea',
							fieldLabel: '기타 비고',
							height: 100,
							name: 'etc', 
							id: 'etc',
							allowBlank: true
						}
					]
				});

				var win = Ext.create('ModalWindow', {
					title: '출하반려',
					width : 400,
					height: 300,
					items: form,
					buttons: [{
                        text: CMD_OK,
                        handler: function(){
							var form = Ext.getCmp('form');
							if (form.isValid()) {
								var val = form.getValues(false);

								console_logs('==val', val);

								Ext.Ajax.request({
									url: CONTEXT_PATH + '/sales/delivery.do?method=backDeliveryRequest',
									params: val,
									success: function(result, request) {
										if(win) {
											win.close();
										}
										gm.me().store.load();
									}, // endof success for ajax
									failure: extjsUtil.failureMessage
								});
							} else {
								Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
							}
						}
					},{
						text: CMD_CANCEL,
                        handler: function() {
                            if(win) {
                                win.close();
                                }
                        }
					}]
				});
				win.show();
			}
		});
		    	
        buttonToolbar.insert(1, this.addDeliveryConfirm);
		buttonToolbar.insert(1, '-');
		buttonToolbar.insert(2, this.removeDeliveryConfirm);
		buttonToolbar.insert(3, '-');
        
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
				gMain.selPanel.addDeliveryConfirm.enable();
				gMain.selPanel.removeDeliveryConfirm.enable();
            } else {
				gMain.selPanel.addDeliveryConfirm.disable();
				gMain.selPanel.removeDeliveryConfirm.disable();
            }

        });
        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });


        this.callParent(arguments);
        
        //디폴트 로드
        this.store.getProxy().setExtraParam('orderBy', "po_no");
    	this.store.getProxy().setExtraParam('ascDesc', "Desc");  
        gMain.setCenterLoading(false);
        this.store.load(function(records){
			for(var i=0; i<records.length; i++) {
				var rec = records[i];
				var reserved_double1 = rec.get('reserved_double1');

				rec.set('new_out_quan', reserved_double1);
			}
		});

	},
	deliveryLoad: function() {
		gm.me().store.load(function(records) {
			for(var i=0; i<records.length; i++) {
				var rec = records[i];
				var reserved_double1 = rec.get('reserved_double1');

				rec.set('new_out_quan', reserved_double1);
			}
		})
	},
    addDeliveryConfirmFc: function(value) {
		// var out_qty = value['out_qty']; // 요청수량
		// var reserved_double1 = value['reserved_double1']; // 개발비
		// var reserved_double2 = value['reserved_double2']; // 물류비
    	if(this.vSELECTED_RECORD==null) {
    		Ext.MessageBox.alert('오류', '선택한 항목를 찾을 수 없습니다.');
    		
    	} else {
        	var rtgastUid = this.vSELECTED_RECORD.get('id');
        	
    	    Ext.Ajax.request({
				url: CONTEXT_PATH + '/sales/delivery.do?method=addDeliveryConfirmByRqst',
				params: value,
    			// params:{
    			// 	rtgastUid: rtgastUid,
				// 	out_qty : out_qty,
				// 	reserved_double1: reserved_double1,
				// 	reserved_double2: reserved_double2
    			// },
    			
    			success : function(result, request) { 
    				gMain.selPanel.store.load(function(records){
    					// var id = gMain.selPanel.selectedUid;
    					// gMain.selPanel.grid.getSelectionModel().deselectAll();
    					// gMain.selPanel.grid.getSelectionModel().select( gMain.selPanel.store.getById( id ) );
    				});
    				Ext.Msg.alert('안내', '납품서를 생성하였습다. <br>[출하현황] 메뉴를 확인하세요.', function() {});
    				
    			},//endofsuccess
    			failure: extjsUtil.failureMessage
    		});//endofajax
    	}

    },
	items : [],
	
	editRedord: function(field, rec) {
        console_logs('====> edited field', field);
		console_logs('====> edited record', rec);
		
		var selections = gm.me().grid.getSelectionModel().getSelection();
		var reserved_double1 = selections[0].get('reserved_double1');
		var new_out_quan = selections[0].get('new_out_quan');

        // switch (field) {
        //     case 'new_out_quan':
		// 		if(reserved_double1 < new_out_quan) {
		// 			Ext.Msg.alert('안내', '납품예정수량 보다 많을 수 없습니다.');
		// 			selections[0].set('new_out_quan', reserved_double1);
		// 			// Ext.getCmp('new_out_quan').setValue(reserved_double1);
		// 		}
        //         break;
        // }
    },
});
