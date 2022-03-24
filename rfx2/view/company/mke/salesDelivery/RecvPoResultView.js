//수주관리 메뉴
Ext.define('Rfx2.view.company.mke.salesDelivery.RecvPoResultView', {
	extend: 'Rfx2.base.BaseView',
    xtype: 'receved-mgmt-rs-view',
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
			this.store.getProxy().setExtraParam('cur_user_uid', vCUR_USER_UID);
		}

		// console_logs('>> dddadad 1', this.columns)
		// Ext.each(this.columns, function(columnObj, index) {
		// 	var dataIndex = columnObj['dataIndex'];
		// 	switch(dataIndex) {
		// 		case 'reserved26':
		// 			console_logs('>> dddadad 1', columnObj)
		// 			columnObj.dataType = 'number';
		// 			console_logs('>> dddadad 2', columnObj)
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
		
		this.addCallback('ATTACH_FILE', function(widget, event){
			gm.me().attachFile();
		});

		this.addCallback('ATTACH_WORKFILE', function(widget, event){
			gm.me().attachWORKFile();
		});
        
        //생산요청
        this.qualAccAction = Ext.create('Ext.Action', {
  			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
  			 text: '최종승인',
			   tooltip: '생산요청하기',
			   hidden: gMain.menu_check == true ? false : true,
  			 disabled: true,
  			 handler: function(widget, event) {
//				modify_status = 결재 없는 화면은 강제로 넣어줌
				   //status type ALL_DNY(전체반려) DNY(전단계 반려) APPR(결제승인)
				var result = gm.me().getInputJust('itemdetail|h_reserved98').getValue();
				console_logs('>>>> result', result);
				if(result == null || result.length < 3) {
					Ext.Msg.alert("알림", "무상 Sample 고객사 Test 결과를 확인해주세요. (2자리 이상)");
					return;
				}
				gm.me().grid.setLoading(true);

   				Ext.Ajax.request({
   					url: CONTEXT_PATH + '/production/schdule.do?method=updateMkeStatus',
   					params:{
   						status: 'FN',
   						assymap_uid :gMain.selPanel.vSELECTED_ASSYMAP_UID,
   						status_type : 'APPR',
   						reserved1 : gMain.selPanel.vSELECTED_RESERVED1,
   						modify_status : 'Y'
   					},
   					
   					success : function(result, request) { 
						   gm.me().store.getProxy().setExtraParam('status', 'FN');
						   gm.me().store.getProxy().setExtraParam('cur_user_uid', vCUR_USER_UID);
						   gm.me().grid.setLoading(false);
   						gm.me().store.load(function(records) {});	
   						Ext.Msg.alert('안내', '최종 완료되었습니다.', function() {});
   						
   					},// endofsuccess
   					failure: function() {
						Ext.Msg.alert('안내','완료 실패', function() {});
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
				 id: 'formReasonFn',
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
						 id: 'reasonFn',
						 name: 'reasonFn',
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
						 var reason = Ext.getCmp('reasonFn').getValue();
						 Ext.MessageBox.show({
							 title:'확인',
							 msg: '반려 하시겠습니까?',
							 buttons: Ext.MessageBox.YESNO,
							 fn:  function(result) {
								 if(result=='yes') {
									 Ext.Ajax.request({
										 url: CONTEXT_PATH + '/production/schdule.do?method=updateMkeStatus',
										 params:{
											 status: 'FN',
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
//         this.cancleAction = Ext.create('Ext.Action', {
//   			 iconCls: 'af-reject',
//   			 text: '반려',
// 			   tooltip: '반려하기',
// 			   hidden: gMain.menu_check == true ? false : true,
//   			 disabled: true,
//   			 handler: function(widget, event) {
// //				modify_status = 결재 없는 화면은 강제로 넣어줌
//  				//status type ALL_DNY(전체반려) DNY(전단계 반려) APPR(결제승인)
//  				Ext.Ajax.request({
//  					url: CONTEXT_PATH + '/production/schdule.do?method=updateMkeStatus',
//  					params:{
//  						status: gMain.selPanel.vSELECTED_STATUS,
// 						assymap_uid :gMain.selPanel.vSELECTED_ASSYMAP_UID,
// 						reserved1 : gMain.selPanel.vSELECTED_RESERVED1,
// 						h_reserved9 : gMain.selPanel.vSELECTED_H_RESERVED9,
// 						status_kr : gMain.selPanel.vSELECTED_STATUS_KR,
// 						customer : gMain.selPanel.vSELECTED_CUSTOMER,
// 						item_code : gMain.selPanel.vSELECTED_ITEM_CODE,

// 						pm_name: gMain.selPanel.vSELECTED_PM_NAME,
// 						so_type: gMain.selPanel.vSELECTED_SO_TYPE,
// 						type: gMain.selPanel.vSELECTED_SG_CODE,
// 						target_um: gMain.selPanel.vSELECTED_TARGET_UM,
// 						target_mil: gMain.selPanel.vSELECTED_TARGET_MIL,
// 						reserved26 : gMain.selPanel.vSELECTED_RESERVED26,

// 						area_type : gMain.selPanel.vSELECTED_H_RESERVED119,
// 						act_type : gMain.selPanel.vSELECTED_H_RESERVED120,
// 						class_code : gMain.selPanel.vSELECTED_RESERVED3,
//  						status_type : 'DNY',
//  					},
 					
//  					success : function(result, request) { 
//  						gm.me().store.getProxy().setExtraParam('status', 'FN');
//  						gm.me().store.load(function(records) {});	
//  						Ext.Msg.alert('안내', '반려 요청하였습니다.', function() {});
 						
//  					},// endofsuccess
//  					failure: extjsUtil.failureMessage
//  				});// endofajax

//   	    		 }
// 		  });    
		  
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
        
		buttonToolbar.insert(3, this.cancleAction);
		buttonToolbar.insert(4, this.allcancleAction);
        buttonToolbar.insert(5, this.qualAccAction);
        
        this.createGrid(arr);
        
        
        // 작업지시 Action 생성
        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
        	if(this.crudMode=='EDIT') { // EDIT
	    	} else {
	    		this.copyCallback();
	    	}
        	
            if (selections.length) {
            	var rec = selections[0];
            	
            	gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('unique_uid'); // assymap의 unique_id
            	gMain.selPanel.vSELECTED_SG_CODE = rec.get('sg_code');
            	gMain.selPanel.vSELECTED_SG_CODE = rec.get('sg_code');
            	gMain.selPanel.vSELECTED_STATUS = rec.get('status');
            	gMain.selPanel.vSELECTED_ASSYMAP_UID = rec.get('assymap_uid'); 
            	gMain.selPanel.vSELECTED_RESERVED1 = rec.get('reserved1');
            	
				this.qualAccAction.enable();
				this.allcancleAction.enable();
				this.cancleAction.enable();
            } else {
				this.qualAccAction.disable();
				this.allcancleAction.disable();
				this.cancleAction.disable();
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
        this.store.getProxy().setExtraParam('status', 'FN');
        this.store.load(function(records) {
			gm.me().setActiveCrudPanel('EDIT');
            gm.me().crudTab.collapse();
		});	
//        this.store.on('load',function (store, records, successful, eOpts ){
//       });
this.store.remoteSort=true;

	},

	attachWORKFile: function() {
		var record = gm.me().grid.getSelectionModel().getSelection()[0];

		var assymap_uid = 100;
		var item_code = null;

		try {
			item_code = gm.me().getInputJust('partline|item_code').getValue() + '-WORK';
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
    
});
