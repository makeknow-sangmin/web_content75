//수주관리 메뉴
Ext.define('Rfx2.view.company.mke.salesDelivery.RecvPoView', {
	extend: 'Rfx2.base.BaseView',
    xtype: 'receved-mgmt-mke-view',
    inputBuyer : null,
    initComponent: function(){
//    	this.callOverridden();
//    	this.callParent([]);
    	this.setDefValue('regist_date', new Date());
    	// 삭제할때 사용할 필드 이름.
//    	this.setDeleteFieldName('unique_uid');
    	
//    	var next7 = gUtil.getNextday(7);
//    	this.setDefValue('delivery_plan', next7);
//    	this.defOnlyCreate = true;
//    	this.setDefComboValue('pm_uid', 'valueField', -1); // Hidden
    	
    	this.setDefValue('pl_uid', vCUR_USER_UID);
    	// this.setDefValue('h_reserved6', vCUR_USER_NAME);
		// this.setDefValue('h_reserved5', vCUR_DEPT_NAME);
		this.setDefValue('pm_name', vCUR_USER_NAME);
    	// this.setDefValue('pj_code', 'test');
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
			id:	'nation',
			xtype: 'combo',
			text: '지역',
			name: 'nation',
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
					
					var soTypeStore = Ext.getCmp('SO_TYPE');					
					
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
	     	   	id:	'SO_TYPE',
	            xtype: 'combo',
	            text: 'SO_TYPE',
	            name: 'SO_TYPE',
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
							
						   
			        	   gm.me().getInputTarget('pj_code').setValue(record.get('class_name'));
			        	   gm.me().getInputTarget('reserved1').setValue(record.get('class_type'));
						   gm.me().getInputTarget('reserved3').setValue(record.get('class_code'));

						   var bottom_class_flag = record.get('bottom_class_flag');
							   egci_code 		 = record.get('egci_code');
							   
						   if(bottom_class_flag == null || bottom_class_flag.length < 1) {
								bottom_class_flag = 'D';
						   }

						   gm.me().getInputTarget('h_reserved120').setValue(bottom_class_flag);
									  
						   gm.me().CHECK_PJ_CODE = false;
			        	   
						   var prdStore = Ext.getCmp('PRD_TYPE');
						   
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
	     	   	id:	'PRD_TYPE',
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

		// 수주번호 자동생성
		this.addCallback('AUTO_SO', function(o){
			if(gm.me().CHECK_PJ_CODE) {
				return;
			}
			var pj_code = gm.me().getInputTarget('pj_code').getValue(); //고객코드 Value값 가져오기
			


            var fullYear = gUtil.getFullYear() + '';
            // var month = gUtil.getMonth() + '';
            // if (month.length == 1) {
            //     month = '0' + month;
            // }

			
			pj_code = pj_code+fullYear.substr(2,2)/*+month*/;
			   
            
         // 마지막 수주번호 가져오기
 		   Ext.Ajax.request({
 				url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoMes',
 				params:{
 					pj_first: pj_code,
 					codeLength: 3,
 					sql_type: 'MsSql'
 				},
 				success : function(result, request) {   	
 					var result = result.responseText;
 					
 					
					console_logs('result', result);
 					
// 					target.setValue(result);
 					
					 gm.me().getInputJust('project|pj_code').setValue(result);
					 
					 gm.me().CHECK_PJ_CODE = true;
 					// var class_code =
 					// gMain.selPanel.inputClassCode.get('class_code');
 					// var target2 = gMain.selPanel.getInputTarget('item_code');
 					// target2.setValue(result.substring(0,1) +
 					// class_code.substring(0,1) + result.substring(2) + '01');
 				},// endofsuccess
 				failure: extjsUtil.failureMessage
 			});// endofajax
			
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
		
		// Total(KM) 자동계산
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
		
		// 고객사정보 가져오기
		this.addCallback('CHECK_COMP', function(o){
			var wa_code = gm.me().getInputTarget('h_reserved1').getValue(); //고객코드 Value값 가져오기
			console_logs('wa_code', wa_code);
		   Ext.Ajax.request({
				url: CONTEXT_PATH + '/sales/buyer.do?method=read',
				params:{
					wa_code: wa_code
				},
				
				success : function(result, request) { 
					
					var oStr = result.responseText;
					
					var o = Ext.decode(oStr);
					console_logs('CHECK_COMP',o);
                    var company_name = '없음';
                    var nation_code = '없음';
                    var wa_name = '없음';
                    var unique_id = -1;
                    if(o!=null) {
                    	company_name = o['datas'][0]['company_name'];
                    	nation_code = o['datas'][0]['nation_code'];
                    	wa_name = o['datas'][0]['wa_name'];
                    	unique_id = o['datas'][0]['unique_id_long'];
                    }
                    console_logs('company_name',company_name);
                    console_logs('nation_code',nation_code);
                    console_logs('wa_name',wa_name);
                    
//					gMain.setCrPaneToolbarMsg('사용가능한 재고수량은 ' + stock_qty_useful + '입니다.');
        			//데이터 가져와서 넣어줄 입력폼
                    gm.me().getInputJust('itemdetail|h_reserved2').setValue(company_name); //업체코드 combst.company_name
                    gm.me().getInputJust('itemdetail|h_reserved3').setValue(nation_code); //국가 : combst.nation_code
                    gm.me().getInputJust('itemdetail|h_reserved4').setValue(wa_name); //Customer combst.wa_name
                    gm.me().getInputJust('project|order_com_unique').setValue(unique_id);
				},// endofsuccess
				failure: extjsUtil.failureMessage
			});// endofajax
			
		});
		
		// 고객사검색 팝업창
		this.addCallback('SRCH_COM', function(widget, event){
			var srch =  gm.me().getInputJust('itemdetail|h_reserved4').getValue();// 품목/Type

					gMain.selPanel.ComBstStore.getProxy().setExtraParam('total_srch', srch);
	        		gMain.selPanel.ComBstStore.load();
	        		
	        		console_logs('gMain.selPanel.ComBstStore',gMain.selPanel.ComBstStore);
					gMain.selPanel.ComBstGrid =
	    		    	Ext.create('Rfx2.view.grid.ComBstGrid', {
	    				 border: true,
	    		         resizable: true,
//	    		         collapsible: true,
	    			     height: 480,
	    		         store:  gMain.selPanel.ComBstStore// ,
	    		         ,listeners : {
	    		        	 'rowdblclick' : function(){ // do something }
	    		        		 var rec = gMain.selPanel.ComBstGrid.getSelectionModel().getSelection()[0];
					        		
					        		var unique_id = rec.get('unique_id');
					        		var company_name = rec.get('company_name');
					        		var nation_code = rec.get('nation_code');
					        		var wa_name = rec.get('wa_name');
					        		var wa_code = rec.get('wa_code');
					        		
					        		gm.me().getInputJust('itemdetail|h_reserved1').setValue(wa_code); //고객사코드 combst.wa_code
					        		gm.me().getInputJust('itemdetail|h_reserved2').setValue(company_name); //업체코드 combst.company_name
					                gm.me().getInputJust('itemdetail|h_reserved3').setValue(nation_code); //국가 : combst.nation_code
					                gm.me().getInputJust('itemdetail|h_reserved4').setValue(wa_name); //Customer combst.wa_name
					                gm.me().getInputJust('project|order_com_unique').setValue(unique_id);
					        		win.close();
	    		        	 }
	    		         }
	    			});	    			
			    	var form = Ext.create('Ext.panel.Panel', {
			            defaultType: 'textfield',
			            border: false,
			            width: 530,
			            height: 550,
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
//			        			collapsible: true,
			        			margin: '5',
			        			width : 500,
			        			height : 500,
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
				        			emptyText: '고객사명/고객사코드/업체코드 입력',
//				        			anchor: '100%',
				        			width: '95%',
				        			id : 'process_qty',
				        			name : 'process_qty',
				        			fieldStyle: 'background-color: #FBF8E6; background-image: none;',
				        				listeners: {
					                          change: function(field, value) {
					                        	  gMain.selPanel.ComBstStore.getProxy().setExtraParam('total_srch', value);
					          	        			gMain.selPanel.ComBstStore.load();
					                        	  
					                          }
					                      }
				        		}]},gMain.selPanel.ComBstGrid]}]
			            
			        });
			    	
			        var win = Ext.create('ModalWindow', {
			            title: '품목정보',
			            width: 540,
			            height: 640,// bHeight+30,
			            items: form,
			            buttons: [{
				            text: CMD_OK,
				        	handler: function(btn){
								var rec = gMain.selPanel.ComBstGrid.getSelectionModel().getSelection()[0];
								var unique_id = rec.get('unique_id');
								var company_name = rec.get('company_name');
								var nation_code = rec.get('nation_code');
								var wa_name = rec.get('wa_name');
								var wa_code = rec.get('wa_code');
								
								gm.me().getInputJust('itemdetail|h_reserved1').setValue(wa_code); //고객사코드 combst.wa_code
								gm.me().getInputJust('itemdetail|h_reserved2').setValue(company_name); //업체코드 combst.company_name
								gm.me().getInputJust('itemdetail|h_reserved3').setValue(nation_code); //국가 : combst.nation_code
								gm.me().getInputJust('itemdetail|h_reserved4').setValue(wa_name); //Customer combst.wa_name
								gm.me().getInputJust('project|order_com_unique').setValue(unique_id);
				        		win.close();
				        	}
			            }]
			        	
			        });
			        win.show(/* this, function(){} */);
			
		});

		this.addCallback('CHECK_COMMENT', function(o){
			var value = o.value;
			var rows = value.split('\n').length;
			if(rows > 5) {
				Ext.Msg.alert('안내', '5줄까지만 가능합니다.', function() {});
				return;
			}
		});

		this.addCallback('ATTACH_FILE', function(widget, event){
			gm.me().attachFile();
		});

		
		// var check_i = 0;
		// Ext.each(this.columns, function(columnObj, index) {
		// 	var dataIndex = columnObj["dataIndex"];
		// 	var copyObj = gUtil.copyObj(this.columns[check_i]);
		// 	console_logs('>>>> columnObj', columnObj);
		// 	approvalColumn.push(copyObj);
		// 	check_i++;
        //     //console_logs('columnObj', columnObj);
        //     // switch (dataIndex) {

		// 	// }
		// });

		var approvalColumn = [];
		for(var i=0; i<this.columns.length; i++) {
			var columnObj = gUtil.copyObj(this.columns[i]);
			columnObj.id = this.columns[i].id + '-back';
			approvalColumn.push(columnObj);
		}
		
		// 검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		// 명령툴바 생성
		var buttonToolbar = this.createCommandToolbar();
		
		this.store = Ext.create('Mplm.store.RecevedAddIDStore');
		this.store.getProxy().setExtraParam('cur_user_uid', vCUR_USER_UID);
		this.deleteClass = 'project';

		// Ext.each(this.columns, function(columnObj, index) {
		// 	var dataIndex = columnObj['dataIndex'];
		// 	switch(dataIndex) {
		// 		case 'reserved26':
		// 			columnObj.dataType = 'number';
		// 			break;
		// 	}
		// });

        // this.createStore('Rfx.model.RecevedAddIDMgmt', [{
	    //         property: 'unique_id',
	    //         direction: 'DESC'
	    //     }],
	    //     gMain.pageSize/* pageSize */
	    //     // order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
        // 	// Orderby list key change
        // 	// ordery create_date -> p.create로 변경.
	    //     ,{
	    //     	creator: 'project.creator',
	    //     	unique_id: 'project.unique_id'
	    //     }
        // 	// 삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
        // 	, ['project']
		// 	);


        // 그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        
