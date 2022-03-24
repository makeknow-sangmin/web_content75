//출하 현황
Ext.define('Rfx2.view.company.dabp01kr.salesDelivery.HEAVY4_DeliveryPendingView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'delivery-pending-view',
    initComponent: function(){
    	
//    	this.setDefValue('create_date', new Date());
//    	
//    	var next7 = gUtil.getNextday(7);
//    	this.setDefValue('change_date', next7);
    	
//		//명령툴바 생성
//        var buttonToolbar = this.createCommandToolbar();
    	
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
        	REMOVE_BUTTONS : [
        	       'REGIST', 'COPY', 'REMOVE'
        	],
        	RENAME_BUTTONS : [
        	       // { key: 'EDIT', text: '출고확인'},
        	       // { key: 'REMOVE', text: '출하반려'}
        	]
        });

        //모델 정의
        this.createStore('Rfx.model.Heavy4DeliveryPending', [{
	            property: 'create_date',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/,{
        		car_name: 'r.coord_key1'
	        }
	        );

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        //arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);
        
        //작업지시 Action 생성
        /*this.addDeliveryConfirm = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			 text: '출고확인',
			 tooltip: '출고확인 확정',
			 disabled: true,
			 handler: function() {
				var rec = gMain.selPanel.vSELECTED_RECORD;
				var msg = '납품서 생성을 위한 출고를 확정합니다.<br>이 작업은 취소할 수 없습니다.';
				msg = msg + '<hr>';
				msg = msg + '<font color=#163F69><b>고개사(수주일):</b></font> ' + rec.get('name') +'<br>';
				msg = msg + '<font color=#163F69><b>제품:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b></font> ' + rec.get('item_code') + ' | ' + rec.get('specification') +'<br>';
				msg = msg + '<font color=#163F69><b>배송목적지:&nbsp;&nbsp;&nbsp;</b></font> ' + rec.get('reserved_varchar1') +'<br>';
				msg = msg + '<font color=#163F69><b>배송차량:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b></font> ' + rec.get('reserved_varchar2') +'<hr>';
				
				var out_qty = rec.get('reserved_double1') - rec.get('delivery_qty');
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
								},{
									xtype: 'numberfield',
									fieldLabel: '출고수량',
									name: 'out_qty',
									value:  out_qty,
									anchor: '100%'
								}
		                     ]
		        });
		        var win = Ext.create('ModalWindow', {
		            title: '출고 확인',
		            width: 400,
		            height: 270,
		            minWidth: 400,
		            minHeight: 270,
		            items: form,
		            buttons: [{
		                text: '확인',
		            	handler: function(){
		            		var val = form.getValues(false);
		            		 gMain.selPanel.addDeliveryConfirmFc(val['out_qty']);
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
		});*/
        //출고지시 Action 생성
        this.addDeliveryConfirm = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			 text: '출하지시',
			 tooltip: '출하지시',
			 disabled: true,
			 handler: function() {
				var rec = gMain.selPanel.vSELECTED_RECORD;
				
				var out_qty = rec.get('reserved_double1') - rec.get('delivery_qty');
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
		             items: [{
									xtype: 'textfield',
									fieldLabel: '납품장소',
									name: 'reserved_varchar1',
									anchor: '100%'
								},{
									xtype: 'numberfield',
									fieldLabel: '납품수량',
									name: 'out_qty',
									value:  out_qty,
									anchor: '100%'
								}
		                     ]
		        });
		    	
		    	switch(vCompanyReserved4){
		    		case 'SHNH01KR':
		    			var win = Ext.create('ModalWindow', {
				            title: '출하지시',
				            width: 400,
				            height: 150,
				            minWidth: 400,
				            minHeight: 150,
				            items: form,
				            buttons: [{
				                text: '확인',
				            	handler: function(){
				            		var val = form.getValues(false);
				            		 gMain.selPanel.addDeliveryConfirmFc(val['out_qty'], val['reserved_varchar1']);
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
		    	
		    			break;
		    		default:
		    			var win = Ext.create('ModalWindow', {
				            title: '메시지',
				            html: '<br><p style="text-align:center;">출하 지시를 내리시겠습니까?</p>',
				            width: 300,
				            height: 120,
				            buttons: [{
				                text: '예',
				            	handler: function(){
				            		var val = form.getValues(false);
				            		 gMain.selPanel.addDeliveryConfirmFc(val['out_qty'], val['reserved_varchar1']);
					            		if(win) {
					            			win.close();
					            		}
				            	}
				            },
				            {
				            	text: '아니오',
				            	handler: function(){
				            		if(win) {
				            			win.close();
				            		}
				            	}
				            }]
				        });
		    	}
		    	
		    	
		        
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
    	
        buttonToolbar.insert(2, this.addDeliveryConfirm);
        buttonToolbar.insert(2, '-');
        
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
            	gMain.selPanel.addDeliveryConfirm.enable();
            } else {
            	gMain.selPanel.addDeliveryConfirm.disable();
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
        gMain.setCenterLoading(false);
        this.store.load(function(records){});

    },
    addDeliveryConfirmFc: function(out_qty, reserved_varchar1) {
    	if(this.vSELECTED_RECORD==null) {
    		Ext.MessageBox.alert('오류', '선택한 항목를 찾을 수 없습니다.');
    		
    	} else {
        	var rtgastUid = this.vSELECTED_RECORD.get('id');
        	var stock_pos = this.vSELECTED_RECORD.get('po_no');
        	
    	    Ext.Ajax.request({
    			url: CONTEXT_PATH + '/sales/delivery.do?method=addDeliveryConfirmByRqstHeavy',
    			params:{
    				rtgastUid: rtgastUid,
    				out_qty : out_qty,
    				stock_pos : stock_pos,
    				reserved_varchar1 : reserved_varchar1
    			},
    			
    			success : function(result, request) { 
    				gMain.selPanel.store.load(function(records){
    					/*var id = gMain.selPanel.selectedUid;
    					gMain.selPanel.grid.getSelectionModel().deselectAll();
    					gMain.selPanel.grid.getSelectionModel().select( gMain.selPanel.store.getById( id ) );*/
    				});
    				//Ext.Msg.alert('안내', '납품서를 생성하였습다. <br>[출하현황] 메뉴를 확인하세요.', function() {});
    				
    			},//endofsuccess
    			failure: extjsUtil.failureMessage
    		});//endofajax
    	}

    },
    items : []
});
