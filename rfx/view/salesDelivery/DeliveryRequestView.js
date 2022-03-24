//출하 현황
Ext.define('Rfx.view.salesDelivery.DeliveryRequestView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'delivery-request-view',
    initComponent: function(){
    	
//    	this.setDefValue('create_date', new Date());
//    	
//    	var next7 = gUtil.getNextday(7);
//    	this.setDefValue('change_date', next7);
    	
//		//명령툴바 생성
//        var buttonToolbar = this.createCommandToolbar();
    	
    	// 검색툴바 필드 초기화
    	this.initSearchField();
    	
    	
		this.addSearchField ({
			type: 'dateRange',
			field_id: 'delivery_plan',
			text: "납품예정일",
			sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
			edate: new Date()
		});	
//		
    	this.addSearchField (
				{
					type: 'combo'
					,field_id: 'pm_name'
					,store: 'UserDeptStoreOnly'
					,params: {hasNull:true, dept_code: '02'}
					,displayField:   'user_name'
					,valueField:   'user_name'
					,innerTpl	:'<div data-qtip="{user_name}">{user_name}</div>'
				});
		
		this.addSearchField('pj_code');
		this.addSearchField('task_title');
		this.addSearchField('reminder');
//		this.addSearchField('noti_flag');
		
		
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
        	REMOVE_BUTTONS : [
        	       'REGIST', 'COPY'
        	],
        	RENAME_BUTTONS : [
        	       // { key: 'EDIT', text: '출고확인'},
        	        { key: 'REMOVE', text: '출하반려'}
        	]
        });

        //모델 정의
        this.createStore('Rfx.model.DeliveryRequest', [{
	            property: 'start_plan',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/,{
//        		car_name: 'r.coord_key1'
	        }
	        );

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);
        
        //작업지시 Action 생성
        this.addDeliveryConfirm2 = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			 text: '출하요청',
			 tooltip: '출하요청 확인',
			 disabled: true,
			 handler: function() {
				var rec = gMain.selPanel.vSELECTED_RECORD;

				var task_title = rec.get('task_title');
				var reminder = rec.get('reminder');
				var description = rec.get('description');
				var delivery_info = rec.get('delivery_info');
				var not_dl_qty = rec.get('not_dl_qty');
				var delivery_plan = rec.get('delivery_plan');
				var noti_flag = rec.get('noti_flag');
				var IsAllDay = rec.get('is_all_day');
				
				
				//포장단위
				var unit_code=rec.get('unit_code');//포장단위 BOX/VENDING
				console_logs('unit_code@@@@',unit_code);
				if(unit_code=='UNIT_PC'){
					unit_code='BOX';
//					var reserved_number4 = rec.get('reserved_number4');//포장수량
//					var reserved6 = rec.get('reserved6');//품명
//					var reserved7 = rec.get('reserved7');//가로
//					var reserved8 = rec.get('reserved8');//세로
//					var reserved9 = rec.get('reserved9');//높이
//					var reserved10 = rec.get('reserved10');//적재패턴
//					var reserved11 = rec.get('reserved11');//비고
					//카톤박스
					var reserved_number4 = rec.get('reserved15');//포장수량
					var reserved6 = rec.get('reserved6');//품명
					var reserved2 = rec.get('reserved7');//가로
					var reserved3 = rec.get('reserved8');//세로
					var reserved4 = rec.get('reserved9');//높이
					var reserved10 = rec.get('reserved10');//적재패턴
					var reserved11 = rec.get('reserved11');//비고
					
				}else{//UNIT_SET
					unit_code='VENDING';
					//팔레트
//					var reserved_double5 = rec.get('reserved14');//적재수량
					var reserved_number4 = rec.get('reserved14');//적재수량
					var reserved1 = rec.get('reserved1');//유형
					var reserved2 = rec.get('reserved2');//가로
					var reserved3 = rec.get('reserved3');//세로
					var reserved4 = rec.get('reserved4');//높이
					var reserved5 = rec.get('reserved5');//무게

				}
				


				
				
				console_logs('not_dl_qty',not_dl_qty);
				console_logs('reserved_number4',reserved_number4);
				var ea = 0;
				if(reserved_number4>0){
					ea = Math.ceil((Number(not_dl_qty)/Number(reserved_number4))); //.toFixed(0);
				}
				
		    	var prd_vol = Number(ea*reserved2*reserved3*reserved4);
				
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
//									html: msg,
									anchor: '100%'
								}
		            	 ,{
									xtype: 'textfield',
									fieldLabel: '고객사',
									name: 'task_title',
									value:  task_title,
									anchor: '100%',
					                fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;',
					                readOnly: true
								},{
									xtype: 'textfield',
									fieldLabel: '제품명',
									name: 'reminder',
									value:  reminder,
									anchor: '100%',
					                fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;',
					                readOnly: true
								},{
									xtype: 'textarea',
									fieldLabel: '상세설명',
									name: 'description',
									value:  description,
									anchor: '100%',
									grow: true,
					                growMax: 150,
					                maxLength:10000,
					                anchor: '100%',
					                fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;',
					                readOnly: true
								},{
									xtype: 'textfield',
									fieldLabel: '배송지',
									name: 'delivery_info',
									value:  delivery_info,
									anchor: '100%'
								},{
									xtype: 'numberfield',
									fieldLabel: '납품계획수량',
									name: 'not_dl_qty',
									value:  not_dl_qty,
									anchor: '100%',
									listeners: {
				                          change: function(field, value) {
				                        	
				              				if(reserved_number4>0){
				              					ea = Math.ceil((Number(value)/Number(reserved_number4))); //.toFixed(0);
				              				}else{
				              					var ea = 0;
				              				}
				              				var prd_vol = Number(ea*reserved2*reserved3*reserved4);

											Ext.getCmp('prd_vol').setValue(prd_vol);
				              		    	Ext.getCmp('prd_ea').setValue(ea);
				              		    	Ext.getCmp('car_vol').getValue(car_vol);
						                    
				              		    	var car_vol = Ext.getCmp('car_vol').getValue();
						                    if(car_vol>0&&prd_vol>0){
						                       	weight_percent = Number(prd_vol/car_vol)*100;
						                    }else{
						                       	var weight_percent = 0;
						                    };
				              		    	
				              		    	
				              		    	
					                        Ext.getCmp('weight_percent').setValue(weight_percent.toFixed(2));
					                        
				                        	  
				                          }
									}
								},{
									xtype: 'datefield',
									fieldLabel: '배송일시',
									name: 'delivery_plan',
									value:  delivery_plan,
									anchor: '100%'
								},{
						            xtype: 'timefield',
//						            labelWidth: 0,
						            fieldLabel: '배송시간',
						            name: 'delivery_time',
						            anchor: '100%',
//						            hideLabel: true,
						            width: 110,
						            minValue: '7:00 AM',
						            maxValue: '11:00 PM',
						            value: '7:00 AM',
						            increment: 30,
						            format: 'H:i'
								},{
									xtype: 'combo',
									fieldLabel: '차량지정',
									name: 'noti_flag',
									value:  noti_flag,
									anchor: '100%',
									store: Ext.create('Mplm.store.CarMgntStore',{})
									,displayField: 'reserved_varchar1'
									,valueField: 'class_code'
									,innerTpl	: '<div data-qtip="{unique_id}">{reserved_varchar1}</div>',
					                triggerAction: 'all',
					                listeners: {
					                    select: function(combo, record) {
					                        var horizon = record.get('reserved_double1'); //가로
					                        var vertical = record.get('reserved_double2'); //세로
					                        var height = record.get('reserved_double3'); //높이
					                        var allow_weight = record.get('reserved_double4'); //허용하중
			                                
					                        var car_vol = Number(horizon*vertical*height);
					                        var weight_percent = 0;
					                        
					                        if(car_vol>0&&prd_vol>0){
					                        	weight_percent = Number(prd_vol/car_vol)*100;
					                        }
					                        
					                        Ext.getCmp('car_vol').setValue(car_vol);
					                        Ext.getCmp('weight_percent').setValue(weight_percent.toFixed(2));

					                    }
					                }
								}
		                     ]
		        });
		    	
		    	
		    	var capacityForm = Ext.create('Ext.form.Panel', {
		            defaultType: 'textfield',
		            border: false,
		            bodyPadding: 15,
		            region: 'east',
                    title: '용적율 계산',
                    width: 300,
                    split: true,
                    collapsible: true,
                    floatable: false,
		            defaults: {
		                anchor: '100%',
		                allowBlank: false,
		                msgTarget: 'side',
		                labelWidth: 80
		            },
		             items: [
		            	 {
//								xtype: 'combo',
//								fieldLabel: '포장방식', //포장단위
//								name: 'unit_code',
//								displayField: 'codeName',
//								valueField: 'systemCode',
//								value:  unit_code,
//								anchor: '100%',
//								store: Ext.create('Mplm.store.CommonUnitStore',{})
//								,displayField: 'codeName'
//								,valueField: 'systemCode'
//								,innerTpl	: '<div>{codeName}</div>',
//				                triggerAction: 'all',
//				                fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;',
////				                readOnly: true,
//				                listeners: {
//				                    select: function(combo, record) {
//
//				                    }
//				                }
		            		 	xtype: 'textfield',
								fieldLabel: '포장방식',
								value:  unit_code ,
								anchor: '100%',
								fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;',
				                readOnly: true

				                
							},
		            	 
				            	 {
				            	        xtype: 'fieldset',
				            	        title: '카톤박스/파레트 규격',
				            	        defaults: {
				            	            labelWidth: 80,
				            	            anchor: '100%',
				            	            layout: {
				            	                type: 'hbox',
				            	                defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
				            	            }
				            	        },
				            	        
				            	        items: [{
											xtype: 'textfield',
											fieldLabel: '가로(X)',
											value:  reserved2 ,
											anchor: '100%',
							                fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;text-align:right;',
							                readOnly: true
										},{
											xtype: 'textfield',
											fieldLabel: '세로(Y)',
											value:  reserved3 ,
											anchor: '100%',
							                fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;text-align:right;',
							                readOnly: true
										},{
											xtype: 'textfield',
											fieldLabel: '높이(Z)',
											value:  reserved4 ,
											anchor: '100%',
							                fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;text-align:right;',
							                readOnly: true
										},{
											xtype: 'textfield',
											fieldLabel: '적재수량\n(포장단위)',
											value:  reserved_number4,
											anchor: '100%',
							                fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;text-align:right;',
							                readOnly: true
										},/*{
											xtype: 'textfield',
											fieldLabel: '밴딩수량',
											value:  reserved_number4,
											anchor: '100%',
							                fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;text-align:right;',
							                readOnly: true
										},*/{
											xtype: 'textfield',
											fieldLabel: '갯수',
											id:'prd_ea',
											value:  ea,//ea.toFixed(1),//'출하수량/포장수량=',
											anchor: '100%',
							                fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;text-align:right;',
							                readOnly: true
										},{
											xtype: 'textfield',
											fieldLabel: '제품용적',
											id:'prd_vol',
											name:'prd_vol',
											value:  prd_vol,//'갯수*가로*세로*높이=',
											anchor: '100%',
							                fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;text-align:right;',
							                readOnly: true
										}]
				            	 },
				            	 {
										xtype: 'textfield',
										id:'car_vol',
										name:'car_vol',
										fieldLabel: '차량용적',
										value:  '가로*세로*높이',
										anchor: '100%',
						                fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;',
						                readOnly: true
									},
				            	 {
										xtype: 'textfield',
										fieldLabel: '용적율',
										id:'weight_percent',
										value:  '제품용적/차량용적 *100%',
										anchor: '100%',
						                fieldStyle: 'font-weight:100%;background-color: #F0F0F0; background-image: none; color:#5F6DA3;',
						                readOnly: true
									}
								
		                     ]
		        });
		    	
		        var win = Ext.create('ModalWindow', {
		            title: gm.getMC('CMD_Shipment_request', '출하 요청'),
		            width: 680,
		            height: 480,
		            minWidth: 600,
		            minHeight: 300,
		            items: [form,
		            	capacityForm
		            	],
		            buttons: [{
		                text: '확인',
		            	handler: function(){
		            		var val = form.getValues(false);
		            		
		            		 gMain.selPanel.addDeliveryRequestFc(val);
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
    	
        buttonToolbar.insert(3, this.addDeliveryConfirm2);
        buttonToolbar.insert(3, '-');
        
        if (vCompanyReserved4 == 'DABP01KR') {

            this.setWorkView = Ext.create('Ext.Action', {
                xtype: 'button',
                text: gm.getMC('CMD_Proceeding', '진행중'),
                tooltip: '진행중',
                //ctCls: 'x-toolbar-grey-btn',
                toggleGroup: 'pjttskViewType',
                handler: function() {
                	gm.me().store.getProxy().setExtraParams({});
//                    gm.me().store.getProxy().setExtraParam('task_quan', 'N');
                    gm.me().store.load(function() {});

                }
            });
            this.setFinView = Ext.create('Ext.Action', {
                xtype: 'button',
                text: gm.getMC('sro1_completeAction', '완료'),
                tooltip: '완료',
                //ctCls: 'x-toolbar-grey-btn',
                toggleGroup: 'pjttskViewType',
                handler: function() {
                	gm.me().store.getProxy().setExtraParams({});
                    gm.me().store.getProxy().setExtraParam('task_quan', 'Y');
                    gm.me().store.load(function() {});

                }
            });
        }
        buttonToolbar.insert(7, this.setFinView);
        buttonToolbar.insert(7, this.setWorkView);
 
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
            	gMain.selPanel.addDeliveryConfirm2.enable();
            	var rec = selections[0];
            	gMain.selPanel.SELECTED_UID=rec.get('unique_id');
            	gMain.selPanel.SELECTED_PJCODE=rec.get('pj_code');
            	console_logs("SELECTED_PJCODE",gMain.selPanel.SELECTED_PJCODE);
            } else {
            	gMain.selPanel.addDeliveryConfirm2.disable();
            }
//            this.rtgastUids = [];
//            this.reserved_number3s = [];
//            this.out_qtys = [];
//           	for(var i=0; i<selections.length; i++){
//        		var rec1 = selections[i];
//        		gMain.selPanel.num = selections.length;
////        		gMain.selPanel.rtgastUids.push(rec1.get('unique_id'));
////        		gMain.selPanel.reserved_number3s.push(rec1.get('reserved_number3'));
////        		gMain.selPanel.out_qty.push(rec1.get('delivery_qty'));
//        		this.rtgastUids.push(rec1.get('unique_id'));
//        		this.reserved_number3s.push(rec1.get('reserved_number3'));
//        		this.out_qtys.push(rec1.get('reserved_double8'));
//        	   }
           	
//           	console_logs('gMain.selPanel.rtgastUids',gMain.selPanel.rtgastUids);
//           	console_logs('gMain.selPanel.reserved_number3s',gMain.selPanel.reserved_number3s);
//           	console_logs('gMain.selPanel.out_qty',gMain.selPanel.out_qty);
//           	console_logs('gMain.selPanel.rtgastUids',this.rtgastUids);
//           	console_logs('gMain.selPanel.reserved_number3s',this.reserved_number3s);
//           	console_logs('gMain.selPanel.out_qty',this.out_qtys);

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
    addDeliveryRequestFc: function(val) {
//    	if(this.vSELECTED_RECORD==null) {
//    		Ext.MessageBox.alert('오류', '선택한 항목를 찾을 수 없습니다.');
//    		
//    	} else {
    		var d = val['delivery_plan'];
    		var res = d.split('-');
    		d = new Date(res[0],res[1],res[2]);
	    	var s = val['delivery_time'];
	    	console_logs('d',d);
	    	console_logs('s',s);
	        isPM = s.indexOf('P') > -1;
	        hours = parseInt(s.substr(0, 2), 10);
	        minutes = null;

		    if (hours !== 12) {
		        hours += isPM ? 12 : 0;
		    } else if (!isPM) {
		        hours = 0;
		    }
		    minutes = parseInt(s.substr(3, 2), 10) + (hours * 60);
		    console_logs('minutes',minutes);
		    d = Ext.Date.add(d, Ext.Date.MINUTE, minutes);
		    e = Ext.Date.add(d, Ext.Date.HOUR, 1);
		    d = gUtil.yyyymmdd_full(d,'-');
		    e = gUtil.yyyymmdd_full(e,'-');
		    console_logs('시간계산 start date',d);
		    console_logs('시간계산 end date',e);
		    
    		var delivery_plan = val['delivery_plan'];//+' '+val['delivery_time']
    		var datasArr = [];
    		var o = {};
    		o['EventId'] = gMain.selPanel.SELECTED_UID;
    		o['CalendarId'] = val['noti_flag'];//지정차량
    		o['Title'] = val['task_title'];//고객사
    		o['StartDate'] = d;
    		o['EndDate'] =  e;
    		o['Location'] = val['delivery_info'];//배송지
    		o['Notes'] = val['description'];//상세설명
    		o['Url'] = val['not_dl_qty'];//납품수량
    		o['IsAllDay'] = 'true';//배차여부
    		o['Reminder'] = val['reminder'];//제품명
    		o['IsNew'] = 'true';
    		o['reserved_double2'] = val['prd_vol'];
    		o['reserved_double3'] = val['car_vol'];
    		
    		Reminder =  val['reminder'];//제품명
			CalendarId = val['noti_flag'];//지정차량
			Title = val['task_title'];//고객사
			IsNew= 'true';
			EndDate=  e;
			Url = val['not_dl_qty'];//납품수량
			StartDate = d;
			reserved_double3= val['prd_vol'];
			reserved_double2= val['car_vol'];
			IsAllDay= 'true';//배차여부
			EventId= gMain.selPanel.SELECTED_UID;
			Notes= val['description'];//상세설명
			Location= val['delivery_info'];//배송지
			
    		var s = Ext.JSON.encode(o);
    		console_logs('s', s);
    		
    		datasArr.push(s);
    		
    	    Ext.Ajax.request({
			url: CONTEXT_PATH + '/eventMgmt/event.do?method=createJson',
			params:{
				Reminder : Reminder,
    			CalendarId : CalendarId,
    			Title : Title,
    			IsNew: IsNew,
    			EndDate: EndDate,
    			Url: Url,
    			StartDate: StartDate,
    			reserved_double3: reserved_double3,
    			reserved_double2: reserved_double2,
    			IsAllDay: IsAllDay,
    			EventId: EventId,
    			Notes: Notes,
    			Location: Location,
    			pj_code: gMain.selPanel.SELECTED_PJCODE
			},
			
			success : function(result, request) { 
				if(this.win) {
					this.win.close();
				}
				gm.me().store.load();				
			},//endofsuccess
			failure: extjsUtil.failureMessage
		});//endofajax
    		
    		
    		
    		
    		
    		
////    		var rtgastUids = [];
////    		var reserved_number3s = [];
////    		var out_qty = [];
////    		 this.rtgastUids = [];
////             this.reserved_number3s = [];
////             this.out_qty = [];
//        	//var rtgastUid = this.vSELECTED_RECORD.get('id');
//    	    Ext.Ajax.request({
//    			url: CONTEXT_PATH + '/sales/delivery.do?method=addDeliveryRequestByRqstDO',
//    			params:{
//    				unique_id: gMain.selPanel.SELECTED_UID,
//    				delivery_info: val['delivery_info'],
//    				req_qty: val['not_dl_qty'],
//    				delivery_plan: val['delivery_plan'],
//    				noti_flag: val['noti_flag'],
//    			},
//    			
//    			success : function(result, request) { 
//    				gMain.selPanel.store.load(function(records){
//    					var id = gMain.selPanel.selectedUid;
//    					gMain.selPanel.grid.getSelectionModel().deselectAll();
//    					gMain.selPanel.grid.getSelectionModel().select( gMain.selPanel.store.getById( id ) );
//    				});
//    				Ext.Msg.alert('안내', '출하요청을 완료하였습니다. <br>[출하대기] 메뉴를 확인하세요.', function() {});
//    				
//    			},//endofsuccess
//    			failure: extjsUtil.failureMessage
//    		});//endofajax
//    	}

    },
    items : [],
    rtgastUids : [],
	reserved_number3s : [],
	out_qtys : []
	,
    selMode : 'SINGLE',
    selCheckOnly: false,
    selAllowDeselect: true,
});