//        (buttonToolbar.items).each(function(item,index,length){
//	      	  if(index==1||index==2||index==3||index==4||index==5) {
//	            	buttonToolbar.items.remove(item);
//	      	  }
//	        });
        
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
        this.PoAccAction = Ext.create('Ext.Action', {
  			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
  			 text: '영업승인',
			   tooltip: '기술요청하기',
			   hidden: gMain.menu_check == true ? false : true,
  			 disabled: true,
  			 handler: function(widget, event) {
//  				modify_status = 결재 없는 화면은 강제로 넣어줌
				  //status type ALL_DNY(전체반려) DNY(전단계 반려) APPR(결제승인)
				  gm.me().grid.setLoading(true);

				//   assymap_uid

				var selections = gm.me().grid.getSelectionModel().getSelection();
				var jsonData = [];
                var jsonDatas = '';

				for(var i=0; i<selections.length; i++) {
					var rec = selections[i];

					jsonDatas = '{status:\'SO\', status_type:\'REQ\'';
					var	assymap_uid = rec.get('assymap_uid');
					jsonDatas = jsonDatas + ', assymap_uid:' + '\'' + assymap_uid + '\'';
					var reserved1 = rec.get('reserved1');
					jsonDatas = jsonDatas + ', reserved1:' + '\'' + reserved1 + '\'';
					var h_reserved9 = rec.get('h_reserved9');
					jsonDatas = jsonDatas + ', h_reserved9:' + '\'' + h_reserved9 + '\'';
					var status_kr = rec.get('status_kr');
					jsonDatas = jsonDatas + ', status_kr:' + '\'' + status_kr + '\'';
					var customer = rec.get('wa_name');
					jsonDatas = jsonDatas + ', customer:' + '\'' + customer + '\'';
					var item_code = rec.get('item_code');
					jsonDatas = jsonDatas + ', item_code:' + '\'' + item_code + '\'';
					var pm_name = rec.get('pm_name');
					jsonDatas = jsonDatas + ', pm_name:' + '\'' + pm_name + '\'';
					var so_type = rec.get('reserved3');
					jsonDatas = jsonDatas + ', so_type:' + '\'' + so_type + '\'';
					var type = rec.get('sg_code');
					jsonDatas = jsonDatas + ', type:' + '\'' + type + '\'';
					var target_um = rec.get('h_reserved11');
					jsonDatas = jsonDatas + ', target_um:' + '\'' + target_um + '\'';
					var target_mil = rec.get('h_reserved12');
					jsonDatas = jsonDatas + ', target_mil:' + '\'' + target_mil + '\'';
					var reserved26 = rec.get('reserved26');
					jsonDatas = jsonDatas + ', reserved26:' + '\'' + reserved26 + '\'';
					var area_type = rec.get('h_reserved119');
					jsonDatas = jsonDatas + ', area_type:' + '\'' + area_type + '\'';
					var act_type = rec.get('h_reserved120');
					jsonDatas = jsonDatas + ', act_type:' + '\'' + act_type + '\'';
					var class_code = rec.get('reserved3');
					jsonDatas = jsonDatas + ', class_code:' + '\'' + class_code + '\'';

					// 메일 추가내용 
					var h_reserved15 = rec.get('h_reserved15');  // 요청수량
					jsonDatas = jsonDatas + ', h_reserved15:' + '\'' + h_reserved15 + '\'';
					var unit_code = rec.get('unit_code');  // 단위
					jsonDatas = jsonDatas + ', unit_code:' + '\'' + unit_code + '\'';
					var h_reserved10 = rec.get('h_reserved10');  // 사용목적
					jsonDatas = jsonDatas + ', h_reserved10:' + '\'' + h_reserved10 + '\'';
					var h_reserved20 = rec.get('h_reserved20');  // 영업비고
					if(h_reserved20 != null && h_reserved20.length>0) {
						h_reserved20 = gm.me().replaceAll(h_reserved20, '\n', '<br />');
					};
					jsonDatas = jsonDatas + ', h_reserved20:' + '\'' + h_reserved20 + '\'';

					jsonDatas = jsonDatas + '}';
					// var length = selections.length;
					// if(length != i+1) {
					// 	jsonDatas = jsonDatas + ', ';
					// } 
					jsonData.push(jsonDatas)
				}

				jsonData = '[' + jsonData + ']';

				console_logs('>>> jssms', jsonData);
				// return;

  				Ext.Ajax.request({
					  url: CONTEXT_PATH + '/production/schdule.do?method=updateMkeStatus',
					  params: {
						jsonDatas : jsonData
					  },
  					// params:{
  					// 	status: 'SO',
  					// 	assymap_uid :gMain.selPanel.vSELECTED_ASSYMAP_UID,
  					// 	status_type : 'REQ',
					// 	reserved1 : gMain.selPanel.vSELECTED_RESERVED1,
					// 	h_reserved9 : gMain.selPanel.vSELECTED_H_RESERVED9,
					// 	status_kr : gMain.selPanel.vSELECTED_STATUS_KR,
					// 	customer : gMain.selPanel.vSELECTED_CUSTOMER,
					// 	item_code : gMain.selPanel.vSELECTED_ITEM_CODE,
						
					// 	pm_name: gMain.selPanel.vSELECTED_PM_NAME,
					// 	so_type: gMain.selPanel.vSELECTED_SO_TYPE,
					// 	type: gMain.selPanel.vSELECTED_SG_CODE,
					// 	target_um: gMain.selPanel.vSELECTED_TARGET_UM,
					// 	target_mil: gMain.selPanel.vSELECTED_TARGET_MIL,
					// 	reserved26 : gMain.selPanel.vSELECTED_RESERVED26,

					// 	area_type : gMain.selPanel.vSELECTED_H_RESERVED119,
					// 	act_type : gMain.selPanel.vSELECTED_H_RESERVED120,
					// 	class_code : gMain.selPanel.vSELECTED_RESERVED3
  					// },
  					
  					success : function(result, request) { 
						  gm.me().store.getProxy().setExtraParam('status', 'SO');
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
        
		buttonToolbar.insert(6, this.PoAccAction);
		
		this.ApprovalBackAction = Ext.create('Ext.Action', {
			iconCls: 'af-reject',
			text: '요청이력',
			tooltip: '요청이력',
			handler: function() {
				gm.me().approvalBackHandler(approvalColumn);
			}
		});

		// buttonToolbar.insert(7, '->');
		buttonToolbar.insert(7, this.ApprovalBackAction);

		this.createGrid(arr);
		
		var finish_columns = [];

		for(var i=0; i<this.columns.length; i++) {
			var column = this.columns[i];
			var c = {
				text: column.text,
				dataIndex: column.dataIndex,
				dataType: column.dataType,
				width: column.width
			}
			finish_columns.push(c);
		}
		// console_logs('>>? finish_columns', finish_columns);

		this.finishCopyStore = Ext.create('Mplm.store.RecevedAddIDStore');
		// this.finishCopyStore.getProxy().setExtraParam('status_list', 'FN,Y');
		this.finishCopyStore.load();

		console_logs('>>>>>Qqqq', this.buttonToolbar);

		var finishSearchAction = Ext.create('Ext.Action', {
			iconCls: 'af-search',
			text: CMD_SEARCH/*'검색'*/,
			tooltip: '조건 검색',
			handler: function() {
				gm.me().finishCopyStore.load();
			}
		});
		var finishCopyAction = this.copyAction;
		
		this.gridFinishCopy = Ext.create('Ext.grid.Panel', {
            id:'gridFinishCopy',
            store: this.finishCopyStore,
            cls : 'rfx-panel',
			collapsible: false,
			bbar: getPageToolbar(this.finishCopyStore),
			dockedItems:[
				{
					dock:'top',
					xtype:'toolbar',
					items:[
						finishSearchAction, finishCopyAction
					]
				}, 
				{
					dock: 'top',
					xtype:'toolbar',
					cls: 'my-x-toolbar-default1',
					items: [
						{
							xtype: 'triggerfield',
							fieldStyle: 'background-color: #D6E8F6; background-image: none;',
							id: gu.id('search_pj_code'),
							name: 'search_pj_code',
							emptyText: 'SO#',
							onTrigger1Click : function() {
								this.setValue('');
								gm.me().finishCopyStore.getProxy().setExtraParam('pj_code', null);
								gm.me().finishCopyStore.load();
							},
							listeners : {
								change : function(fieldObj, e) {
									gm.me().finishCopyStore.getProxy().setExtraParam('pj_code', e);
									gm.me().finishCopyStore.load();
								},
								render: function(c) {
									Ext.create('Ext.tip.ToolTip', {
										target: c.getEl(),
										html: c.emptyText
									});
								}
							},
							trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
							'onTrigger1Click': function() {
								this.setValue('');
								gm.me().finishCopyStore.getProxy().setExtraParam('pj_code', null);
								gm.me().finishCopyStore.load();
							}
						},{
							xtype: 'triggerfield',
							fieldStyle: 'background-color: #D6E8F6; background-image: none;',
							id: gu.id('search_h_reserved4'),
							name: 'search_h_reserved4',
							emptyText: 'Customer',
							onTrigger1Click : function() {
								this.setValue('');
								gm.me().finishCopyStore.getProxy().setExtraParam('h_reserved4', null);
								gm.me().finishCopyStore.load();
							},
							listeners : {
								change : function(fieldObj, e) {
									gm.me().finishCopyStore.getProxy().setExtraParam('h_reserved4', e);
									gm.me().finishCopyStore.load();
								},
								render: function(c) {
									Ext.create('Ext.tip.ToolTip', {
										target: c.getEl(),
										html: c.emptyText
									});
								}
							},
							trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
							'onTrigger1Click': function() {
								this.setValue('');
								gm.me().finishCopyStore.getProxy().setExtraParam('h_reserved4', null);
								gm.me().finishCopyStore.load();
							}
						},{
							xtype: 'triggerfield',
							fieldStyle: 'background-color: #D6E8F6; background-image: none;',
							id: gu.id('search_company_name'),
							name: 'search_company_name',
							emptyText: '업체코드',
							onTrigger1Click : function() {
								this.setValue('');
								gm.me().finishCopyStore.getProxy().setExtraParam('company_name', null);
								gm.me().finishCopyStore.load();
							},
							listeners : {
								change : function(fieldObj, e) {
									gm.me().finishCopyStore.getProxy().setExtraParam('company_name', e);
									gm.me().finishCopyStore.load();
								},
								render: function(c) {
									Ext.create('Ext.tip.ToolTip', {
										target: c.getEl(),
										html: c.emptyText
									});
								}
							},
							trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
							'onTrigger1Click': function() {
								this.setValue('');
								gm.me().finishCopyStore.getProxy().setExtraParam('company_name', null);
								gm.me().finishCopyStore.load();
							}
						}
					]
				},			
			],
            multiSelect: false,
            autoScroll : true,
            autoHeight: true,
            title: '전체목록',
            selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'single'}),
            // bbar: getPageToolbar(storeTemplate),
            frame: true,
            layout :'fit',
            // forceFit: true,
            margin: '0 10 0 0',
            width: '100%',
            plugins:Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            }),
            columns: finish_columns
            // title: '문서정보'
		});
		
		this.gridFinishCopy.getSelectionModel().on({
			selectionchange: function(sm, selections) {
				if(selections.length) {
					finishCopyAction.enable();
					gMain.doSelectGrid(selections);
					
					if(selections != null && selections.length > 0) {
						var select = selections[0];
						var nation = select.get('egci_code');
						var SO_TYPE = select.get('class_code');
						var PRD_TYPE = select.get('prd_code');
						Ext.getCmp('nation').setValue(nation);
						Ext.getCmp('SO_TYPE').setValue(SO_TYPE);
						Ext.getCmp('PRD_TYPE').setValue(PRD_TYPE);

						var soTypeStore = Ext.getCmp('SO_TYPE');
						soTypeStore.store.getProxy().setExtraParam('egci_code', nation);

						var prdStore = Ext.getCmp('PRD_TYPE');
							
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
					// this.copyCallback();
				} else {
					finishCopyAction.disable();
				}
			}
		})
        
        
        // 작업지시 Action 생성
        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
        	if(this.crudMode=='EDIT' || this.crudMode=='COPY') { // EDIT
				console_logs('preCreateCallback', selections);
				if(selections != null && selections.length > 0) {
					var select = selections[0];
					var nation = select.get('egci_code');
					var SO_TYPE = select.get('class_code');
					BACK_SO_TYPE = SO_TYPE;
					var PRD_TYPE = select.get('prd_code');
					Ext.getCmp('nation').setValue(nation);
					Ext.getCmp('SO_TYPE').setValue(SO_TYPE);
					Ext.getCmp('PRD_TYPE').setValue(PRD_TYPE);

					var soTypeStore = Ext.getCmp('SO_TYPE');
					soTypeStore.store.getProxy().setExtraParam('egci_code', nation);

					var prdStore = Ext.getCmp('PRD_TYPE');
							
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
				
	    	} else {// CREATE,COPY
	    		this.copyCallback();

	    	}
        	
//        	gMain.selPanel.vSELECTED_UNIQUE_ID = vCUR_USER_UID*(100);
            if (selections.length) {
            	var rec = selections[0];
            	
                // gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('srcahd_uid');
				// //assymap의 child
            	
            	console_logs('rec>>>>>>>>>>>>>>>>>>>>>>>',rec);
            	gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('unique_uid'); // assymap의 unique_id
                gMain.selPanel.vSELECTED_PJ_CODE = rec.get('pj_code');
                gMain.selPanel.vSELECTED_AC_UID = rec.get('ac_uid');
                gMain.selPanel.vSELECTED_BUYER_UID = rec.get('order_com_unique');
                gMain.selPanel.vSELECTED_ITEM_CODE = rec.get('item_code');
                gMain.selPanel.vSELECTED_STATUS = rec.get('status');
                
                gMain.selPanel.vSELECTED_BM_QUAN = rec.get('bm_quan');
                gMain.selPanel.vSELECTED_PAN_QTY = rec.get('reserved_double3');
                gMain.selPanel.vSELECTED_CHILD = rec.get('srcahd_uid');
                
                gMain.selPanel.vSELECTED_ASSYMAP_UID = rec.get('assymap_uid'); 
                var status = rec.get('status');
                
                this.PoAccAction.enable();
                
				gMain.selPanel.vSELECTED_RESERVED1 = rec.get('reserved1');
				
				gMain.selPanel.vSELECTED_H_RESERVED9 = rec.get('h_reserved9'); // Sample 구분
				gMain.selPanel.vSELECTED_STATUS_KR = rec.get('status_kr'); // 현재상태
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
			   
				this.selectionedUids = [];
				var s = gm.me().grid.getSelectionModel().getSelection();
				for(var i=0; i<s.length; i++) {
					this.selectionedUids.push(s[i].get('unique_id_long'));
				}

            }else{
				 this.PoAccAction.disable();
				 this.selectionedUids = [];
            }
        });
        

        
		this.createCrudTab();
		
		

		this.widget = Ext.widget('tabpanel', {
            layout: 'border',
            border: true,
            id:'widgetTab2',
			width:'100%',
			height:'100%',
			region: 'center',
            // flex: 8,
            items: [
                this.grid,
                this.gridFinishCopy
            ],
		});

		this.grid.setTitle('영업수주');

        Ext.apply(this, {
            layout: 'border',
            items: [this.widget,  this.crudTab]
        });
        

        this.callParent(arguments);
        

        // 디폴트 로딩
        gMain.setCenterLoading(false);// 스토아로딩에서는 Loading Message를 끈다.
        this.store.getProxy().setExtraParam('status', 'SO');
        this.store.load(function(records) {
			gm.me().setActiveCrudPanel('EDIT');
            gm.me().crudTab.collapse();
		});	
//        this.store.on('load',function (store, records, successful, eOpts ){
//       });
		this.store.remoteSort=true;

    }, 
    
    setComInfo : function(o){
    	console_logs('setComInfo',o);
    	 var company_name = '없음';
         var nation_code = '없음';
         var wa_name = '없음';
         if(o!=null) {
         	company_name = o['company_name'];
         	nation_code = o['nation_code'];
         	wa_name = o['wa_name'];
         }
         console_logs('company_name',company_name);
         console_logs('nation_code',nation_code);
         console_logs('wa_name',wa_name);
         
//			gMain.setCrPaneToolbarMsg('사용가능한 재고수량은 ' + stock_qty_useful + '입니다.');
			//데이터 가져와서 넣어줄 입력폼
         gm.me().getInputJust('itemdetail|h_reserved1').setValue(company_name); //업체코드 combst.company_name
         gm.me().getInputJust('itemdetail|h_reserved2').setValue(nation_code); //국가 : combst.nation_code
         gm.me().getInputJust('itemdetail|h_reserved4').setValue(wa_name); //Customer combst.wa_name
			

 
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
		
		var item = items[0].fileApiObject.name;
		var item_cnt = items.length;
		var h_reserved19 = '';
		if(item_cnt == 1) {
			h_reserved19 = item;
		} else {
			h_reserved19 = item + ' 外 ' + (item_cnt - 1)  + ' 건';
		}

		gm.me().getInputTarget('h_reserved19').setValue(h_reserved19);
    	
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

    item_code_first:'',
    ComBstStore: Ext.create('Mplm.store.CombstStore', {}),
	CHECK_PJ_CODE:false,
	ApprovalHistoryStore : Ext.create('Mplm.store.RecevedAddIDStore'),
	approvalCancleAction: Ext.create('Ext.Action', {
		iconCls: 'af-reject',
		text: '상신취소',
		tooltip: '상신취소 하기',
		// hidden: gMain.menu_check == true ? false : true,
		disabled: true,
		handler: function() {
			Ext.MessageBox.show({
				title:'확인',
				msg: '상신취소 하시겠습니까?',
				buttons: Ext.MessageBox.YESNO,
				fn:  function(result) {
					if(result=='yes') {
						var approval_assy_uid = Ext.getCmp(gu.id('backPanel')).getSelectionModel().getSelection()[0];
						// Ext.Ajax.request({
						// 	url: CONTEXT_PATH + '/production/schdule.do?method=updateMkeStatus',
						// 	params:{
						// 		status: 'SO',
						// 		assymap_uid :gMain.selPanel.vSELECTED_ASSYMAP_UID,
						// 		status_type : 'DNY',
						// 		reserved1 : gMain.selPanel.vSELECTED_RESERVED1,
						// 		h_reserved9 : gMain.selPanel.vSELECTED_H_RESERVED9,
						// 		status_kr : gMain.selPanel.vSELECTED_STATUS_KR,
						// 		customer : gMain.selPanel.vSELECTED_CUSTOMER,
						// 		item_code : gMain.selPanel.vSELECTED_ITEM_CODE,

						// 		pm_name: gMain.selPanel.vSELECTED_PM_NAME,
						// 		so_type: gMain.selPanel.vSELECTED_SO_TYPE,
						// 		type: gMain.selPanel.vSELECTED_SG_CODE,
						// 		target_um: gMain.selPanel.vSELECTED_TARGET_UM,
						// 		target_mil: gMain.selPanel.vSELECTED_TARGET_MIL,
						// 		reserved26 : gMain.selPanel.vSELECTED_RESERVED26,

						// 		area_type : gMain.selPanel.vSELECTED_H_RESERVED119,
						// 		act_type : gMain.selPanel.vSELECTED_H_RESERVED120,
						// 		class_code : gMain.selPanel.vSELECTED_RESERVED3,
						// 		reason:reason
						// 	},
							
						// 	success : function(result, request) { 
						// 		  gm.me().store.getProxy().setExtraParam('status', 'SO');
						// 		  gm.me().store.load(function(records) {});	
								  
						// 		Ext.Msg.alert('안내', '상신취소 하였습니다.', function() {});
								
						// 	},// endofsuccess
						// 	failure: extjsUtil.failureMessage
						// });// endofajax
					}
				},
				//animateTarget: 'mb4',
				icon: Ext.MessageBox.QUESTION
			});
		}
	}),
	
	approvalBackHandler: function(approvalColumn) {
		console_logs('>>> vCUR_UID', vCUR_USER_UID);

		this.ApprovalHistoryStore.getProxy().setExtraParam('cur_user_uid', vCUR_USER_UID);
		this.ApprovalHistoryStore.getProxy().setExtraParam('approval', true);
		this.ApprovalHistoryStore.getProxy().setExtraParam('status', 'SO');
		this.ApprovalHistoryStore.load();

		var backPanel = Ext.create('Ext.grid.Panel', {
			store:this.ApprovalHistoryStore,
			layout: 'fit',
			// height : 370,
			bodyStyle:{"background-color":"antiquewhite"}, 
			id: gu.id('backPanel'),
			border: false,
			autoScroll: true,
			dockedItems: [
				{
					dock: 'top',
					xtype:'toolbar',
					cls: 'my-x-toolbar-default2',
					items: [
						this.approvalCancleAction
					]
				}
			],
			bbar: getPageToolbar(this.ApprovalHistoryStore),
			columns: approvalColumn
		});

		var window = Ext.create('Ext.window.Window', {
			autoShow : true,
			width : 800,
			id: gu.id('approval_back_win'),
			height : 500,
			minWidth: 300,
			minHeight: 300,
			title : '요청이력',
			draggable : true,  //드래그기능제어(true/false)
			resizable : true,  //윈도우창 리사이즈기능(true/false)
			maximizable : true,  //브라우저화면을 채우는 기능(true/false)
			closeAction : 'destroy',  //cloasAction을 정의하면 키보드의 esc클릭시 자동 닫힘
			layout:'fit',
			modal: true,
			items:[backPanel],
		});
		// });
	},
	BACK_SO_TYPE : null,

	replaceAll: function(str, searchStr, replaceStr) {
			return str.split(searchStr).join(replaceStr);
	},
});
