//수주관리 메뉴
Ext.define('Rfx2.view.company.mke.produceMgmt.RecvProduceView', {
	extend: 'Rfx2.view.salesDelivery.RecvPoView',
    xtype: 'receved-mgmt-prd-view',
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
        	
        	// console_logs('record', record);
            var c = record.get('status');
            var is_stop_flag = record.get('reserved20');
            // console_logs('c', c);
            switch(c) {
                case 'CR':
                	return 'yellow-row';
                	break;
                case 'P':
                	return 'orange-row';
                	break;
                case 'DE':
                case 'S':
                	return 'red-row';
                	break;
                case 'BM':
                	break;
                default:
                	if(is_stop_flag=='Y'){
                		return 'red-row';
                	}else{
                		return 'green-row';
                	}
                	
            }

        });
        
      //출하요청
        this.prdAccAction = Ext.create('Ext.Action', {
  			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
  			 text: '생산승인',
			   tooltip: '출하요청하기',
			   hidden: gMain.menu_check == true ? false : true,
  			 disabled: true,
  			 handler: function(widget, event) {
//  				modify_status = 결재 없는 화면은 강제로 넣어줌
				 //status type ALL_DNY(전체반려) DNY(전단계 반려) APPR(결제승인)
				gm.me().grid.setLoading(true);

				var selections = gm.me().grid.getSelectionModel().getSelection();
				var jsonData = [];
                var jsonDatas = '';

				for(var i=0; i<selections.length; i++) {
					var rec = selections[i];

					jsonDatas = '{status:\'WO\', status_type:\'REQ\'';
					jsonDatas = jsonDatas + ', modify_status:' + '\'' + 'DL' + '\'';
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
					jsonData.push(jsonDatas)
				}
				jsonData = '[' + jsonData + ']';

 				Ext.Ajax.request({
 					url: CONTEXT_PATH + '/production/schdule.do?method=updateMkeStatus',
					 params: {
						jsonDatas : jsonData
					  }, 
					 // params:{
 					// 	status: 'WO',
 					// 	assymap_uid :gMain.selPanel.vSELECTED_ASSYMAP_UID,
 					// 	status_type : 'REQ',
					// 	modify_status : 'DL',
					// 	reserved1 : gMain.selPanel.vSELECTED_RESERVED1,
					// 	pm_name: gMain.selPanel.vSELECTED_PM_NAME,
					// 	so_type: gMain.selPanel.vSELECTED_SO_TYPE,
					// 	type: gMain.selPanel.vSELECTED_SG_CODE,
					// 	target_um: gMain.selPanel.vSELECTED_TARGET_UM,
					// 	target_mil: gMain.selPanel.vSELECTED_TARGET_MIL,
					// 	customer : gMain.selPanel.vSELECTED_CUSTOMER,
					// 	reserved26 : gMain.selPanel.vSELECTED_RESERVED26,

					// 	area_type : gMain.selPanel.vSELECTED_H_RESERVED119,
					// 	act_type : gMain.selPanel.vSELECTED_H_RESERVED120,
					// 	class_code : gMain.selPanel.vSELECTED_RESERVED3,

					// 	h_reserved15 : gMain.selPanel.vSELECTED_H_RESERVED15,
					// 	unit_code : gMain.selPanel.vSELECTED_UNIT_CODE,
					// 	h_reserved10 : gMain.selPanel.vSELECTED_H_RESERVED10,
					// 	h_reserved20 : gMain.selPanel.vSELECTED_H_RESERVED20,
 					// },
 					
 					success : function(result, request) { 
						gm.me().store.getProxy().setExtraParam('status', 'WO');
						gm.me().store.getProxy().setExtraParam('usrast_unique_id', vCUR_USER_UID);
						gm.me().grid.setLoading(false);
						gm.me().checkReqDate(gMain.selPanel.vSELECTED_ASSYMAP_UID);
						// gm.me().store.load(function(records) {});
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
// 				modify_status = 결재 없는 화면은 강제로 넣어줌
				   //status type ALL_DNY(전체반려) DNY(전단계 반려) APPR(결제승인)
				   
				   var form = Ext.create('Ext.form.Panel', {
					id: 'formReasonPd',
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
							id: 'reasonPd',
							name: 'reasonPd',
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
							var reason = Ext.getCmp('reasonPd').getValue();
							Ext.MessageBox.show({
								title:'확인',
								msg: '반려 하시겠습니까?',
								buttons: Ext.MessageBox.YESNO,
								fn:  function(result) {
									if(result=='yes') {
										Ext.Ajax.request({
											url: CONTEXT_PATH + '/production/schdule.do?method=updateMkeStatus',
											params:{
												status: 'WO',
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
												gm.me().store.getProxy().setExtraParam('status', 'WO');
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
        
        //PDF 파일 출력기능
        this.printPDFAction = Ext.create('Ext.Action',{
            iconCls: 'af-pdf',
            text: '작업이력카드',
            tooltip:'작업지시서 출력',
            disabled: true,
            
            handler: function(widget, event) {
            	var po_no = gMain.selPanel.vSELECTED_PJ_CODE;
            	
            	Ext.Ajax.request({
            		url: CONTEXT_PATH + '/pdf.do?method=printWOSample',
            		params:{
            			assymap_uid : gMain.selPanel.vSELECTED_ASSYMAP_UID,
            			po_no : po_no,
            			pdfPrint : 'pdfPrint',
            			is_rotate : 'N'
            		},
            		reader: {
            			pdfPath: 'pdfPath'
            		},
            		success : function(result, request) {
                	        var jsonData = Ext.JSON.decode(result.responseText);
                	        var pdfPath = jsonData.pdfPath;
                	        console_logs(pdfPath);      	        
                	    	if(pdfPath.length > 0) {
                	    		var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ pdfPath;
                	    		top.location.href=url;	
                	    	}
            		},
            		failure: extjsUtil.failureMessage
            	});
            	
            	
            }
        });
		
		buttonToolbar.insert(3, this.prdAccAction);
		buttonToolbar.insert(4, this.cancleAction);
		buttonToolbar.insert(5, this.allcancleAction);
        buttonToolbar.insert(6, this.printPDFAction);
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


		this.finishCopyStore = Ext.create('Mplm.store.RecevedAddIDStore');
		this.finishCopyStore.getProxy().setExtraParam('status_list', 'WO,DL,FN,Y');
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

		//PDF 파일 출력기능
        var printPDFActionSub = Ext.create('Ext.Action',{
            iconCls: 'af-pdf',
            text: '작업이력카드',
            tooltip:'작업지시서 출력',
            disabled: true,
            
            handler: function(widget, event) {
				var rec = gm.me().gridFinishCopy.getSelectionModel().getSelection()[0];
            	var po_no = rec.get('pj_code');
				var assymap_uid = rec.get('assymap_uid');				

            	Ext.Ajax.request({
            		url: CONTEXT_PATH + '/pdf.do?method=printWOSample',
            		params:{
            			assymap_uid : assymap_uid,
            			po_no : po_no,
            			pdfPrint : 'pdfPrint',
            			is_rotate : 'N'
            		},
            		reader: {
            			pdfPath: 'pdfPath'
            		},
            		success : function(result, request) {
                	        var jsonData = Ext.JSON.decode(result.responseText);
                	        var pdfPath = jsonData.pdfPath;
                	        console_logs(pdfPath);      	        
                	    	if(pdfPath.length > 0) {
                	    		var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ pdfPath;
                	    		top.location.href=url;	
                	    	}
            		},
            		failure: extjsUtil.failureMessage
            	});
            	
            	
            }
        });
		
		this.gridFinishCopy = Ext.create('Ext.grid.Panel', {
            id:'gridFinishCopyWo',
            store: this.finishCopyStore,
            cls : 'rfx-panel',
			collapsible: false,
			bbar: getPageToolbar(this.finishCopyStore),
			dockedItems:[
				{
					dock:'top',
					xtype:'toolbar',
					items:[
						finishSearchAction, printPDFActionSub
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
            title: '생산 목록',
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
					printPDFActionSub.enable();
					// gMain.doSelectGrid(selections);
					
					// this.copyCallback();
				} else {
					printPDFActionSub.disable();
				}
			}
		})
        
        
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
                gMain.selPanel.vSELECTED_ASSYMAP_UID = rec.get('assymap_uid');
				gMain.selPanel.vSELECTED_RESERVED1 = rec.get('reserved1');
				
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

                var status = rec.get('status');
                gMain.selPanel.printPDFAction.enable();
                this.cancleAction.enable(); 
				this.prdAccAction.enable();
				this.allcancleAction.enable();
            }else{
            	gMain.selPanel.printPDFAction.disable();
            	
            	this.cancleAction.disable(); 
				this.prdAccAction.disable();
				this.allcancleAction.disable();
            	
            }
		});
		
		this.addCallback('ATTACH_FILE', function(widget, event){
			gm.me().attachFile();
		});
		
		this.createCrudTab();

		this.widget = Ext.widget('tabpanel', {
            layout: 'border',
            border: true,
            id:'widgetTab3',
			width:'100%',
			height:'100%',
			region: 'center',
            // flex: 8,
            items: [
                this.grid,
                this.gridFinishCopy
            ],
		});

		this.grid.setTitle('생산공정관리');
        
        Ext.apply(this, {
            layout: 'border',
            items: [this.widget,  this.crudTab]
        });

        // Ext.apply(this, {
        //     layout: 'border',
        //     items: [this.grid,  this.crudTab]
        // });
        

        this.callParent(arguments);
        

        // 디폴트 로딩
        gMain.setCenterLoading(false);// 스토아로딩에서는 Loading Message를 끈다.
        this.store.getProxy().setExtraParam('status', 'WO');
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

		// var item = items[0].fileApiObject.name;
		// var item_cnt = items.length;
		// var h_reserved19 = '';
		// if(item_cnt == 1) {
		// 	h_reserved19 = item;
		// } else {
		// 	h_reserved19 = item + ' 外 ' + (item_cnt - 1)  + ' 건';
		// }

		// gm.me().getInputTarget('').setValue();
		
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

	checkReqDate: function(assymap_uid) {
		console_logs('>>>> checkReqDate', assymap_uid);

		Ext.Ajax.request({
			url: CONTEXT_PATH + '/production/schdule.do?method=checkReqDateMke',
			params:{
				assymap_uid:assymap_uid
			},
			success : function(result, request) { 
				gm.me().store.load();			
			},// endofsuccess
			failure: function() {
			//    Ext.Msg.alert('안내','결재 요청 실패', function() {});
			//    gm.me().grid.setLoading(false);
			 }
		});// endofajax
	},

	replaceAll: function(str, searchStr, replaceStr) {
		return str.split(searchStr).join(replaceStr);
	},
});
