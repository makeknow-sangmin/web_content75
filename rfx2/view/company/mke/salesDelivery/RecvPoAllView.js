//수주관리 메뉴
Ext.define('Rfx2.view.company.mke.salesDelivery.RecvPoAllView', {
	extend: 'Rfx2.base.BaseView',
    xtype: 'receved-mgmt-all-view',
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
		this.addSearchField('reserved26');
        this.addSearchField('pj_code');
        this.addSearchField('h_reserved4');
		this.addSearchField('company_name');
		this.addSearchField('sg_code');
		this.addSearchField('pm_name');		
    	
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

		Ext.each(this.columns, function(columnObj, index) {
			var dataIndex = columnObj['dataIndex'];
			switch(dataIndex) {
				case 'reserved26':
					columnObj.dataType = 'number';
					break;
			}
		});

        // this.createStore('Mplm.store.RecevedAddIDStore', [{
        //     property: 'reserved26',
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
	      	  if(index==1||index==3||index==4||index==5) {
	            	buttonToolbar.items.remove(item);
	      	  }
			});
			
		this.removeAction = Ext.create('Ext.Action', {
			iconCls: 'af-remove',
			text: gm.getMC('CMD_DELETE', '삭제'),
			tooltip: '삭제하기',
			disabled: true,
			hidden: vCUR_USER_ID == 'root' ? false : true,
			handler: function() {
				Ext.MessageBox.show({
                    title: '확인',
                    msg: '삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function(btn) {
						if(btn == 'yes') {
							var records = gm.me().grid.getSelectionModel().getSelection();
								uids = [];

							for(var i=0; i<records.length; i++) {
								var rec = records[i];
									unique_id = rec.get('unique_id');
									assymap_uid = rec.get('assymap_uid');
									uids.push(assymap_uid);
							}

							Ext.Ajax.request({
                                url: CONTEXT_PATH + '/production/schdule.do?method=deleteSampleMke',
                                params: {
                                    unique_ids:uids
                                },
                                success: function(result, request) {
                                    gm.me().showToast('결과', '선택하신 항목을 삭제했습니다.');
                                    gm.me().store.load();
                                },
                                failure: extjsUtil.failureMessage
							});
							
						}
					}
				});
			}
		});

		this.historyAction = Ext.create('Ext.Action', {
			iconCls: 'fa-typcn-th-list-outline_14_0_5395c4_none',
			text: '결재이력',
			tooltip: '결재이력 보기',
			disabled: true,
			// hidden: vCUR_USER_ID == 'root' ? false : true,
			handler: function() {
				var select = gm.me().grid.getSelectionModel().getSelection()[0];
				var assymap_uid = select.get('assymap_uid');

				if(assymap_uid < 1) {
					return;
				}

				var win = Ext.create('ModalWindow', {
					title: CMD_VIEW + '::' + /*(G)*/' 결재이력',
					width: 600,
					height: 300,
					minWidth: 250,
					minHeight: 180,
					autoScroll: true,
					layout: {
						type: 'vbox',
						align: 'stretch'
					},
					xtype:'container',
					plain: true,
					items:[gm.me().rtgadtGrid(assymap_uid)],
					buttons: [{
						text: CMD_OK,
						handler: function() {
							if(win) {win.close();}
						}
					}]
				});
				win.show();

				// Ext.Ajax.request({
				// 	url: CONTEXT_PATH + '/production/schdule.do?method=getRtgAdtHistory',
				// 	params: {
				// 		av_no:assymap_uid
				// 	},
				// 	success: function(result, request) {
				// 		var jsonData = Ext.decode(result.responseText);
				// 		console_logs('>>> result', jsonData);
				// 		gm.me().showHistory(jsonData);
				// 	},
				// 	failure: extjsUtil.failureMessage
				// });
			}
		});

		buttonToolbar.insert(1, this.removeAction);
		buttonToolbar.insert(3, this.historyAction);
            
		this.editAction.setText('상세보기');
        
        this.setRowClass(function(record, index) {
            var c = record.get('status');
            switch(c) {
                case 'Y':
					return 'green-row';	
				}
			}
        );
        
        
        this.createGrid(arr);
		
		this.store.pageSize = 500;
        
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
				
				this.removeAction.enable();
				this.historyAction.enable();
				var status = rec.get('status');
                
            } else {
				this.removeAction.disable();
				this.historyAction.disable();
			}
        });
        

        
		this.createCrudTab();

		this.resetAction.hide();
		this.createAction.hide();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
        
        
        this.callParent(arguments);
        
        this.addCallback('ATTACH_FILE', function(widget, event){
			gm.me().attachFile();
		});

		this.addCallback('ATTACH_WORKFILE', function(widget, event){
			gm.me().attachWORKFile();
		});

        // 디폴트 로딩
        gMain.setCenterLoading(false);// 스토아로딩에서는 Loading Message를 끈다.

        this.store.getProxy().setExtraParam('status', null);
        this.store.load(function(records) {
            gm.me().setActiveCrudPanel('EDIT');
            gm.me().crudTab.collapse();
		});	
		
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

	rtgadtHistoryStore : Ext.create('Mplm.store.RtgAdtHistoryStore'),
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

	rtgadtGrid: function(assymap_uid) {
		var ADT_COLUMNS = [];
		ADT_COLUMNS.push({header:'결재코드', dataIndex:'approver_comment', width:'20%', align:'left', resiszable:true, sortable: true});
		ADT_COLUMNS.push({header:'결재자', dataIndex:'user_name', width:'20%', align:'left', resiszable:true, sortable: true,
			renderer: function(value, meta) {
				if(value == null || value.length < 1) {
					value = '메일결재';
				}
				return value;
			}
		});
		ADT_COLUMNS.push({header:'타입', dataIndex:'av_progress', width:'20%', align:'left', resiszable:true, sortable: true});
		ADT_COLUMNS.push({header:'결재일', dataIndex:'complete_date', width:'40%', align:'left', resiszable:true, sortable: true});

		this.rtgadtHistoryStore.getProxy().setExtraParam('av_no', assymap_uid);
		this.rtgadtHistoryStore.load();

		rtgadtGrid = Ext.create('Ext.grid.Panel', {
            id: 'rtgadtGrid',
            store: this.rtgadtHistoryStore,
            multiSelect: false,
            stateId: 'rtgadtGrid',
            selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'multi'}),
            autoScroll : true,
            autoHeight: true,
            filterable: true,
            height: 300,
        //    bbar: getPageToolbar(store),
            region: 'center',
            columns: /*(G)*/ADT_COLUMNS,
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
            },
            // dockedItems: [
            //     {
            //         dock : 'top',
            //         xtype : 'toolbar',
            //         items : [
            //             this.addPRDAction, this.removePRDAction
            //         ]
            //     }
            // ]
		});
		
		return rtgadtGrid;
	}
});
