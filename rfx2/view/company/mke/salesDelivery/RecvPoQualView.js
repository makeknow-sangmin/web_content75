//수주관리 메뉴
Ext.define('Rfx2.view.company.mke.salesDelivery.RecvPoQualView', {
	extend: 'Rfx2.base.BaseView',
    xtype: 'receved-mgmt-qual-view',
    inputBuyer : null,
    initComponent: function(){
//    	this.callOverridden();
//    	this.setDefValue('regist_date', new Date());
    	// 삭제할때 사용할 필드 이름.
//    	this.setDeleteFieldName('unique_uid');
    	
//    	var next7 = gUtil.getNextday(7);
//    	this.setDefValue('delivery_plan', next7);
//    	this.defOnlyCreate = true;
//    	this.setDefComboValue('pm_uid', 'valueField', -1); // Hidden
//																		// Value임.
//    	this.setDefComboValue('pj_type', 'valueField', 'P');
//    	this.setDefComboValue('newmodcont', 'valueField', 'N');
//    	this.setDefComboValue('unit_code', 'valueField', 'UNIT_PC');
//    	this.setDefComboValue('selfdevelopment', 'valueField', 'N');// 세트여부
//    	this.setDefComboValue('previouscont', 'valueField', 'C');// 목형유형
//    	this.setDefComboValue('reserved_varcharc', 'valueField', 'EA');// 목형유형
    	
    	// this.setDefValue('pj_code', 'test');
    	this.callParent([]);
    	// 검색툴바 필드 초기화
    	this.initSearchField();
    	this.addSearchField('item_code');
    	
//		this.addSearchField ({
//			type: 'dateRange',
//			field_id: 'regist_date',
//			text: gm.getMC('CMD_Order_Date', '등록일자'),
//			sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
//			edate: new Date()
//		});	
//		
//		this.addSearchField (
//		{
//			type: 'combo'
//			,field_id: 'status'
//			,store: "RecevedStateStore"
//			,displayField: 'codeName'
//			,valueField: 'systemCode'
//			,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
//		});	
//    	
		this.addFormWidget('영업', {
			tabTitle:"영업", 
			id:	'nation_QA',
			xtype: 'combo',
			text: '지역',
			name: 'nation_QA',
			storeClass: 'CommonCodeStore',
			params:{parentCode: "NATION"},
			displayField: "codeName",
			valueField: "systemCode", 
			innerTpl: "<div>{codeName}</div>", 
			listeners: {
				select: function (combo, record) {
					var system_code = record.get('system_code');
					var code_name_kr = record.get('code_name_kr');
					gm.me().getInputTarget('h_reserved119').setValue(system_code);
					
					var soTypeStore = Ext.getCmp('SO_TYPE_QA');					
					
					soTypeStore.store.getProxy().setExtraParam('egci_code', system_code);
					soTypeStore.store.load(function(record) {
						console_logs('>>> record 222', record);
					});
					// soTypeStore.store.load({
					// 	callback: function(record) {

					// 		for(var i=0; i<record.length; i++) {
					// 			var r = record[i];

					// 			var egci_code = r.get('egci_code');
					// 			var bottom_class_flag = r.get('bottom_class_flag');
					// 			var class_code = r.get('class_code');

					// 			var nation = '국내';
					// 			switch(egci_code) {
					// 				case 'K':
					// 				nation = '국내';
					// 				break;
					// 				case 'F':
					// 				nation = '해외';
					// 				break;
					// 				case 'T':
					// 				nation = '대만';
					// 				break;
					// 			}

					// 			r.set('class_code', nation + ' / ' + class_code);

					// 		}
					// 	}
					// });
				}
			},
			canCreate:   true,
			canEdit:     true,
			canView:     true,
			position: 'top',
			tableName: '',
			code_order:	14
		}); 

		this.addFormWidget('영업', {
				tabTitle:"영업", 
				id:	'SO_TYPE_QA',
				xtype: 'combo',
				text: 'SO_TYPE',
				name: 'SO_TYPE_QA',
				storeClass: 'ClaastStore',
				params:{identification_code: "SO_TYPE"},
				displayField: "class_code",
				valueField: "class_name", 
				innerTpl: "<div>[{class_code}] {class_name}</div>", 
				listeners: {
					select: function (combo, record) {
						
							var pjCode = gm.me().getInputTarget('pj_code').getValue();

							var rawValue = combo.lastMutatedValue;
							var preValue = this.BACK_SO_TYPE;
							if(preValue != null && preValue != undefined && preValue.length > 0
								&& rawValue != null && rawValue != undefined && rawValue.length > 0) {
								if(rawValue == preValue) {
									return;
								}
							}
							
						
						// gm.me().getInputTarget('pj_code').setValue(record.get('class_name'));
						gm.me().getInputTarget('reserved1').setValue(record.get('class_type'));
						gm.me().getInputTarget('reserved3').setValue(record.get('class_code'));

						var bottom_class_flag = record.get('bottom_class_flag');
							egci_code 		 = record.get('egci_code');
							
						if(bottom_class_flag == null || bottom_class_flag.length < 1) {
								bottom_class_flag = 'D';
						}

						gm.me().getInputTarget('h_reserved120').setValue(bottom_class_flag);
									
						gm.me().CHECK_PJ_CODE = false;
						
						var prdStore = Ext.getCmp('PRD_TYPE_QA');
						
						var class_code = record.get('class_code');
						var iqa = class_code.substr(0,3);
						if(iqa != null && iqa == 'IQA') {
								class_code = class_code.substr(4,5);
						} else {
								class_code = class_code.substr(0,2);
						}
						
						prdStore.store.getProxy().setExtraParam('identification_code', 'PRD_TYPE');
						prdStore.store.getProxy().setExtraParam('parent_class_code', class_code);
						prdStore.store.getProxy().setExtraParam('class_type', record.get('class_type'));
						
						prdStore.store.load();
					},
					//    beforequery: function(combo) {
					// 	   console_logs('>>> after render', combo);
					// 		// var length = combo['store']['data']['items'].length;

					// 		// for(var i=0; i<length; i++) {
					// 		// 	var r = combo['store']['data']['items'][i];

					// 		// 	var egci_code = r.get('egci_code');
					// 		// 	var bottom_class_flag = r.get('bottom_class_flag');
					// 		// 	var class_code = r.get('class_code');

					// 		// 	var nation = '국내';
					// 		// 	switch(egci_code) {
					// 		// 		case 'K':
					// 		// 		nation = '국내';
					// 		// 		break;
					// 		// 		case 'F':
					// 		// 		nation = '해외';
					// 		// 		break;
					// 		// 		case 'T':
					// 		// 		nation = '대만';
					// 		// 		break;
					// 		// 	}

					// 		// 	r.set('class_code', class_code + ' / ' + nation);

					// 		// }
					//    }
				},
				canCreate:   true,
				canEdit:     true,
				canView:     true,
				position: 'top',
				tableName: '',
				code_order:	15
			}); 
		this.addFormWidget('영업', {
				tabTitle:"영업", 
				id:	'PRD_TYPE_QA',
				xtype: 'combo',
				text: '제품군 선택',
				name: '제품군 선택',
				storeClass: 'ClaastStore',
				params:{identification_code: "PRD_TYPE"},
				displayField: "class_code",
				valueField: "class_code", 
				innerTpl: "<div>[{class_code}] {class_name}</div>", 
				listeners: {
					select: function (combo, record) {
		//			        	   gm.me().getInputTarget('item_code').setValue(record.get('class_name')+record.get('class_code'));
						gm.me().item_code_first='';
						var code = record.get('class_code');
						if(code != null && code.length > 1) {
								code = code.substr(0,2);
						};

						gm.me().item_code_first=record.get('class_name')+code;
						gm.me().getInputJust('partline|sg_code').setValue(record.get('class_code'));
						gm.me().getInputJust('itemdetail|h_reserved21').setValue(record.get('class_code'));
					}
				},
				canCreate:   true,
				canEdit:     true,
				canView:     true,
				position: 'top',
				tableName: '',
				code_order:	15
			});
    	
		this.addFormWidget('품질', {
	     	   tabTitle:"품질", 
	     	   	id:	'TYPE',
	            xtype: 'combo',
	            text: '품목/Type 선택',
	            name: '품목/Type 선택',
	            storeClass: 'ClaastStore',
	            params:{identification_code: "QA_TYPE"},
	            displayField: "class_name",
	            valueField: "class_code", 
	            innerTpl: "<div>{class_name}</div>", 
	            listeners: {
			           select: function (combo, record) {
			        	   gm.me().getInputJust('itemdetail|h_reserved52').setValue(record.get('class_name'));
			           }
		        },
	            canCreate:   true,
	            canEdit:     true,
	            canView:     true,
	            position: 'top',
	            tableName: '',
	            code_order:	15
	        }); 
		
		// ITEM_CODE 자동생성
		this.addCallback('AUTO_ITEM', function(o){
			console_logs('>>>>o', o);
			o.width = 150;
//			var item_code_first = gm.me().getInputTarget('PRD_TYPE').getValue(); //품목코드 4자리 Value값 가져오기
			var target_size = gm.me().getInputTarget('h_reserved12').getValue(); //tagersize(mil) Value값 가져오기
			var unit_code = gm.me().getInputTarget('unit_code').getValue(); //KTF/KM Value값 가져오기
			var target_val = '';
			// if(target_size<1){
			// 	target_val = '0'+(target_size*10)+'0';
			// }else{
			// 	target_val = (target_size*10)+'0';
			// }
				
			
			switch(unit_code){
				case 'KFT':
					unit_code='F'
					break;
				case 'KM':
					unit_code='M'
					break;
			}

			var rep = target_size.replace('.', '');

			if(target_size != null && rep.length < 3) {
				var str = target_size + "";
				str = target_size.substr(0,1);
				target_size = Math.floor(target_size*100);
				target_size += "";

				if(str == '0') {
					target_size = '0' + target_size;
				} 
			}

			var new_item_code = '';
			new_item_code = gm.me().item_code_first+target_size+'MXX'+unit_code;
			new_item_code = new_item_code.replace('.', '');
			gm.me().getInputTarget('item_code').setValue(new_item_code);
			
		});

		// Total(KM) 자동계산 (영업)
		this.addCallback('AUTO_CALC', function(o){
			var unit_code = gm.me().getInputTarget('unit_code').getValue(); //KTF/KM Value값 가져오기
			var spools = gm.me().getInputTarget('h_reserved16').getValue(); //spools Value값 가져오기
			var quan = gm.me().getInputTarget('h_reserved15').getValue(); //요청수량 Value값 가져오기
			var value = 0;
			switch(unit_code){
				case 'KFT':
					value = (quan*spools*0.3048).toFixed(4);
					break;
				case 'KM':
					value = (quan*spools).toFixed(2);
					break;
			}
			gm.me().getInputTarget('bm_quan').setValue(value);
			gMain.handlInputFc('AUTO_ITEM', o);
		});	

		// 기준정보 2에서 데이터 가져오기
		this.addCallback('AUTO_LOT', function(o){
			console_logs('>>>o', o);
			var class_code = gm.me().getInputTarget('h_reserved28').getValue(); //Type(기술)

			switch(class_code) {
				case 'LL':
					class_code = 'L';
				break;
				case 'TT':
					class_code = 'T';
				break;
				case 'RR':
					class_code = 'R';
				break;
				case 'MM':
					class_code = 'M';
				break;
			}
			
		   Ext.Ajax.request({
				url: CONTEXT_PATH + '/b2b/cadnpart.do?method=getclaast',
				params:{
					identification_code: 'WT',
					class_code_unique :class_code
				},
				
				success : function(result, request) { 
					
					var oStr = result.responseText;
					//Lot_no=용해 작업 /연주굵기/중간열처리/Materal_EL구분용
					//class_name/reserved_varchar1/reserved_varchar4/reserved_varchar3
					var o = Ext.decode(oStr);
					console_logs('CHECK_COMP',o);
                    // var class_name = '';
                    var reserved_varchar1 = '';
                    var reserved_varchar2 = '';
                    var reserved_varchar3 = '';
					var reserved_varchar4 = '';
					
                    if(o!=null && o['datas'].length > 0) {
                    	// class_name = o['datas'][0]['class_name'];
                    	reserved_varchar1 = o['datas'][0]['reserved_varchar1'];
                    	reserved_varchar2 = o['datas'][0]['reserved_varchar2'];
                    	reserved_varchar3 = o['datas'][0]['reserved_varchar3'];
                    	reserved_varchar4 = o['datas'][0]['reserved_varchar4'];
                    } else {
						Ext.Msg.alert('안내', '조회된 값이 없습니다.', function() {});
					}
        			//데이터 가져와서 넣어줄 입력폼
                    // gm.me().getInputJust('itemdetail|h_reserved28').setValue(class_name); //용해작업
                    gm.me().getInputJust('itemdetail|h_reserved29').setValue(reserved_varchar1); //연주굵기
                    
                    var so_type = gm.me().getInputTarget('reserved1').getValue();
        			
        			switch(so_type){
        		   		case 'Au':
        		   			gm.me().getInputJust('itemdetail|h_reserved30').setValue(reserved_varchar4); //중간열처리
        		   			break;
        		   		default:
        		   			gm.me().getInputJust('itemdetail|h_reserved30').setValue(''); //중간열처리
        	   			
        			}
                    gm.me().getInputJust('itemdetail|h_reserved32').setValue(reserved_varchar3); //Materal_EL 구분용
				},// endofsuccess
				failure: extjsUtil.failureMessage
			});// endofajax
			
		});

		// 기준정보 3에서 데이터 가져오기 (기술)
		this.addCallback('AUTO_REL', function(o){
			var class_code = gm.me().getInputTarget('h_reserved32').getValue(); //Type2
			var size_mil = gm.me().getInputTarget('h_reserved33').getValue();
		   Ext.Ajax.request({
				url: CONTEXT_PATH + '/b2b/cadnpart.do?method=getclaastELMax',
				params:{
					identification_code : 'WE', 
					class_code: class_code,
					reserved_varchar1 : size_mil
				},
				
				success : function(result, request) { 
					
					var oStr = result.responseText;
					console_logs('AUTO_REL',oStr);
					
					gm.me().getInputTarget('h_reserved26').setValue(oStr);
				},// endofsuccess
				failure: extjsUtil.failureMessage
			});// endofajax
			
		});

		// 고객SPEC 자동계산
		this.addCallback('AUTO_SPEC', function(o){
			var tol_unit = gm.me().getInputTarget('h_reserved14').getValue(); //tol. 단위
			var min = gm.me().getInputTarget('reserved_double1').getValue(); //tol(-)
			var max = gm.me().getInputTarget('reserved_double2').getValue(); //tol(+)
			var target_size = gm.me().getInputTarget('h_reserved11').getValue(); //tol(+)
			switch(tol_unit){
				case 'UM':
					var fix_value = 2;
					try {
						var min_arr = min.split('.');
						var max_arr = max.split('.');
						var split_min = '';
						var split_max = '';
						console_logs('>>>>> split_min ', split_min);

						if(min_arr[1].length < 1) {
							split_min = min_arr[0];
						} else {
							split_min = min_arr[1];
						}

						if(max_arr[1].length < 1) {
							split_max = max_arr[0];
						} else {
							split_max = max_arr[1];
						}

						var target_size_len = target_size.split('.')[1].length>0 ? target_size.split('.')[1] : target_size.split('.')[0];
						if(split_min.length==3 || split_max.length==3 || target_size_len == 3) {
							fix_value = 3
						}
					} catch (error) {
						fix_value = 2
					}
					
					//영업 Target Size(um) - 영업 Tol(-)
					gm.me().getInputTarget('h_reserved24').setValue(Number(target_size*10-Number(min*10))/10);
					//영업 Target Size(um) + 영업 Tol(+)
					gm.me().getInputTarget('h_reserved23').setValue(Number(Number(target_size*10)+Number(max*10))/10);
					gm.me().getInputTarget('h_reserved22').setValue(Number((Number(target_size*10)-Number(min*10))/10).toFixed(fix_value)+'um'+'~'+Number((Number(target_size*10)+Number(max*10))/10).toFixed(fix_value)+'um');
					
					break;
				case '%':
					//고객 하한(um) = Target Size(um) - (Target Size(um) *  Tol(-)) = 고객하한(um)
					gm.me().getInputTarget('h_reserved24').setValue(Number(Number(target_size)-(Number(target_size)*(Number(min)*0.01))).toFixed(3));
					//고객 상한(um) = Target Size(um) + (Target size(um) * Tol(+))
					gm.me().getInputTarget('h_reserved23').setValue(Number(Number(target_size)+(Number(target_size)*(Number(max)*0.01))).toFixed(3));
					//고객SPEC 자동입력
					gm.me().getInputTarget('h_reserved22').setValue(Number(Number(target_size)-(Number(target_size)*(Number(min)*0.01))).toFixed(3) +'um'+'~'+Number(Number(target_size)+Number(Number(target_size)*(Number(max)*0.01))).toFixed(3)+'um');
					break;
			}
			var so_type = gm.me().getInputTarget('reserved1').getValue();
			
			switch(so_type){
		   		case 'Au':
		   		case 'Ag':
		   			var type = gm.me().getInputTarget('sg_code').getValue();
		   			
		   			var first_code = type.substring( 0, 1 );
		   			var second_code = type.substring( 2, 1 );
		   			if(first_code==second_code){
		   				gm.me().getInputTarget('h_reserved21').setValue(first_code);
		   			}else{
		   				gm.me().getInputTarget('h_reserved21').setValue(type);
		   			}
		   			
		   			break;
		   		default:
		   			gm.me().getInputTarget('h_reserved21').setValue('');
		   			gm.me().getInputTarget('reserved1').setValue(record.get('class_name'));
	   			
			}
			
		});

		this.addCallback('GET_EL_SPEC_TARGET', function(o) {
			var val1 = gm.me().getInputJust('itemdetail|h_reserved102').getValue();
			var val2 = gm.me().getInputJust('itemdetail|h_reserved103').getValue();
			if(val1!=null){
				gm.me().getInputJust('itemdetail|h_reserved27').setValue(val1+' ± '+val2+'%');
			}
		});

		//기술
		this.addCallback('CHECK_EL_SPEC_TARGET', function(widget, event){
			console_logs('>>>> CHECK_EL_SPEC_TARGET', 'CHECK_EL_SPEC_TARGET');
			var val1 = gm.me().getInputJust('itemdetail|h_reserved102').getValue();
			var val2 = gm.me().getInputJust('itemdetail|h_reserved103').getValue();
			console_logs('>>>> val1', val1);
			console_logs('>>>> val2', val2);
			if(val1!=null && val1!='' && val1.length > 0){
				gm.me().getInputJust('itemdetail|h_reserved27').setValue(val1+' ± '+val2+'%');
			}
			
			// var type = gm.me().getInputTarget('sg_code').getValue(); //영업탭 Type
			// var qa_type =  gm.me().getInputTarget('srch_value').getValue();// 품목/Type
			var item_code =  gm.me().getInputJust('partline|item_code').getValue();// 품목번호
			console_logs('>>>> item_code', item_code);
			var substr4_itemcode = item_code.substring( 0, 4 );

			gMain.selPanel.MkeItemStore.getProxy().setExtraParam('pk', substr4_itemcode);
			gMain.selPanel.MkeItemStore.getProxy().setExtraParam('pk_full', substr4_itemcode);
			gMain.selPanel.MkeItemStore.load();
			
			gMain.selPanel.MkeItemGrid =
				Ext.create('Rfx2.view.grid.MkeItemGridTc', {
					id:'MkeItemGridTc-SRO3',
					border: true,
					resizable: true,
//	    		         collapsible: true,
					width: 1000,
					height: 490,
					store:  gMain.selPanel.MkeItemStore,
					listeners : {
						'rowdblclick' : function(){ // do something }
							win.close();
						}
					}
			
			});	    			
			var form = Ext.create('Ext.panel.Panel', {
				defaultType: 'textfield',
				id:'form-SRO3',
				border: false,
				width: 1020,
				height: 570,
				layout:'fit',
				scroll: true,
				autoScroll: true,
				defaults: {
					editable:false,
					allowBlank: false,
					msgTarget: 'side',
					labelWidth: 100
				},
					items: [{
						xtype: 'fieldset',
						title: CMD_SEARCH/*'검색'*/,
						boder: true,
						collapsible: true,
						margin: '5',
						width : 1000,
						height : 550,
						defaults: {
							anchor: '100%',
							layout: {
								type: 'hbox',
								anchor: '70%'
							}
						},
						items :[{
						xtype : 'fieldcontainer',
						layout: 'hbox',
						items: [{
							xtype: 'textfield',
							emptyText: '품목코드',
//				        			anchor: '100%',
							width: '95%',
							id : 'item_code-SRO3',
							name : 'item_code',
							fieldStyle: 'background-color: #FBF8E6; background-image: none;',
								listeners: {
										change: function(field, value) {
					                        	if(value.length>1){
					                        		gMain.selPanel.MkeItemStore.getProxy().setExtraParam('pk', value);
						          					gMain.selPanel.MkeItemStore.getProxy().setExtraParam('pk_full', value);
						          					gMain.selPanel.MkeItemStore.load();
					                        	} else if(value == '' || value.length == 0) {
													gMain.selPanel.MkeItemStore.getProxy().setExtraParam('pk', '10LL');
													gMain.selPanel.MkeItemStore.getProxy().setExtraParam('pk_full', '10LL');
						          					gMain.selPanel.MkeItemStore.load();
												}
					                        	
					                        	  
					                          }
									}
						}]},gMain.selPanel.MkeItemGrid]}]
				
			});
			
			var win = Ext.create('ModalWindow', {
				title: '품목정보',
				id: 'win-SRO3',
				width: 1024,
				height: 640,// bHeight+30,
				items: form,
				buttons: [{
					text: CMD_OK,
					handler: function(btn){
						win.close();
					}
				}]
				
			});
			win.show(/* this, function(){} */);

			
		});

		this.addCallback('CHECK_EL_SPEC_TOLERANCE', function(o){
				// var min = gm.me().getInputJust('itemdetail|h_reserved24').getValue();
				var val1 = gm.me().getInputJust('itemdetail|h_reserved102').getValue();
				var val2 = gm.me().getInputJust('itemdetail|h_reserved103').getValue();
			if(val2!=null){
				gm.me().getInputJust('itemdetail|h_reserved27').setValue(val1+' ± '+val2+'%');
			}
		});

		this.addCallback('CHECK_EL_VALUE', function(widget, event){
			var h_reserved27 = gm.me().getInputTarget('h_reserved27').getValue();
			var val_1 = h_reserved27.split('±')[0];
			var val_2 = h_reserved27.split('±')[1].split('%')[0];

			var max_val = Number(val_1) + Number(val_2);
			var min_val = Number(val_1) - Number(val_2);

			var el_max = gm.me().getInputTarget('h_reserved44').getValue();
			var el_min = gm.me().getInputTarget('h_reserved53').getValue();

			var field = gm.me().getInputTarget('h_reserved44');

			// if(max_val < el_max && el_max != null && el_max != '') {
			// 	if(el_max.split('.')[1] != '' || el_max.split('.')[1].length > 0) {
			// 		Ext.Msg.alert("알림", "지정된 E/L(기술) 값 범위에서 벗어났습니다.");
			// 	}
			// }
			// if(min_val > el_min && el_min != null && el_min != '') {
			// 	if(el_min.split('.')[1] != '' || el_min.split('.')[1].length > 0) {
			// 		Ext.Msg.alert("알림", "지정된 E/L(기술) 값 범위에서 벗어났습니다.");
			// 	}
			// }
			
		});



		// MKE 상한값 체크
		this.addCallback('CHECK_MKE_SPEC_MAX', function(o){
			var max = gm.me().getInputJust('itemdetail|h_reserved23').getValue();
			var val1 = gm.me().getInputJust('itemdetail|h_reserved31').getValue();
			var val2 = gm.me().getInputJust('itemdetail|h_reserved34').getValue();

			var h_reserved31 = gm.me().getInputJust('itemdetail|h_reserved31').getValue();
			var h_reserved34 = gm.me().getInputJust('itemdetail|h_reserved34').getValue();


			if(val2!=null){
				gm.me().getInputJust('itemdetail|h_reserved25').setValue(val2+'~'+val1);
			}
			val1='';
			val2='';
		});
		
		// MKE 하한값 체크
		this.addCallback('CHECK_MKE_SPEC_MIN', function(o){
				var min = gm.me().getInputJust('itemdetail|h_reserved24').getValue();
				var val1 = gm.me().getInputJust('itemdetail|h_reserved31').getValue();
				var val2 = gm.me().getInputJust('itemdetail|h_reserved34').getValue();

				var h_reserved31 = gm.me().getInputJust('itemdetail|h_reserved31').getValue();
				var h_reserved34 = gm.me().getInputJust('itemdetail|h_reserved34').getValue();

				if(val1!=null){
					gm.me().getInputJust('itemdetail|h_reserved25').setValue(val2+'~'+val1);
				}

				val1='';
				val2='';	
		});

		this.addCallback('ATTACH_FILE', function(widget, event){
			gm.me().attachFile();
		});

		// 품목/Type 팝업창
		this.addCallback('SRCH_TYPE', function(widget, event){
			var type = gm.me().getInputTarget('sg_code').getValue(); //영업탭 Type
			var qa_type =  gm.me().getInputJust('itemdetail|h_reserved52').getValue();// 품목/Type
			var item_code =  gm.me().getInputJust('partline|item_code').getValue();// 품목번호
			var substr4_itemcode = item_code.substring( 0, 4 );
			var company_code = gm.me().getInputTarget('h_reserved2').getValue(); // 고객코드
			if(qa_type == null || qa_type.length < 1) {
				Ext.Msg.alert("알림", "품목/Type 을 선택해주세요.");
				return;
			}
			switch(qa_type){
				case '품목':
					gMain.selPanel.MkeItemStore.getProxy().setExtraParam('pk', substr4_itemcode);
//					gMain.selPanel.MkeItemStore.getProxy().setExtraParam('pk_full', item_code);
					gMain.selPanel.MkeItemStore.getProxy().setExtraParam('pk_full', substr4_itemcode);
					gMain.selPanel.MkeItemStore.getProxy().setExtraParam('company_code', company_code);
	                gMain.selPanel.MkeItemStore.load(function() {
						gMain.selPanel.MkeItemStore.getProxy().setExtraParam('company_code', null);
					});
	                
					gMain.selPanel.MkeItemGrid =
	    		    	Ext.create('Rfx2.view.grid.MkeItemGrid', {
	    				 border: true,
	    		         resizable: true,
//	    		         collapsible: true,
	    			     width: 1000,
						 height: 490,
	    		         store:  gMain.selPanel.MkeItemStore// ,
	    		         ,listeners : {
	    		        	 'rowdblclick' : function(){ // do something }
	    		        		 var rec = gMain.selPanel.MkeItemGrid.getSelectionModel().getSelection()[0];
					        		
					        		var WD = rec.get('wd_Direction');
					        		var GR = rec.get('ground');
					        		var ST = rec.get('start_Tape');
					        		var finishing = rec.get('finishing');
					        		var et = rec.get('end_Tape');
					        		var print = rec.get('printed');
					        		var dot = rec.get('add_Sticker');
					        		var spool = rec.get('sppk');
					        		var BLMin = rec.get('custbl_min');
					        		var BLMax = rec.get('custbl_max');
					        		var ELMin = rec.get('custel_min');
					        		var ELMax = rec.get('custel_max');
					        		gm.me().getInputJust('itemdetail|h_reserved36').setValue(WD);
					        		gm.me().getInputJust('itemdetail|h_reserved37').setValue(GR);
					        		gm.me().getInputJust('itemdetail|h_reserved38').setValue(ST);
					        		gm.me().getInputJust('itemdetail|h_reserved39').setValue(finishing);
					        		gm.me().getInputJust('itemdetail|h_reserved40').setValue(et);
					        		gm.me().getInputJust('itemdetail|h_reserved41').setValue(print);
					        		gm.me().getInputJust('itemdetail|h_reserved42').setValue(dot);
					        		gm.me().getInputJust('itemdetail|h_reserved43').setValue(spool);
					        		
					        		gm.me().getInputJust('itemdetail|h_reserved54').setValue(BLMin);
					        		gm.me().getInputJust('itemdetail|h_reserved45').setValue(BLMax);
					        		gm.me().getInputJust('itemdetail|h_reserved53').setValue(ELMin);
					        		gm.me().getInputJust('itemdetail|h_reserved44').setValue(ELMax);
					        		win.close();
	    		        	 }
	    		         }
	    			
	    			});	    			
			    	var form = Ext.create('Ext.panel.Panel', {
			            defaultType: 'textfield',
			            border: false,
			            width: 1000,
			            height: 1000,
			            layout:'fit',
			            scroll: true,
						autoScroll: true,
			            defaults: {
			                editable:false,
			                allowBlank: false,
			                msgTarget: 'side',
			                labelWidth: 100
			            },
			             items: [
							 {
								xtype: 'fieldset',
								title: CMD_SEARCH/*'검색'*/,
								boder: true,
								collapsible: true,
								margin: '5',
								width : 1000,
								height : "20%",
								defaults: {
									anchor: '100%',
									layout: {
										type: 'hbox',
										anchor: '70%'
									}
								},
								items :[{
								xtype : 'fieldcontainer',
								layout: 'hbox',
								items: [{
									xtype: 'textfield',
									emptyText: '품목코드',
		//				        			anchor: '100%',
									width: '95%',
									id : 'item_code-SRO3',
									name : 'item_code-SRO3',
									layout:'fit',
									fieldStyle: 'background-color: #FBF8E6; background-image: none;',
										listeners: {
												change: function(field, value) {
														if(value.length>1){
															gMain.selPanel.MkeItemStore.getProxy().setExtraParam('pk', value);
															gMain.selPanel.MkeItemStore.getProxy().setExtraParam('pk_full', value);
															gMain.selPanel.MkeItemStore.load();
														} else if(value == '' || value.length == 0) {
															gMain.selPanel.MkeItemStore.getProxy().setExtraParam('pk', '10LL');
															gMain.selPanel.MkeItemStore.getProxy().setExtraParam('pk_full', '10LL');
															gMain.selPanel.MkeItemStore.load();
														}
														
														
													}
											}
								}]},gMain.selPanel.MkeItemGrid]}]
			            
			        });
			    	
			        var win = Ext.create('ModalWindow', {
			            title: '품목정보',
			            width: 1024,
			            height: 640,// bHeight+30,
			            items: form,
			            buttons: [{
				            text: CMD_OK,
				        	handler: function(btn){
				        		var rec = gMain.selPanel.MkeItemGrid.getSelectionModel().getSelection()[0];
				        		
				        		var WD = rec.get('wd_Direction');
				        		var GR = rec.get('ground');
				        		var ST = rec.get('start_Tape');
				        		var finishing = rec.get('finishing');
				        		var et = rec.get('end_Tape');
				        		var print = rec.get('printed');
				        		var dot = rec.get('add_Sticker');
				        		var spool = rec.get('sppk');
				        		var BLMin = rec.get('custbl_min');
				        		var BLMax = rec.get('custbl_max');
				        		var ELMin = rec.get('custel_min');
				        		var ELMax = rec.get('custel_max');
				        		gm.me().getInputJust('itemdetail|h_reserved36').setValue(WD);
				        		gm.me().getInputJust('itemdetail|h_reserved37').setValue(GR);
				        		gm.me().getInputJust('itemdetail|h_reserved38').setValue(ST);
				        		gm.me().getInputJust('itemdetail|h_reserved39').setValue(finishing);
				        		gm.me().getInputJust('itemdetail|h_reserved40').setValue(et);
				        		gm.me().getInputJust('itemdetail|h_reserved41').setValue(print);
				        		gm.me().getInputJust('itemdetail|h_reserved42').setValue(dot);
				        		gm.me().getInputJust('itemdetail|h_reserved43').setValue(spool);
				        		
				        		gm.me().getInputJust('itemdetail|h_reserved54').setValue(BLMin);
				        		gm.me().getInputJust('itemdetail|h_reserved45').setValue(BLMax);
				        		gm.me().getInputJust('itemdetail|h_reserved53').setValue(ELMin);
				        		gm.me().getInputJust('itemdetail|h_reserved44').setValue(ELMax);
				        		win.close();
				        	}
			            }]
			        	
			        });
			        win.show(/* this, function(){} */);
					break;
				case 'Type':
					var sg_code = gMain.selPanel.vSELECTED_SG_CODE;
					
					switch(sg_code) {
						case 'LL':
							sg_code = 'L';
							break;
						case 'RR':
							sg_code ='R';
							break;
						case 'TT':
							sg_code = 'T';
							break;
						case 'MM':
							sg_code = 'M';
							break;
					}
					
	            	// gMain.selPanel.MkeTypeStore.getProxy().setExtraParam('identification_code', 'WL_RULE');
	    			// gMain.selPanel.MkeTypeStore.getProxy().setExtraParam('class_type',sg_code);
					// gMain.selPanel.MkeTypeStore.load();
					console_logs('>>>>sg_ca', sg_code);
					var MkeTypeStore = Ext.create('Mplm.store.ClaastStore', {identification_code:'WL_RULE', class_type:sg_code});
					
					// MkeTypeStore.getProxy().setExtraParam('identification_code', 'WL_RULE');
	    			// MkeTypeStore.getProxy().setExtraParam('class_type',sg_code);
					MkeTypeStore.load();
					
					
					
							 gMain.selPanel.MkeTypeGrid =
				    		    	Ext.create('Rfx2.view.grid.MkeTypeGrid', {
				    		    	 // id:'DBM7-Mtrl',
				    				 // title: '발주주기',// cloud_product_class,
				    				 border: true,
				    		         resizable: true,
//				    		         collapsible: true,
				    			     height: "100%",
				    		         store: MkeTypeStore// ,
				    		         // recvDateStore:
										// Ext.create('Mplm.store.RecvDateStore',
										// {params:gMain.selPanel.buyerUid}),
				    		         // layout :'fit',
				    		         // forceFit: true,
				    		         ,listeners : {
				    		        	 'rowdblclick' : function(){ // do something }
				    		        		 var rec = gMain.selPanel.MkeTypeGrid.getSelectionModel().getSelection()[0];
								        		
								        		var BLMin = rec.get('reserved_double2');
								        		var BLMax = rec.get('reserved_varchar3');
								        		var ELMin = rec.get('reserved_double4');
								        		var ELMax = rec.get('reserved_double5'); 
								        		gm.me().getInputJust('itemdetail|h_reserved54').setValue(BLMin);
								        		gm.me().getInputJust('itemdetail|h_reserved45').setValue(BLMax);
								        		gm.me().getInputJust('itemdetail|h_reserved53').setValue(ELMin);
								        		gm.me().getInputJust('itemdetail|h_reserved44').setValue(ELMax);
								        		win.close();
				    		        	 }
				    		         }
				    				
				    			
				    			});	    			
						    	var form = Ext.create('Ext.panel.Panel', {
						    		// id: 'modformPanel-DBM7',
						            defaultType: 'textfield',
						            border: false,
						            // bodyPadding: 15,
						            width: 720,
						            height: 550,
						            layout:'fit',
						            // margins: '0 0 10 0',
						            scroll: true,
									autoScroll: true,
						            defaults: {
						                // anchor: '100%',
						                editable:false,
						                allowBlank: false,
						                msgTarget: 'side',
						                labelWidth: 100
						            },
						             items: [gMain.selPanel.MkeTypeGrid]
						        });
						    	
						        var win = Ext.create('ModalWindow', {
						            title: 'Type정보',
						            width: 720,
						            height: 640,// bHeight+30,
						            items: form,
						            buttons: [{
							            text: CMD_OK,
							        	handler: function(btn){
							        		var rec = gMain.selPanel.MkeTypeGrid.getSelectionModel().getSelection()[0];
							        		
							        		var BLMin = rec.get('reserved_double2');
							        		var BLMax = rec.get('reserved_double3');
							        		var ELMin = rec.get('reserved_double4');
							        		var ELMax = rec.get('reserved_double5'); 
							        		gm.me().getInputJust('itemdetail|h_reserved54').setValue(BLMin);
							        		gm.me().getInputJust('itemdetail|h_reserved45').setValue(BLMax);
							        		gm.me().getInputJust('itemdetail|h_reserved53').setValue(ELMin);
							        		gm.me().getInputJust('itemdetail|h_reserved44').setValue(ELMax);
							        		
							        		win.close();
							        	}
						            }],
							        		
						        });
						        win.show(/* this, function(){} */);
					
					break;
			
			}
			
		});
		
		this.addCallback('CHECK_COMMENT', function(o){
			var value = o.value;
			var rows = value.split('\n').length;
			if(rows > 5) {
				Ext.Msg.alert('안내', '5줄까지만 가능합니다.', function() {});
				return;
			}
		});
		
		// 검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		// 명령툴바 생성
		var buttonToolbar = this.createCommandToolbar();
		
		this.store = Ext.create('Mplm.store.RecevedAddIDStore');
		if(vCUR_USER_UID > 1) {
			this.store.getProxy().setExtraParam('usrast_unique_id', vCUR_USER_UID);
		}

		// Ext.each(this.columns, function(columnObj, index) {
		// 	var dataIndex = columnObj['dataIndex'];
		// 	switch(dataIndex) {
		// 		case 'reserved26':
		// 			columnObj.dataType = 'number';
		// 			break;
		// 	}
		// });

        // this.createStore('Rfx.model.RecevedAddIDMgmt', [{
        //     property: 'unique_id',
        //     direction: 'DESC'
        // }],
        // gMain.pageSize/* pageSize */
        // // order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
    	// // Orderby list key change
    	// // ordery create_date -> p.create로 변경.
        // ,{
        // 	creator: 'project.creator',
        // 	unique_id: 'project.unique_id'
        // }
    	// // 삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
    	// , ['project']
		// );



        // 그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        
        (buttonToolbar.items).each(function(item,index,length){
	      	  if(index==1||index==3||index==5) {
	            	buttonToolbar.items.remove(item);
	      	  }
	        });
        
        this.setRowClass(function(record, index) {
        	
//            var c = record.get('status');
//            var is_stop_flag = record.get('reserved20');
//            switch(c) {
//                case 'CR':
//                	return 'yellow-row';
//                	break;
//                case 'P':
//                	return 'orange-row';
//                	break;
//                case 'DE':
//                case 'S':
//                	return 'red-row';
//                	break;
//                case 'BM':
//                	break;
//                default:
//                	if(is_stop_flag=='Y'){
//                		return 'red-row';
//                	}else{
//                		return 'green-row';
//                	}
//            }

		});
		
        
        //생산요청
        this.qualAccAction = Ext.create('Ext.Action', {
  			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
  			 text: '품질승인',
			 tooltip: '생산요청하기',
			 hidden: gMain.menu_check == true ? false : true,
  			 disabled: true,
  			 handler: function(widget, event) {
// 				modify_status = 결재 없는 화면은 강제로 넣어줌
					//status type ALL_DNY(전체반려) DNY(전단계 반려) APPR(결제승인)
					gm.me().grid.setLoading(true);
    				Ext.Ajax.request({
    					url: CONTEXT_PATH + '/production/schdule.do?method=updateMkeStatus',
    					params:{
    						status: 'QA',
    						assymap_uid :gMain.selPanel.vSELECTED_ASSYMAP_UID,
    						status_type : 'REQ',
							reserved1 : gMain.selPanel.vSELECTED_RESERVED1,
							
							customer : gMain.selPanel.vSELECTED_CUSTOMER,
							pm_name: gMain.selPanel.vSELECTED_PM_NAME,
							so_type: gMain.selPanel.vSELECTED_SO_TYPE,
							type: gMain.selPanel.vSELECTED_SG_CODE,
							target_um: gMain.selPanel.vSELECTED_TARGET_UM,
							target_mil: gMain.selPanel.vSELECTED_TARGET_MIL,
							reserved26:gMain.selPanel.vSELECTED_RESERVED26,

							area_type : gMain.selPanel.vSELECTED_H_RESERVED119,
							act_type : gMain.selPanel.vSELECTED_H_RESERVED120,
							class_code : gMain.selPanel.vSELECTED_RESERVED3,
						
							h_reserved15 : gMain.selPanel.vSELECTED_H_RESERVED15,
							unit_code : gMain.selPanel.vSELECTED_UNIT_CODE,
							h_reserved10 : gMain.selPanel.vSELECTED_H_RESERVED10,
							h_reserved20 : gMain.selPanel.vSELECTED_H_RESERVED20,

						},
    					
    					success : function(result, request) { 
							gm.me().store.getProxy().setExtraParam('status', 'QA');
							gm.me().store.getProxy().setExtraParam('usrast_unique_id', vCUR_USER_UID);
							gm.me().grid.setLoading(false);
  						 gm.me().store.load(function(records) {});	
    						Ext.Msg.alert('안내', '결재 요청하였습니다.', function() {});
    						
    					},// endofsuccess
    					failure: function() {
							Ext.Msg.alert('안내','결재 요청 실패', function() {});
							gm.me().grid.setLoading(false);
						  }
    				});// endofajax

  	    		 }
  		});    
        
        //반려요청
        this.cancleAction = Ext.create('Ext.Action', {
  			 iconCls: 'af-reject',
  			 text: '반려',
			 tooltip: '반려하기',
			 hidden: gMain.menu_check == true ? false : true,
  			 disabled: true,
  			 handler: function(widget, event) {
//  				modify_status = 결재 없는 화면은 강제로 넣어줌
				 //status type ALL_DNY(전체반려) DNY(전단계 반려) APPR(결제승인)
				 
				 var form = Ext.create('Ext.form.Panel', {
					id: 'formReasonQa',
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
						{
							xtype: 'textfield',
							id: 'reasonQa',
							name: 'reasonQa',
							fieldLabel: '반려사유',
							allowBlank:true,
							anchor: '-5',
							// fieldStyle : 'background-color: #ddd; background-image: none;'
						}
					]
				});

				var me = this;

				var win = Ext.create('ModalWindow', {
					title: '반려 요청',
					width: 400,
					height: 250,
					minWidth: 250,
					minHeight: 180,
					items: form,
					buttons: [{
						text: CMD_OK,
						handler: function(){
							//start
							var reason = Ext.getCmp('reasonQa').getValue();
							Ext.MessageBox.show({
								title:'확인',
								msg: '반려 하시겠습니까?',
								buttons: Ext.MessageBox.YESNO,
								fn:  function(result) {
									if(result=='yes') {
										Ext.Ajax.request({
											url: CONTEXT_PATH + '/production/schdule.do?method=updateMkeStatus',
											params:{
												status: 'QA',
												assymap_uid :gMain.selPanel.vSELECTED_ASSYMAP_UID,
											   	status_type : 'DNY',
											   	reserved1 : gMain.selPanel.vSELECTED_RESERVED1,
												h_reserved9 : gMain.selPanel.vSELECTED_H_RESERVED9,
												status_kr : gMain.selPanel.vSELECTED_STATUS_KR,
												customer : gMain.selPanel.vSELECTED_CUSTOMER,
												item_code : gMain.selPanel.vSELECTED_ITEM_CODE,

												pm_name: gMain.selPanel.vSELECTED_PM_NAME,
												so_type: gMain.selPanel.vSELECTED_SO_TYPE,
												type: gMain.selPanel.vSELECTED_SG_CODE,
												target_um: gMain.selPanel.vSELECTED_TARGET_UM,
												target_mil: gMain.selPanel.vSELECTED_TARGET_MIL,
												reserved26 : gMain.selPanel.vSELECTED_RESERVED26,

												area_type : gMain.selPanel.vSELECTED_H_RESERVED119,
												act_type : gMain.selPanel.vSELECTED_H_RESERVED120,
												class_code : gMain.selPanel.vSELECTED_RESERVED3,
												
												h_reserved15 : gMain.selPanel.vSELECTED_H_RESERVED15,
												unit_code : gMain.selPanel.vSELECTED_UNIT_CODE,
												h_reserved10 : gMain.selPanel.vSELECTED_H_RESERVED10,
												h_reserved20 : gMain.selPanel.vSELECTED_H_RESERVED20,
												
												reason:reason
											},
											
											success : function(result, request) { 
												  gm.me().store.getProxy().setExtraParam('status', 'QA');
												  gm.me().store.load(function(records) {});	
												Ext.Msg.alert('안내', '결재 요청하였습니다.', function() {});
												
											},// endofsuccess
											failure: extjsUtil.failureMessage
										});// endofajax
									}
								},
								//animateTarget: 'mb4',
								icon: Ext.MessageBox.QUESTION
							});
						   //end
							win.close();
		//		      		});
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
				win.show(/* this, function(){} */);
  			 }
		  });    
		  
		  //전체반려요청
		  this.allcancleAction = Ext.create('Ext.Action', {
			iconCls: 'af-reject',
			text: '전체반려',
			tooltip: '반려하기',
			disabled: true,
			handler: function(widget, event) {
// 				modify_status = 결재 없는 화면은 강제로 넣어줌
				//status type ALL_DNY(전체반려) DNY(전단계 반려) APPR(결제승인)
				
				var form = Ext.create('Ext.form.Panel', {
				 id: 'formReasonAll',
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
					 {
						 xtype: 'textfield',
						 id: 'reasonAll',
						 name: 'reasonAll',
						 fieldLabel: '반려사유',
						 allowBlank:true,
						 anchor: '-5',
						 // fieldStyle : 'background-color: #ddd; background-image: none;'
					 }
				 ]
			 });

			 var me = this;

			 var win = Ext.create('ModalWindow', {
				 title: '반려 요청',
				 width: 400,
				 height: 250,
				 minWidth: 250,
				 minHeight: 180,
				 items: form,
				 buttons: [{
					 text: CMD_OK,
					 handler: function(){
						 //start
						 var reason = Ext.getCmp('reasonAll').getValue();
						 Ext.MessageBox.show({
							 title:'확인',
							 msg: '반려 하시겠습니까?',
							 buttons: Ext.MessageBox.YESNO,
							 fn:  function(result) {
								 if(result=='yes') {
									 Ext.Ajax.request({
										 url: CONTEXT_PATH + '/production/schdule.do?method=updateMkeStatus',
										 params:{
											 status: gMain.selPanel.vSELECTED_STATUS,
											 assymap_uid :gMain.selPanel.vSELECTED_ASSYMAP_UID,
											 status_type : 'ALL_DNY',
											 modify_status : 'SO',
											 reason:reason
										 },
										 
										 success : function(result, request) { 
											 gm.me().store.getProxy().setExtraParam('usrast_unique_id', vCUR_USER_UID );
											  gm.me().store.load(function(records) {});
											 Ext.Msg.alert('안내', '반려 요청하였습니다.', function() {});
											 
										 },// endofsuccess
										 failure: extjsUtil.failureMessage
									 });// endofajax
								 }
							 },
							 //animateTarget: 'mb4',
							 icon: Ext.MessageBox.QUESTION
						 });
						//end
						 win.close();
	 //		      		});
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
			 win.show(/* this, function(){} */);
		 }
	   });   
	 
	    buttonToolbar.insert(3, this.allcancleAction);
        buttonToolbar.insert(4, this.cancleAction);
		buttonToolbar.insert(5, this.qualAccAction);
        
        this.createGrid(arr);
        
        
        // 작업지시 Action 생성
        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
			if(this.crudMode=='EDIT' || this.crudMode=='COPY') { // EDIT
				if(selections != null && selections.length > 0) {
					var select = selections[0];
					var nation = select.get('egci_code');
					var SO_TYPE = select.get('class_code');
					BACK_SO_TYPE = SO_TYPE;
					var PRD_TYPE = select.get('prd_code');
					Ext.getCmp('nation_QA').setValue(nation);
					Ext.getCmp('SO_TYPE_QA').setValue(SO_TYPE);
					Ext.getCmp('PRD_TYPE_QA').setValue(PRD_TYPE);

					var soTypeStore = Ext.getCmp('SO_TYPE_QA');
					soTypeStore.store.getProxy().setExtraParam('egci_code', nation);

					var prdStore = Ext.getCmp('PRD_TYPE_QA');
							
					var class_code = SO_TYPE;
					var iqa = class_code.substr(0,3);
					if(iqa != null && iqa == 'IQA') {
						class_code = class_code.substr(4,5);
					} else {
						class_code = class_code.substr(0,2);
					}
					
					prdStore.store.getProxy().setExtraParam('identification_code', 'PRD_TYPE');
					prdStore.store.getProxy().setExtraParam('parent_class_code', class_code);
					prdStore.store.getProxy().setExtraParam('class_type', select.get('reserved1'));
					
					prdStore.store.load();
				}
	    	} else {
	    		this.copyCallback();
	    	}
        	
            if (selections.length) {
            	var rec = selections[0];
            	
            	gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('unique_uid'); // assymap의 unique_id
            	gMain.selPanel.vSELECTED_SG_CODE = rec.get('sg_code');
            	gMain.selPanel.vSELECTED_ASSYMAP_UID = rec.get('assymap_uid');
            	gMain.selPanel.vSELECTED_RESERVED1 = rec.get('reserved1');
				gMain.selPanel.vSELECTED_STATUS = rec.get('status');
				gMain.selPanel.vSELECTED_CUSTOMER = rec.get('wa_name'); // 고객사
				gMain.selPanel.vSELECTED_ITEM_CODE = rec.get('item_code'); // 품목코드

				gMain.selPanel.vSELECTED_PM_NAME = rec.get('pm_name'); // 요청자
				gMain.selPanel.vSELECTED_SO_TYPE = rec.get('reserved3'); // so_type
				gMain.selPanel.vSELECTED_SG_CODE = rec.get('sg_code'); // type

				gMain.selPanel.vSELECTED_TARGET_UM = rec.get('h_reserved11'); // target size um
				gMain.selPanel.vSELECTED_TARGET_MIL = rec.get('h_reserved12'); // target size mil
				gMain.selPanel.vSELECTED_RESERVED26 = rec.get('reserved26'); // 순번

				gMain.selPanel.vSELECTED_RESERVED3 = rec.get('reserved3'); // so_type
				gMain.selPanel.vSELECTED_H_RESERVED119 = rec.get('h_reserved119'); // 국가
				gMain.selPanel.vSELECTED_H_RESERVED120 = rec.get('h_reserved120'); // 개발|양산

				gMain.selPanel.vSELECTED_H_RESERVED15 = rec.get('h_reserved15'); // 요청수량
				gMain.selPanel.vSELECTED_UNIT_CODE = rec.get('unit_code'); // 단위
				gMain.selPanel.vSELECTED_H_RESERVED10 = rec.get('h_reserved10'); // 사용목적
				gMain.selPanel.vSELECTED_H_RESERVED20 = rec.get('h_reserved20'); // 영업비고
				
            	this.cancleAction.enable(); 
				this.qualAccAction.enable();
				
				this.allcancleAction.enable();
            	
            }else{
				this.allcancleAction.disable();
            	this.cancleAction.disable(); 
            	this.qualAccAction.disable();
            }
        });
        

        
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
        

        this.callParent(arguments);
        

        // 디폴트 로딩
        gMain.setCenterLoading(false);// 스토아로딩에서는 Loading Message를 끈다.
        this.store.getProxy().setExtraParam('status', 'QA');
        this.store.load(function(records) {
			gm.me().setActiveCrudPanel('EDIT');
            gm.me().crudTab.collapse();
		});	
//        this.store.on('load',function (store, records, successful, eOpts ){
//       });
        
		this.store.remoteSort=true;
	},
	
	attachFile: function() {
		var record = gm.me().grid.getSelectionModel().getSelection()[0];

		var assymap_uid = 100;
		var item_code = null;

		try {
			item_code = gm.me().getInputJust('partline|item_code').getValue();
		} catch (error) {
			item_code = null;
		}

		if(record != null) {
			assymap_uid = record.get('assymap_uid');
		} else {
			assymap_uid = 100;
			// item_code = gm.me().getInputJust('partline|item_code').getValue();
			if(item_code == null || item_code == undefined || item_code.length < 1) {
				Ext.Msg.alert('안내', '품목코드를 먼저 설정해주세요.', function() {});
				return;
			}
		}
		this.attachedFileStore.getProxy().setExtraParam('group_code', assymap_uid);
		this.attachedFileStore.getProxy().setExtraParam('item_code', item_code);
		// this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('top_srcahd_uid'));
		this.attachedFileStore.load(function(records) {
			if(records!=null) {
				var o = gu.getCmp('file_quan');
				if (o != null) {
					o.update( '총수량 : ' + records.length);
				}
			}
		});

		var selFilegrid =   Ext.create("Ext.selection.CheckboxModel", {} );
		this.fileGrid = Ext.create('Ext.grid.Panel', {
			title: '첨부',
			store: this.attachedFileStore,
			collapsible: true,
			multiSelect: true,
			// hidden : ! this.useDocument,
			// selModel: selFilegrid,
			stateId: 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
			dockedItems: [{
				dock: 'top',
				xtype: 'toolbar',
				cls: 'my-x-toolbar-default2',
				items: [
					{
						xtype : 'button',
						text : '파일 첨부',
						scale: 'small',
						glyph: 'xf0c6@FontAwesome',
						scope : this.fileGrid,
						handler : function() {

							console_logs('=====aaa', record);
							var url =  CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + assymap_uid + '&file_itemcode=' + item_code;
							// var url =  CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + record.get('top_srcahd_uid');

							var uploadPanel = Ext.create('Ext.ux.upload.Panel', {
								uploader : 'Ext.ux.upload.uploader.FormDataUploader',
								uploaderOptions : {
									url : url
								},
								synchronous : true
							});
								var uploadDialog = Ext.create('Ext.ux.upload.Dialog', {
									dialogTitle : '파일 첨부',
									panel : uploadPanel
								});

								this.mon(uploadDialog, 'uploadcomplete', function(uploadPanel, manager, items, errorCount) {
									
									console_logs('this.mon uploadcomplete uploadPanel', uploadPanel);
									console_logs('this.mon uploadcomplete manager', manager);
									console_logs('this.mon uploadcomplete items', items);
									console_logs('this.mon uploadcomplete errorCount', errorCount);
									
									gm.me().uploadComplete(items);
									//if (!errorCount) {
										uploadDialog.close();
									//}
								}, this);

								uploadDialog.show();
							}
						},
						this.removeActionFile, 
						'-',
						this.sendFileAction,
						'->',
						{
							xtype: 'component',
							id: gu.id('file_quan'),
							style: 'margin-right:5px;width:100px;text-align:right',
							html: '총수량 : 0'
						}
					]
				}

			],
			columns: [
				{
					text     : 'UID',
					width     : 100,
					sortable : true,
					dataIndex: 'id'
				},
				{
					text     : '파일명',
					flex     : 1,
					sortable : true,
					dataIndex: 'object_name'
				},
				{
					text     : '파일유형',
					width     : 70,
					sortable : true,
					dataIndex: 'file_ext'
				},
				{
					text     : '날짜',
					width     : 160,
					sortable : true,
					dataIndex: 'create_date'
				},
				{
					text     : 'size',
					width     : 100,
					sortable : true,
					xtype: 'numbercolumn',
					format: '0,000',
					style: 'text-align:right',
					align: 'right',
					dataIndex: 'file_size'
				}]
		});

		var win = Ext.create('ModalWindow', {
			title: CMD_VIEW + '::' + /*(G)*/' 첨부파일',
			width: 1300,
			height: 600,
			minWidth: 250,
			minHeight: 180,
			autoScroll: true,
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			xtype:'container',
			plain: true,
			items: [
				this.fileGrid
			],
			buttons: [{
				text: CMD_OK,
				handler: function() {
					if(win) {win.close();}
				}
			}]
		});
		win.show();
	},

	attachedFileStore : Ext.create('Mplm.store.AttachedFileStore', {group_code: null} ),

	uploadComplete : function(items) {
		
		console_logs('uploadComplete items', items);
		
		var output = 'Uploaded files: <br>';
		Ext.Array.each(items, function(item) {
			output += item.getFilename() + ' (' + item.getType() + ', '
				+ Ext.util.Format.fileSize(item.getSize()) + ')' + '<br>';
		});
		
		console_logs('파일업로드 결과', output);
		
		this.attachedFileStore.load(function(records) {
			if(records!=null) {
				var o = gu.getCmp('file_quan');
				if (o != null) {
					o.update( '총수량 : ' + records.length);
				}
				
			}
		});
	},

    // MkeTypeStore: Ext.create('Mplm.store.ClaastStore', {identification_code:'WL_RULE'}),
    MkeItemStore: Ext.create('Mplm.store.InterfaceSpecStore', {}),
    item_code_first:'',
});
