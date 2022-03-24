//수주관리 메뉴
Ext.define('Rfx2.view.company.mke.salesDelivery.RecvPoTechView', {
	extend: 'Rfx2.base.BaseView',
    xtype: 'receved-mgmt-tech-view',
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
    	
//    	this.addFormWidget('기술', {
//	     	   tabTitle:'기술', 
//	     	   	id:	'TECH_TYPE',
//	            xtype: 'combo',
//	            text: 'TECH_TYPE',
//	            name: 'TECH_TYPE',
//	            storeClass: 'ClaastStore',
//	            params:{identification_code: "TECH_TYPE"},
//	            displayField: "class_code",
//	            valueField: "class_name", 
//	            innerTpl: "<div>[{class_code}] {class_name}</div>", 
//	            listeners: {
//			           select: function (combo, record) {
////			        	   gm.me().getInputTarget('sg_code').setValue(record.get('class_name'));
//			        	   
//			        	   switch(record.get('class_name')){
//			        	   		case 'Au':
//			        	   		case 'Ag':
//			        	   			var type = gm.me().getInputTarget('sg_code').getValue();
//			        	   			
//			        	   			var first_code = type.substring( 0, 1 );
//			        	   			var second_code = type.substring( 2, 1 );
//			        	   			if(first_code==second_code){
//			        	   				gm.me().getInputTarget('h_reserved21').setValue(first_code);
//				        	   			gm.me().getInputTarget('reserved1').setValue(record.get('class_name'));
//			        	   			}else{
//			        	   				gm.me().getInputTarget('h_reserved21').setValue(type);
//				        	   			gm.me().getInputTarget('reserved1').setValue(record.get('class_name'));
//			        	   			}
//			        	   			
//			        	   			break;
//			        	   		default:
//			        	   			gm.me().getInputTarget('h_reserved21').setValue('');
//			        	   			gm.me().getInputTarget('reserved1').setValue(record.get('class_name'));
//			        	   			
//			        	   }
//			        	   
//			           }
//		        },
//	            canCreate:   true,
//	            canEdit:     true,
//	            canView:     true,
//	            position: 'top',
//	            tableName: '',
//	            code_order:	15
//	        }); 
    	
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
		
		this.addCallback('CHECK_CHANGE_VALUE', function(o) {
				var unit = gm.me().getInputJust('itemdetail|h_reserved14').getValue(); // 단위
				var val1 = gm.me().getInputJust('itemdetail|h_reserved24').getValue(); // 하한
				var val2 = gm.me().getInputJust('itemdetail|h_reserved23').getValue(); // 상한

				unit = unit.toLowerCase();
				if(val1!=null){
					gm.me().getInputJust('itemdetail|h_reserved22').setValue(val1 + unit + '~' + val2 + unit);
				}
		});


		this.addCallback('GET_EL_SPEC_TARGET', function(o) {
				var val1 = gm.me().getInputJust('itemdetail|h_reserved102').getValue();
				var val2 = gm.me().getInputJust('itemdetail|h_reserved103').getValue();
				if(val1!=null){
					gm.me().getInputJust('itemdetail|h_reserved27').setValue(val1+' ± '+val2+'%');
				}
		});

		this.addCallback('CHECK_EL_SPEC_TARGET', function(widget, event){
				var val1 = gm.me().getInputJust('itemdetail|h_reserved102').getValue();
				var val2 = gm.me().getInputJust('itemdetail|h_reserved103').getValue();
			if(val1!=null && val1!='' && val1.length > 0){
				gm.me().getInputJust('itemdetail|h_reserved27').setValue(val1+' ± '+val2+'%');
			}

			var type = gm.me().getInputTarget('sg_code').getValue(); //영업탭 Type
			var qa_type =  gm.me().getInputTarget('srch_value').getValue();// 품목/Type
			var item_code =  gm.me().getInputJust('partline|item_code').getValue();// 품목번호
			var substr4_itemcode = item_code.substring( 0, 4 );

			gMain.selPanel.MkeItemStore.getProxy().setExtraParam('pk', substr4_itemcode);
			gMain.selPanel.MkeItemStore.getProxy().setExtraParam('pk_full', substr4_itemcode);
			gMain.selPanel.MkeItemStore.load();
			
			gMain.selPanel.MkeItemGrid =
				Ext.create('Rfx2.view.grid.MkeItemGridTc', {
					id:'MkeItemGridTc-SRO2',
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
				id:'form-SRO2',
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
							id : 'item_code-SRO2',
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
				id: 'win-SRO22',
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

		this.addCallback('ATTACH_FILE', function(widget, event){
			gm.me().attachFile();
		});

		this.addCallback('CHECK_EL_SPEC_TOLERANCE', function(o){
				// var min = gm.me().getInputJust('itemdetail|h_reserved24').getValue();
				var val1 = gm.me().getInputJust('itemdetail|h_reserved102').getValue();
				var val2 = gm.me().getInputJust('itemdetail|h_reserved103').getValue();
			if(val2!=null){
				gm.me().getInputJust('itemdetail|h_reserved27').setValue(val1+' ± '+val2+'%');
			}
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
		
		// EL(%)h_reserved27 하한값 이벤트 h_reserved100 
		this.addCallback('CHECK_EL_MIN', function(o){
			//계산식 (상한+하한/2)+-(상한값-(상한+하한/2))
				var val1 = gm.me().getInputJust('itemdetail|h_reserved100').getValue();
				var val2 = gm.me().getInputJust('itemdetail|h_reserved101').getValue();
				if(val1!=null&&val2!=null){
					var calc = ((Number(val1)+Number(val2))/2)+" ± "+(Number(val2)-((Number(val1)+Number(val2))/2)).toFixed(1)+"%";
					gm.me().getInputJust('itemdetail|h_reserved27').setValue(calc);
				}
				val1='';
				val2='';	
		});
		
		// EL(%)h_reserved27 상한값 이벤트 h_reserved101
		this.addCallback('CHECK_EL_MAX', function(o){

				var val1 = gm.me().getInputJust('itemdetail|h_reserved100').getValue();
				var val2 = gm.me().getInputJust('itemdetail|h_reserved101').getValue();
				
				if(val1!=null&&val2!=null){
					var calc = ((Number(val1)+Number(val2))/2)+" ± "+(Number(val2)-((Number(val1)+Number(val2))/2)).toFixed(1)+"%";
					gm.me().getInputJust('itemdetail|h_reserved27').setValue(calc);
				}
				val1='';
				val2='';
			
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
		
		
		// 기준정보 3에서 데이터 가져오기
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

		this.addCallback('CHECK_COMMENT', function(o){
			var value = o.value;
			var rows = value.split('\n').length;
			if(rows > 6) {
				Ext.Msg.alert('안내', '6줄까지만 가능합니다.', function() {});
				return;
			}
		});
		
		// this.addFormWidget('기술', {
	    //  	   tabTitle:"기술", 
	    //  	   	id:	'TYPE2',
	    //         xtype: 'combo',
	    //         text: '품목/Type 선택',
	    //         name: '품목/Type 선택',
	    //         storeClass: 'ClaastStore',
	    //         params:{identification_code: "QA_TYPE"},
	    //         displayField: "class_name",
	    //         valueField: "class_code", 
	    //         innerTpl: "<div>{class_name}</div>", 
	    //         listeners: {
		// 	           select: function (combo, record) {
		// 	        	   gm.me().getInputTarget('srch_value').setValue(record.get('class_name'));
		// 	           }
		//         },
	    //         canCreate:   true,
	    //         canEdit:     true,
	    //         canView:     true,
	    //         position: 'top',
	    //         tableName: '',
	    //         code_order:	15
	    //     }); 
		
		// 품목/Type 팝업창
// 		this.addCallback('SRCH_TYPE', function(widget, event){
// 			var type = gm.me().getInputTarget('sg_code').getValue(); //영업탭 Type
// 			var qa_type =  gm.me().getInputTarget('srch_value').getValue();// 품목/Type
// 			var item_code =  gm.me().getInputJust('partline|item_code').getValue();// 품목번호
// 			var substr4_itemcode = item_code.substring( 0, 4 );
// 			switch(qa_type){
// 				case '품목':
// 					gMain.selPanel.MkeItemStore.getProxy().setExtraParam('pk', substr4_itemcode);
// 					gMain.selPanel.MkeItemStore.getProxy().setExtraParam('pk_full', substr4_itemcode);
// 					gMain.selPanel.MkeItemStore.load();
	                
// 					gMain.selPanel.MkeItemGrid =
// 	    		    	Ext.create('Rfx2.view.grid.MkeItemGrid', {
// 	    		    	 id:'MkeItemGrid-SRO2',
// 	    		    	 border: true,
// 	    		         resizable: true,
// //	    		         collapsible: true,
// 	    		         width: 1000,
// 				         height: 490,
// 	    		         store:  gMain.selPanel.MkeItemStore,
// 	    		         listeners : {
// 	    		        	 'rowdblclick' : function(){ // do something }
// 					        		win.close();
// 	    		        	 }
// 	    		         }
	    			
// 	    			});	    			
// 			    	var form = Ext.create('Ext.panel.Panel', {
// 			            defaultType: 'textfield',
// 			            id:'form-SRO2',
// 			            border: false,
// 			            width: 1020,
// 			            height: 570,
// 			            layout:'fit',
// 			            scroll: true,
// 						autoScroll: true,
// 			            defaults: {
// 			                editable:false,
// 			                allowBlank: false,
// 			                msgTarget: 'side',
// 			                labelWidth: 100
// 			            },
// 			             items: [{
// 			        			xtype: 'fieldset',
// 			        			title: CMD_SEARCH/*'검색'*/,
// 			        			boder: true,
// 			        			collapsible: true,
// 			        			margin: '5',
// 			        			width : 1000,
// 			        			height : 550,
// 			        			defaults: {
// 			        				anchor: '100%',
// 			        				layout: {
// 			        					type: 'hbox',
// 			        					anchor: '70%'
// 			        				}
// 			        			},
// 			        			items :[{
// 				        		xtype : 'fieldcontainer',
// 				        		layout: 'hbox',
// 				        		items: [{
// 				        			xtype: 'textfield',
// 				        			emptyText: '품목코드',
// //				        			anchor: '100%',
// 				        			width: '95%',
// 				        			id : 'item_code-SRO2',
// 				        			name : 'item_code',
// 				        			fieldStyle: 'background-color: #FBF8E6; background-image: none;',
// 				        				listeners: {
// 					                          change: function(field, value) {
// 					                        	if(value.length>3){
// 					                        		gMain.selPanel.MkeItemStore.getProxy().setExtraParam('pk', value);
// 						          					gMain.selPanel.MkeItemStore.getProxy().setExtraParam('pk_full', value);
// 						          					gMain.selPanel.MkeItemStore.load();
// 					                        	}  
// 					                          }
// 					                      }
// 				        		}]},gMain.selPanel.MkeItemGrid]}]
			            
// 			        });
			    	
// 			        var win = Ext.create('ModalWindow', {
// 			            title: '품목정보',
// 			            id: 'win-SRO22',
// 			            width: 1024,
// 			            height: 640,// bHeight+30,
// 			            items: form,
// 			            buttons: [{
// 				            text: CMD_OK,
// 				        	handler: function(btn){
// 				        		win.close();
// 				        	}
// 			            }]
			        	
// 			        });
// 			        win.show(/* this, function(){} */);
// 					break;
// 				case 'Type':
// 	            	gMain.selPanel.MkeTypeStore.getProxy().setExtraParam('identification_code', 'WL_RULE');
// 	    			gMain.selPanel.MkeTypeStore.getProxy().setExtraParam('class_type',gMain.selPanel.vSELECTED_SG_CODE);
// 	                gMain.selPanel.MkeTypeStore.load();
					
// 							 gMain.selPanel.MkeTypeGrid =
// 				    		    	Ext.create('Rfx2.view.grid.MkeTypeGrid', {
// 				    		    	  id:'MkeTypeGrid-SRO2',
// 				    				 // title: '발주주기',// cloud_product_class,
// 				    				 border: true,
// 				    		         resizable: true,
// //				    		         collapsible: true,
// 				    		         width: 700,
// 				    			     height: 490,
// 				    		         store:  gMain.selPanel.MkeTypeStore// ,
// 				    		         // recvDateStore:
// 										// Ext.create('Mplm.store.RecvDateStore',
// 										// {params:gMain.selPanel.buyerUid}),
// 				    		         // layout :'fit',
// 				    		         // forceFit: true,
// 				    		         ,listeners : {
// 				    		        	 'rowdblclick' : function(){ // do something }
// 								        		win.close();
// 				    		        	 }
// 				    		         }
				    				
				    			
// 				    			});	    			
// 						    	var form = Ext.create('Ext.panel.Panel', {
// 						    		 id: 'form-SRO22',
// 						            defaultType: 'textfield',
// 						            border: false,
// 						            // bodyPadding: 15,
// 						            width: 720,
// 						            height: 620,
// 						            layout:'fit',
// 						            // margins: '0 0 10 0',
// 						            scroll: true,
// 									autoScroll: true,
// 						            defaults: {
// 						                // anchor: '100%',
// 						                editable:false,
// 						                allowBlank: false,
// 						                msgTarget: 'side',
// 						                labelWidth: 100
// 						            },
// 						             items: [{
// 						        			xtype: 'fieldset',
// 						        			title: CMD_SEARCH/*'검색'*/,
// 						        			boder: true,
// //						        			collapsible: true,
// 						        			margin: '5',
// 						        			width : 700,
// 						        			height : 560,
// 						        			defaults: {
// 						        				anchor: '100%',
// 						        				layout: {
// 						        					type: 'hbox',
// 						        					anchor: '70%'
// 						        				}
// 						        			},
// 						        			items :[{
// 							        		xtype : 'fieldcontainer',
// 							        		layout: 'hbox',
// 							        		items: [{
// 							        			xtype: 'textfield',
// 							        			emptyText: 'Type',
// 							        			anchor: '100%',
// 							        			width: '95%',
// 							        			id : 'type-SRO2',
// 							        			name : 'type',
// 							        			fieldStyle: 'background-color: #FBF8E6; background-image: none;',
// 							        				listeners: {
// 								                          change: function(field, value) {
// 								                        	if(value.length>1){
// 								                        		gMain.selPanel.MkeTypeStore.getProxy().setExtraParam('identification_code', 'WL_RULE');
// 								            	    			gMain.selPanel.MkeTypeStore.getProxy().setExtraParam('class_type',value);
// 								            	                gMain.selPanel.MkeTypeStore.load();
// 								                        	}
								                        	
								                        	  
// 								                          }
// 								                      }
// 							        		}]},gMain.selPanel.MkeTypeGrid]}]
// 						        });
						    	
// 						        var win = Ext.create('ModalWindow', {
// 						        	id: 'win-SRO21',
// 						            title: 'Type정보',
// 						            width: 720,
// 						            height: 640,// bHeight+30,
// 						            items: form,
// 						            buttons: [{
// 							            text: CMD_OK,
// 							        	handler: function(btn){
							        		
// 							        		win.close();
// 							        	}
// 						            }],
							        		
// 						        });
// 						        win.show(/* this, function(){} */);
					
// 					break;
			
// 			}
			
// 		});
		
		// 검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		// 명령툴바 생성
		var buttonToolbar = this.createCommandToolbar();
		
		this.store = Ext.create('Mplm.store.RecevedAddIDStore');
		if(vCUR_USER_UID > 1) {
			this.store.getProxy().setExtraParam('usrast_unique_id', vCUR_USER_UID);
		}

		Ext.each(this.columns, function(columnObj, index) {
			var dataIndex = columnObj['dataIndex'];
			switch(dataIndex) {
				case 'reserved26':
					columnObj.dataType = 'number';
					break;
			}
		});

        // this.createStore('Mplm.store.RecevedAddIDStore', [{
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
			// console_logs('>>> Each Item : ' + index, item);
	      	  if(index==1||index==3||index==5) {
	            	buttonToolbar.items.remove(item);
	      	  }
	        });
        
//        this.setRowClass(function(record, index) {
//        	
//        	// console_logs('record', record);
//            var c = record.get('status');
//            var is_stop_flag = record.get('reserved20');
//            // console_logs('c', c);
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
//                	
//            }
//
//        });
        
        //기술요청
        this.techAccAction = Ext.create('Ext.Action', {
  			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
  			 text: '기술승인',
			   tooltip: '품질요청하기',
			   hidden: gMain.menu_check == true ? false : true,
  			 disabled: true,
  			 handler: function(widget, event) {
//				modify_status = 결재 없는 화면은 강제로 넣어줌
				   //status type ALL_DNY(전체반려) DNY(전단계 반려) APPR(결제승인)
				   gm.me().grid.setLoading(true);
   				Ext.Ajax.request({
   					url: CONTEXT_PATH + '/production/schdule.do?method=updateMkeStatus',
   					params:{
   						status: 'TC',
   						assymap_uid :gMain.selPanel.vSELECTED_ASSYMAP_UID,
   						status_type : 'REQ',
						reserved1 : gMain.selPanel.vSELECTED_RESERVED1,
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
   					},
   					
   					success : function(result, request) { 
						   gm.me().store.getProxy().setExtraParam('status', 'TC');
						//    gm.me().store.getProxy().setExtraParam('usrast_unique_id', vCUR_USER_UID);
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
			   disabled: true,
			   hidden: gMain.menu_check == true ? false : true,
  			 handler: function(widget, event) {
//				modify_status = 결재 없는 화면은 강제로 넣어줌
				  //status type ALL_DNY(전체반려) DNY(전단계 반려) APPR(결제승인)
				  
				  var form = Ext.create('Ext.form.Panel', {
					id: 'formReasonTc',
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
							id: 'reasonTc',
							name: 'reasonTc',
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
							var reason = Ext.getCmp('reasonTc').getValue();
							Ext.MessageBox.show({
								title:'확인',
								msg: '반려 하시겠습니까?',
								buttons: Ext.MessageBox.YESNO,
								fn:  function(result) {
									if(result=='yes') {
										Ext.Ajax.request({
											url: CONTEXT_PATH + '/production/schdule.do?method=updateMkeStatus',
											params:{
												status: 'TC',
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
												gm.me().store.getProxy().setExtraParam('status', 'TC');
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
        
        console_logs('>> buttonToolbar', buttonToolbar);
        buttonToolbar.insert(3, this.cancleAction);
        buttonToolbar.insert(4, this.techAccAction);
        
        this.createGrid(arr);
        
        
        // 작업지시 Action 생성
        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
        	if(this.crudMode=='EDIT') { // EDIT
	    		//console_logs('preCreateCallback', selections);
	    	} else {// CREATE,COPY
	    		this.copyCallback();

	    	}
        	
//        	gMain.selPanel.vSELECTED_UNIQUE_ID = vCUR_USER_UID*(100);
            if (selections.length) {
            	var rec = selections[0];
            	
                // gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('srcahd_uid');
				// //assymap의 child
            	
            	//console_logs('rec>>>>>>>>>>>>>>>>>>>>>>>',rec);
            	gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('unique_uid'); // assymap의 unique_id
                gMain.selPanel.vSELECTED_PJ_CODE = rec.get('pj_code');
                gMain.selPanel.vSELECTED_AC_UID = rec.get('ac_uid');
                gMain.selPanel.vSELECTED_BUYER_UID = rec.get('order_com_unique');
                gMain.selPanel.vSELECTED_ITEM_CODE = rec.get('item_code');
                gMain.selPanel.vSELECTED_STATUS = rec.get('status');
                
                gMain.selPanel.vSELECTED_BM_QUAN = rec.get('bm_quan');
                gMain.selPanel.vSELECTED_PAN_QTY = rec.get('reserved_double3');
                gMain.selPanel.vSELECTED_CHILD = rec.get('srcahd_uid');
                
                gMain.selPanel.vSELECTED_MIN = rec.get('h_reserved23');
                gMain.selPanel.vSELECTED_MAX = rec.get('h_reserved24');
                gMain.selPanel.vSELECTED_TOTAL = rec.get('h_reserved25');
                gMain.selPanel.vSELECTED_VALUE1 = rec.get('h_reserved31');
                gMain.selPanel.vSELECTED_VALUE2 = rec.get('h_reserved34');

                
                gMain.selPanel.vSELECTED_SG_CODE= rec.get('sg_code');
                
                var status = rec.get('status');
                
                gMain.selPanel.vSELECTED_ASSYMAP_UID = rec.get('assymap_uid'); 
                this.techAccAction.enable(); 
                this.cancleAction.enable(); 
                
				gMain.selPanel.vSELECTED_RESERVED1 = rec.get('reserved1');

				gMain.selPanel.vSELECTED_H_RESERVED9 = rec.get('h_reserved9'); // Sample 구분
				gMain.selPanel.vSELECTED_STATUS_KR = rec.get('status_kr'); // 현재상태
				gMain.selPanel.vSELECTED_CUSTOMER = rec.get('wa_name'); // 고객사
				
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
            }else{
            	this.cancleAction.disable(); 
            	this.techAccAction.disable();
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
        this.store.getProxy().setExtraParam('status', 'TC');
        this.store.load(function(records) {
			for(var i=0; i<records.length; i++) {
				var rec = records[i];
				var h_reserved11 = rec.get('h_reserved11');
				var h_reserved12 = rec.get('h_reserved12');
				var type = rec.get('sg_code');
				console_logs('>>>> type', type);
				switch(type) {
					case 'L':
						type = 'LL';
					break;
					case 'R':
						type = 'RR';
					break;
					case 'T':
						type = 'TT';
					break;
				}
				rec.set('h_reserved104', h_reserved11);
				rec.set('h_reserved33', h_reserved12);
				rec.set('h_reserved28', type);
			}

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

    MkeTypeStore: Ext.create('Mplm.store.ClaastStore', {identification_code:'WL_RULE'}),
    MkeItemStore: Ext.create('Mplm.store.InterfaceSpecStore', {}),
    
});
