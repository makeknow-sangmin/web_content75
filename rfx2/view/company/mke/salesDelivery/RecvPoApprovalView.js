//수주관리 메뉴
Ext.define('Rfx2.view.company.mke.salesDelivery.RecvPoApprovalView', {
	extend: 'Rfx2.base.BaseView',
    xtype: 'receved-mgmt-appr-view',
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

        this.createStore('Rfx.model.RecevedAddIDMgmt', [{
            property: 'unique_id',
            direction: 'DESC'
        }],
        gMain.pageSize/* pageSize */
        // order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
    	// Orderby list key change
    	// ordery create_date -> p.create로 변경.
        ,{
        	creator: 'project.creator',
        	unique_id: 'project.unique_id'
        }
    	// 삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
    	, ['project']
		);

		this.store.getProxy().setExtraParam('not_status', 'Y');
		if(vCUR_USER_UID > 1) {
			this.store.getProxy().setExtraParam('rtgapp_useruid', vCUR_USER_UID);
		}

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
  			 text: '결재승인',
  			 tooltip: '결재승인',
  			 disabled: true,
  			 handler: function(widget, event) {
//				modify_status = 결재 없는 화면은 강제로 넣어줌
				 //status type ALL_DNY(전체반려) DNY(전단계 반려) APPR(결제승인)
				 gm.me().grid.setLoading(true);
 				Ext.Ajax.request({
 					url: CONTEXT_PATH + '/production/schdule.do?method=updateMkeStatus',
 					params:{
 						status: gMain.selPanel.vSELECTED_STATUS, /*J3_ASSYMAP - status - 상태값*/
 						assymap_uid :gMain.selPanel.vSELECTED_ASSYMAP_UID, /*J3_ASSYMAP - unique_id - id값*/
 						status_type : 'APPR', /*승인의 경우 APPR 로 고정값. 반려는 DNY*/
						reserved1 :gMain.selPanel.vSELECTED_RESERVED1, /*J3_ASSYMAP - reserved1 - Au,Ag,Cu 등 타입*/
						customer : gMain.selPanel.vSELECTED_CUSTOMER,/*J4_ITEMDETAIL - h_reserved4 - 고객사 이름*/
						
						pm_name: gMain.selPanel.vSELECTED_PM_NAME,/*J3_PROJECT - pm_name - 요청자명*/
						so_type: gMain.selPanel.vSELECTED_SO_TYPE,  /*J3_ASSYMAP - reserved3 -  예)CW-개발 (HAP/CA)*/
						type: gMain.selPanel.vSELECTED_SG_CODE, /*J3_SRCAHD - sg_code - 예)EA, UL 등 */
						target_um: gMain.selPanel.vSELECTED_TARGET_UM, /*J4_ITEMDETAIL - h_reserved11 - Target Size(um)*/
						target_mil: gMain.selPanel.vSELECTED_TARGET_MIL, /*J4_ITEMDETAIL - h_reserved12 - Target Size(mil)*/
						reserved26 : gMain.selPanel.vSELECTED_RESERVED26, /*J3_ASSYMAP - reserved26 -  순번*/

						area_type : gMain.selPanel.vSELECTED_H_RESERVED119, /*J4_ITEMDETAILSUB - h_reserved119 - 지역타입 */
						act_type : gMain.selPanel.vSELECTED_H_RESERVED120, /*J4_ITEMDETAILSUB - h_reserved120 - 양산/개발 */
						class_code : gMain.selPanel.vSELECTED_RESERVED3, /*J3_ASSYMAP - reserved3 -  예)CW-개발 (HAP/CA)*/
							 
						h_reserved15 : gMain.selPanel.vSELECTED_H_RESERVED15,
						unit_code : gMain.selPanel.vSELECTED_UNIT_CODE,
						h_reserved10 : gMain.selPanel.vSELECTED_H_RESERVED10,
						h_reserved20 : gMain.selPanel.vSELECTED_H_RESERVED20,
 					},
 					
 					success : function(result, request) { 
						 gm.me().store.getProxy().setExtraParam('usrast_unique_id', vCUR_USER_UID );
						 gm.me().grid.setLoading(false);
 						gm.me().store.load(function(records) {});
						 Ext.Msg.alert('안내', '결재하였습니다.', function() {});
						 gm.me().grid.getSelectionModel().deselectAll();
 						
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
  			 handler: function(widget, event) {
//  				modify_status = 결재 없는 화면은 강제로 넣어줌
					//status type ALL_DNY(전체반려) DNY(전단계 반려) APPR(결제승인)
					
					// var inputItem= [];
                
					// inputItem.push(
					// {
					// 	xtype: 'textfield',
					// 	id: 'reason',
					// 	name: 'reason',
					// 	fieldLabel: '반려사유',
					// 	allowBlank:true,
					// 	anchor: '-5',
					// 	// fieldStyle : 'background-color: #ddd; background-image: none;'
					// });
					
					var form = Ext.create('Ext.form.Panel', {
						id: 'formReason',
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
								id: 'reason',
								name: 'reason',
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
								var reason = Ext.getCmp('reason').getValue();
								console_logs('>>>> reason', reason);
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
        	if(this.crudMode=='EDIT') { // EDIT
	    	} else {
	    		this.copyCallback();
	    	}
        	
            if (selections.length) {
            	var rec = selections[0];
				console_logs('>>>rec', rec);
            	gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('unique_uid'); // assymap의 unique_id
            	gMain.selPanel.vSELECTED_SG_CODE = rec.get('sg_code');
            	gMain.selPanel.vSELECTED_STATUS = rec.get('status');
            	gMain.selPanel.vSELECTED_ASSYMAP_UID = rec.get('assymap_uid'); 
				gMain.selPanel.vSELECTED_RESERVED1 = rec.get('reserved1');
				
				gMain.selPanel.vSELECTED_PM_NAME = rec.get('pm_name'); // 요청자
				gMain.selPanel.vSELECTED_SO_TYPE = rec.get('reserved3'); // so_type
				gMain.selPanel.vSELECTED_CUSTOMER = rec.get('wa_name'); // 고객사
				gMain.selPanel.vSELECTED_TARGET_UM = rec.get('h_reserved11'); // target size um
				gMain.selPanel.vSELECTED_TARGET_MIL = rec.get('h_reserved12'); // target size mil
				gMain.selPanel.vSELECTED_RESERVED26 = rec.get('reserved26'); // 순번

				gMain.selPanel.vSELECTED_RESERVED3 = rec.get('reserved3'); // so_type
				gMain.selPanel.vSELECTED_H_RESERVED119 = rec.get('h_reserved119'); // 국가
				gMain.selPanel.vSELECTED_H_RESERVED120 = rec.get('h_reserved120'); // 개발|양산

				gMain.selPanel.vSELECTED_H_RESERVED9 = rec.get('h_reserved9'); // Sample 구분
				gMain.selPanel.vSELECTED_STATUS_KR = rec.get('status_kr'); // 현재상태
				gMain.selPanel.vSELECTED_ITEM_CODE = rec.get('item_code'); // 품목코드
				
				gMain.selPanel.vSELECTED_H_RESERVED15 = rec.get('h_reserved15'); // 요청수량
				gMain.selPanel.vSELECTED_UNIT_CODE = rec.get('unit_code'); // 단위
				gMain.selPanel.vSELECTED_H_RESERVED10 = rec.get('h_reserved10'); // 사용목적
				gMain.selPanel.vSELECTED_H_RESERVED20 = rec.get('h_reserved20'); // 영업비고
				
            	this.allcancleAction.enable();
            	this.cancleAction.enable();
            	this.qualAccAction.enable();
            	

            }else{
            	this.allcancleAction.disable();
            	this.cancleAction.disable();
            	this.qualAccAction.disable();
            }
		});

		var history_columns = [];
		history_columns.push(
			{
				text: '상태',
				dataIndex: 'av_progress',
				dataType:'string',
				width: 60
			}
		);

		for(var i=0; i<this.columns.length; i++) {
			var column = this.columns[i];
			var c = {
				text: column.text,
				dataIndex: column.dataIndex,
				dataType: column.dataType,
				width: column.width
			}

			history_columns.push(c);
		}
		
		
        this.approveHistoryStore.load();
        
		this.gridApprovHistory = Ext.create('Ext.grid.Panel', {
            id:'gridApprovHistory',
            store: this.approveHistoryStore,
            cls : 'rfx-panel',
			collapsible: false,
			bbar: getPageToolbar(this.approveHistoryStore),
			dockedItems:[
				{
					dock:'top',
					xtype:'toolbar',
					items:[
						this.historyExcel
					]
				}
			],
            multiSelect: false,
            autoScroll : true,
            autoHeight: true,
            title: '결재이력',
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
            columns: history_columns
            // title: '문서정보'
        });
        
		this.createCrudTab();
		
		this.widget = Ext.widget('tabpanel', {
            layout: 'border',
            border: true,
            // title: '성적서 정보',
            id:'widgetTab',
			width:'100%',
			height:'100%',
			region: 'center',
            // flex: 8,
            items: [
                this.grid,
                this.gridApprovHistory
            ],

		});
		
		this.grid.setTitle('결재목록');

        Ext.apply(this, {
			layout: 'border',
			border: true,
			frame: true,
            items: [this.widget,  this.crudTab]
        });
        

        this.callParent(arguments);
        

        // 디폴트 로딩
        gMain.setCenterLoading(false);// 스토아로딩에서는 Loading Message를 끈다.
//        String gubun = getRequestString(request, "gubun");
//		String app_type = getRequestString(request, "app_type");
//		Long usrast_unique_id = getRequestAlphaLong(request, "usrast_unique_id");
        this.store.getProxy().setExtraParam('usrast_unique_id', vCUR_USER_UID );
        this.store.load(function(records) {
			gm.me().setActiveCrudPanel('EDIT');
            gm.me().crudTab.collapse();
		});	

		// Ext.each(this.columns, function(columnObj, index) {
		// 	var dataIndex = columnObj['dataIndex'];
		// 	switch(dataIndex) {
		// 		case 'reserved26':
		// 			columnObj.dataType = 'number';
		// 			break;
		// 	}
		// });
//        this.store.on('load',function (store, records, successful, eOpts ){
//       });
        
this.store.remoteSort=true;
	},


	historyExcel: Ext.create('Ext.Action', {
        iconCls: 'af-excel',
        text: '엑셀다운',
        tooltip: '엑셀다운',
        toggleGroup: 'toolbarcmd',
        disabled: false,
        handler: function() {
            gm.me().downExcel();
        }
	}),
	
	downExcel: function() {
		// alert(this.link);

		var grid = this.gridApprovHistory.getSelectionModel().getSelection();

		Ext.Ajax.request({
            url: CONTEXT_PATH + '/production/schdule.do?method=readApproveHistory',
            params: {
                srch_rows:'all',
                srch_type: 'excelPrint',
                srch_fields:'major',
				menuCode:'SRO8_SUB',
				usrast_unique_id:vCUR_USER_UID
            },  
            success: function (result, request) {
                var jsonData = Ext.decode(result.responseText);
				var excelPath = jsonData.excelPath;
				if(excelPath!=null && excelPath.length > 0) {
                    var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ excelPath;
                    // console_logs('>>>url', url);
                    top.location.href=url;
                } else {
                    alert('다운로드 경로를 찾을 수 없습니다.');
                }
            },
            failure: extjsUtil.failureMessage
        });

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

	approveHistoryStore: Ext.create('Mplm.store.ApproveHistoryStore', {})
    
});
