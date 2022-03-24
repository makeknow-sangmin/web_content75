Ext.define('Rfx2.view.company.mjcm.equipState.AbOccurView', {
	 extend: 'Rfx.base.BaseView',
	    xtype: 'ab-occur-view',
	    initComponent: function(){
	    	//생성시 디폴트 값.
			this.setDefValue('board_email', /*GLOBAL*/vCUR_EMAIL);
			this.setDefValue('user_id', /*GLOBAL*/vCUR_USER_ID);
			this.setDefValue('board_name', /*GLOBAL*/vCUR_USER_NAME);
			this.setDefValue('board_count', 0); //Hidden Value임.
			switch(vSYSTEM_TYPE) {
			case 'MES':
				this.setDefComboValue('gubun', 'valueField', 'AS');//ComboBOX의 ValueField 기준으로 디폴트 설정.
				this.setDefComboValue('fields', 'valueField', 'BUG');//ComboBOX의 ValueField 기준으로 디폴트 설정.
				break;
			case 'PLACE':
				this.setDefComboValue('gubun', 'valueField', 'notice');//ComboBOX의 ValueField 기준으로 디폴트 설정.
			}

			//검색툴바 필드 초기화
			this.initSearchField();
			// 진행상태
			this.addSearchField (
			{
						 xtype: 'combo'
						,anchor: '100%'
						,width:175
						,field_id: 'board_progress'
						,store: "CommonCodeStore"
						,params:{parentCode: 'BOARD_GUBUN_AS_PROCESS'}
						,displayField: 'codeName'
						,valueField: 'systemCode'
						,emptyText: '진행상태'
						,innerTpl : '<div data-qtip="{systemCode}">[{systemCode}]{codeName}</div>'
						,minChars: 2
			});

			this.addSearchField ({
				type: 'dateRange',
				field_id: 'create_date',
				text: "등록일",
				sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
				edate: new Date()
			});	
			
			this.addSearchField('board_title');
			// this.addSearchField('board_content');
			this.addSearchField('user_name');

			
			// 요청사유
			this.addSearchField (
			{
							 xtype: 'combo'
							,anchor: '100%'
							,width:175
							,field_id: 'fields'
							,store: "CommonCodeStore"
							,params:{parentCode: 'BOARD_GUBUN_AS_FIELDS'}
							,displayField: 'codeName'
							,valueField: 'systemCode'
							,emptyText: '요청사유'
							,innerTpl : '<div data-qtip="{systemCode}">[{systemCode}]{codeName}</div>'
							,minChars: 2
			});

			//검색툴바 생성
			var searchToolbar =  this.createSearchToolbar();
			//명령툴바 생성
			var buttonToolbar = this.createCommandToolbar();

			this.AsConfirmWorkAction = Ext.create('Ext.Action', {
				iconCls: 'af-check',
				text: gm.getMC('CMD_Receipt_Confirmation', '접수확인'),
				tooltip: '접수된 건을 확인 처리합니다.',
				disabled: true,
				handler: function () {
					var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
					var rec = selections[0];
					gm.me().asConfirmWork(rec.get('unique_id'));
				}
			});

			this.AsProceddingAction = Ext.create('Ext.Action', {
				iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
				text: gm.getMC('CMD_Proceeding', '진행중'),
				tooltip: '접수된 건을 진행 중으로 처리합니다.',
				disabled: true,
				handler: function () {
					var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
					var rec = selections[0];
					gm.me().asProceddingWork(rec.get('unique_id'));
				}
			});

            this.AsPauseAction = Ext.create('Ext.Action', {
                iconCls: 'af-pause',
                text: gm.getMC('CMD_Delay', '지연'),
                tooltip: '구현 중 다른 이슈가 생겨 지연 처리합니다.',
                disabled: true,
                handler: function () {
                    var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                    var rec = selections[0];
                    gm.me().asPauseWork(rec.get('unique_id'));
                }
            });

			this.AsReturnAction = Ext.create('Ext.Action', {
				iconCls: 'af-reject',
				text: gm.getMC('crt3_return', '반려처리'),
				tooltip: '접수된 건을 반려합니다.',
				disabled: true,
				handler: function () {
					var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
					var rec = selections[0];
					var email = rec.get('board_email');
					
					var rejectForm = Ext.create('Ext.form.Panel', {
						id: 'formPanelSendmail',
						defaultType: 'textfield',
						border: false,
						bodyPadding: 15,
						region: 'center',
						defaults: {
							anchor: '100%',
							allowBlank: false,
							msgTarget: 'side',
							labelWidth: 100
						},
						items: [
							new Ext.form.Hidden({
								name: 'unique_id',
								value: rec.get('unique_id')
							}),
							{
								xtype: 'label',
								text : "반려사유를 기입하십시오(50자 내외로 작성)",
								anchor: '100%',
								margin: '0 0 40 0'
							},
							{
								name: 'contents',
								allowBlank: false,
								xtype: 'textarea',
								value: "",
								height: 100,
								anchor: '100%'
							}
						]
					});

					var win = Ext.create('ModalWindow', {
						title: '반려처리',
						width: 750,
						height: 250,
						items: rejectForm,
						buttons: [{
							text: CMD_OK,
							handler: function(){
								var form = Ext.getCmp('formPanelSendmail').getForm();
								if(form.isValid())
								{
									var val = form.getValues(false);
									if(val['contents'].length > 50) {
										Ext.MessageBox.alert('알림', '반려사유는 50자 내외로만 작성할 수 있습니다.');
										return;
									}
									rejectForm.submit({
										url: CONTEXT_PATH + '/admin/board.do?method=asReturn',
										params:{
											unique_id : rec.get('unique_id'),
											content : val['contents']
										},										
										success: function(result, request) {
											console_logs('save success', result);
											if(win) {
												win.close();
											}
											Ext.MessageBox.alert('반려', '반려 되었습니다.');
											gm.me().store.load();	
										},
										failure : function(){
											console_log('failure');
											Ext.MessageBox.alert(error_msg_prompt,'Failed');
										}
									});
								} else {
									Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
								}
							}//endofhandler
						},{
							text: CMD_CANCEL,
							handler: function(){
								if(win) {
									win.close();
								}
							}
						}
						]
					});
					win.show();
				}
			});
			
			this.AsFinishWorkAction = Ext.create('Ext.Action', {
				iconCls: 'af-check',
				text: gm.getMC('CMD_Completion_request', '완료요청'),
				tooltip: 'A/S 작업을 완료 후 사용자에게 처리 요청을 합니다',
				disabled: true,
				handler: function () {
					var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
					var rec = selections[0];
					var email = rec.get('email');
					
					var mailForm = Ext.create('Ext.form.Panel', {
						id: 'formPanelSendmail',
						defaultType: 'textfield',
						border: false,
						bodyPadding: 15,
						region: 'center',
						defaults: {
							anchor: '100%',
							allowBlank: false,
							msgTarget: 'side',
							labelWidth: 100
						},
						items: [
							new Ext.form.Hidden({
								name: 'unique_id',
								value: rec.get('unique_id')
							}),
							{
								name: 'mailTo',
								allowBlank: false,
								value: email,
								anchor: '100%'  // anchor width by percentage
							},
							{
								name: 'mailSubject',
								allowBlank: true,
								value: 'A/S 요청 처리 완료',
								anchor: '100%'  // anchor width by percentage
							},
							{
								name: 'mailContents',
								allowBlank: true,
								xtype: 'textarea',
								value: "",
								height: 250,
								anchor: '100%'
							}
						]
					});

					var win = Ext.create('ModalWindow', {
						title: '완료 메세지 전송',
						width: 750,
						height: 430,
						items: mailForm,
						buttons: [{
							text: CMD_OK,
							handler: function(){
								var form = Ext.getCmp('formPanelSendmail').getForm();
								if(form.isValid())
								{
									var val = form.getValues(false);
									mailForm.submit({
										url: CONTEXT_PATH + '/admin/board.do?method=asFinishWork',
										waitMsg: '메일 전송중입니다.',
										params:{
											unique_id : rec.get('unique_id'),
											email_addr : val['mailTo'],
											mailSubject : val['mailSubject'],
											mailContents : val['mailContents']
										},										
										success: function(result, request) {
											console_logs('save success', result);
											if(win) {
												win.close();
											}
											Ext.MessageBox.alert('전송확인', '전송되었습니다.');
											gm.me().store.load();	
										},
										failure : function(){
											console_log('failure');
											Ext.MessageBox.alert(error_msg_prompt,'Failed');
										}
									});
								} else {
									Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
								}
							}//endofhandler
						},{
							text: CMD_CANCEL,
							handler: function(){
								if(win) {
									win.close();
								}
							}
						}
						]
					});
					win.show();
				}
			});

			this.AsFinalFinishAction = Ext.create('Ext.Action', {
                iconCls: 'af-check',
                text: gm.getMC('sro1_completeAction', '완료'),
                tooltip: '처리 후 요청자가 검토 후 완료처리 합니다.',
                disabled: true,
                handler: function () {
                    var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                    var rec = selections[0];
                    gm.me().asFinalFinishWork(rec.get('unique_id'));
                }
			});
			
			buttonToolbar.insert(6, this.AsConfirmWorkAction);
			buttonToolbar.insert(7, this.AsProceddingAction);
            buttonToolbar.insert(8, this.AsPauseAction);
			buttonToolbar.insert(9, this.AsFinishWorkAction);
			buttonToolbar.insert(10, this.AsFinalFinishAction);
			buttonToolbar.insert(11, this.AsReturnAction);
	        //모델 정의
	        this.createStore('Rfx.model.BoardAs', [{
		            property: 'create_date',
		            direction: 'DESC'
		        }],
		        /*pageSize*/
		        gMain.pageSize
		        ,{
		        	board_content: 'b.board_content',
		        	board_count: 'b.board_count',
		        	board_email: 'b.board_email',
		        	board_title: 'b.board_title',
		        	create_date: 'b.create_date',
		        	creator: 'b.creator',
		        	gubun: 'b.gubun',
		        	unique_id: 'b.unique_id',
		        	user_id: 'b.user_id'
		        }
	        	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
	        	, ['board']
			);

	        //그리드 생성
	        var arr=[];
	        arr.push(buttonToolbar);
	        arr.push(searchToolbar);
	        

			this.setRowClass(function(record, index) {
				console_logs('record>>>>>>>>>>>>>>>>', record);
				var c = record.get('board_progress');
				switch(c) {
					case 'C':
						return 'blue-row';
						break;
					case 'P':
						return 'yellow-row';
						break;
					case 'D':
						return 'red-row';
						break;
					case 'Y':
						return 'orange-row';
						break;
					case 'FN':
						return 'green-row';
						break;	
					case 'U':
						return 'gray-row';
						break;
					default:
						break;
				}
			});

			//grid 생성.
			this.createGrid(arr);
			
	        //입력/상세 창 생성.
	        this.createCrudTab();
	        Ext.apply(this, {
	            layout: 'border',
	            items: [this.grid,  this.crudTab]
			});
				        
	        // 게시판 타인 게시물 수정 / 삭제 / 복사등록 막기
	        this.setGridOnCallback(function(selections) {
				var crudMode = gm.me().crudMode;
				console_logs('>>>>>>> callback datas', selections);
				if(selections!=null && selections.length>0) {
					
					var rec = selections[0];
					var login_id = vCUR_USER_ID;
					console_logs('===== rec =====', rec);
					var user_id = rec.get('user_id');
					var is_complished = rec.get('board_progress');
					var status = rec.get('board_progress');
					var creator = rec.get('creator');
					var board_progress = rec.get('board_progress');
					
					console_logs('===== writer_id =====', user_id);
					console_logs('===== current_login_id =====', login_id);
					console_logs('===== is_complished ====', is_complished);

					if((creator == login_id && board_progress == 'N') || login_id=='root') {
						this.editAction.enable();
						this.removeAction.enable();
						this.copyAction.enable();
					} else {
						this.editAction.disable();
						this.removeAction.disable();
						this.copyAction.disable();
					}

					if(creator == login_id) {
						this.AsFinalFinishAction.enable();
					} else {
						this.AsFinalFinishAction.disable();
					}
					// 접수확인, 진행중,  완료, 반려처리는 관리자 계정만 클릭하기
					if(login_id=='root') {
						this.AsConfirmWorkAction.enable();
						this.AsProceddingAction.enable();
                        this.AsPauseAction.enable();
						this.AsReturnAction.enable();
						this.AsFinishWorkAction.enable();
						if(rec.get('board_progress') == 'D') {
							this.AsConfirmWorkAction.disable();
							this.AsProceddingAction.disable();
							this.AsFinishWorkAction.disable();
						}
					} else {
						this.AsFinishWorkAction.disable();
						this.AsConfirmWorkAction.disable();
						this.AsProceddingAction.disable();
                        this.AsPauseAction.disable();
						this.AsReturnAction.disable();	
					}
					if(crudMode == 'EDIT') {
						gm.me().store.getProxy().setExtraParam('group_uid', rec.get('unique_id'));
					}
				} else {
					
				}
	        });
	        this.callParent(arguments);
	        //디폴트 로드
	        gMain.setCenterLoading(false);
			this.store.load(function(records){});
			this.loadStoreAlways = true;
	    },
		items : [],
	    childStore : null,
		itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
			//console_logs('boardview itemdblclick record', record);
			childStore = Ext.create('Mplm.store.BoardAsParentStore',{});

			Rfx.model.BoardAs.load(record.get('unique_id'), {
				success: function(board) {
					console_logs('board', board);
					childStore.getProxy().setExtraParam('parent', record.get('unique_id'));
					childStore.load(function(value) {
					var form = gm.me().createViewForm(board,value);
					var win = Ext.create('Ext.Window', {
						title: gm.me().getMC('CMD_VIEW_DTL','상세보기'),
						width: screen.width / 3.2,
						height: screen.height / 1.9,
						// minWidth: 250,
						// minHeight: 850,
                        // autoScroll: true,
						plain:true,
						items: form,
						buttons: [{
							text: CMD_OK,
							handler: function(){
									   if(win) 
									   {
										   win.close();
									   } 
							  }
						}]
					});
					win.show();
				  });
				}
			});
		},
	    createViewForm: function (board,value) {
			 var unique_id = board.get('unique_id');
	    	 var board_email = board.get('board_email');
	    	 var board_title = board.get('board_title');
	    	 var board_content = board.get('board_content' );
			 var htmlFileNames = board.get('htmlFileNames');
			 var mime = board.get('mime');
			 var reply_content_txt = '' ;
			 var reply_date;
			 var reply_writer;
			 var writer_name; 
			 
			 if(value.length > 0) {
				for(var i=0; i< value.length; i++) {
					var v = value[i];
					console_logs('>>>> v',v);
					reply_content = v.get('board_content');
					reply_date = v.get('create_date');
					writer_name = v.get('user_name');
					reply_writer = v.get('creator');					
					reply_content_txt = reply_content_txt + writer_name +'('+reply_writer+')'+'    ('+reply_date+')\n '+reply_content+'\r\n'+'__________________________________________________'+'\r\n\r\n';					
				}
			 } else {
			 	reply_content_txt = '등록된 내용이 없습니다.'
			 }
			
	    	 var fileQty = board.get('fileQty' );
	    	 var form = Ext.create('Ext.form.Panel', {
				 
	            defaultType: 'displayfield',
	            bodyPadding: 3,
	            height: 800,
	            defaults: {
	                anchor: '98%',
	                allowBlank: false,
	                msgTarget: 'side',
	                labelWidth: 60
	            },
	            items: [{
						fieldLabel: gm.getColName('board_title'),
	    		    	value: board_title,
	    		    	name: 'board_title'
	    		    },{
	    		    	fieldLabel: '첨부파일',
	    		    	value: htmlFileNames
	    		    },{
	                    value: board_content,
	                    xtype: 'textarea',
	                    fieldStyle: 'overflow:scroll ;overflow-x:hidden; background-color: #F0F0F0; background-image: none;border-bottom: #999999 1px solid;border-left: #999999 1px solid;border-right: #999999 1px solid;border-top: #999999 1px solid;',
	                    height: 150,
						readOnly: true,
						margin:'10 10 60 0',
	                    anchor: '98%'
					},{
						value: reply_content_txt,
						id : 'reply_context_txt',
						xtype: 'textarea',
						fieldStyle: 'overflow:scroll ;overflow-x:hidden; background-color: #FFFFFF; background-image: none;border-bottom: #999999 1px solid;border-left: #999999 1px solid;border-right: #999999 1px solid;border-top: #999999 1px solid;',
						height: 150,
						readOnly: true,
						anchor: '98%',
						margin:'10 10 3 0',
					    allowBlank: true
				   },{
					value: '',
					name : 'reply_content',
					id : 'reply_content',
					xtype: 'textfield',
					height: 30,
					allowBlank: false,
					anchor: '98%'
				 },{
						anchor: '20%',
						xtype : 'button',
						text : '등록',
						handler: function(){
							form.submit({
									url: CONTEXT_PATH + '/admin/board.do?method=replySend',
									params:{
										unique_id : unique_id,
										parent_uid : unique_id,
										board_content : Ext.getCmp('reply_content').getValue(),
										gubun : 'ASR',
										mime : mime
									},
									success: function(result, request) {
										console_logs('save success', result);
										form.reset();
										Ext.MessageBox.alert('알림','댓글이 등록되었습니다.');
										childStore.load(function(value) {
											reply_content_txt = '';							
											for(var i=0; i< value.length; i++) {
												var v = value[i];
												console_logs('>>>> v',v);
												reply_content = v.get('board_content');
												reply_date = v.get('create_date');
												writer_name = v.get('user_name');
												reply_writer = v.get('creator');					
												reply_content_txt = reply_content_txt + writer_name +'('+reply_writer+')'+'    ('+reply_date+')\n '+reply_content+'\r\n'+'__________________________________________________'+'\r\n\r\n';					
											}
											Ext.getCmp('reply_context_txt').setValue(reply_content_txt); 
										});
									},
									failure : function(){
										console_logs('failure');
										Ext.MessageBox.alert('알림','댓글이 등록되지 않았습니다.');
									}
							});
						}
					 }
	    		]
	        }); //endof form  	
			return form;
		},
		asConfirmWork : function(unique_id) {
			Ext.MessageBox.show({
				title: '접수 처리',
				msg: '선택한 건을 접수확인 처리 하시겠습니까?',
				buttons: Ext.MessageBox.YESNO,
				icon: Ext.MessageBox.QUESTION,
				fn: function(btn) {
					if (btn == "no") {
						return;
					} else {
						Ext.Ajax.request({
							url: CONTEXT_PATH + '/admin/board.do?method=asConfirm',
							params: {
								unique_id: unique_id,
							},
							success: function(result, request) {
								Ext.MessageBox.alert('알림','해당 건이 접수 확인 되었습니다.');
								gm.me().store.load();
							}, // endofsuccess
							failure: extjsUtil.failureMessage
						});
					} 
				} 
			}); 
		},
		asProceddingWork : function(unique_id) {
			Ext.MessageBox.show({
				title: '진행 처리',
				msg: '선택 한 건을 진행 처리 하시겠습니까?',
				buttons: Ext.MessageBox.YESNO,
				icon: Ext.MessageBox.QUESTION,
				fn: function(btn) {
					if (btn == "no") {
						return;
					} else {
						Ext.Ajax.request({
							url: CONTEXT_PATH + '/admin/board.do?method=asProcedding',
							params: {
								unique_id: unique_id
							},
							success: function(result, request) {
								Ext.MessageBox.alert('알림','해당 건이 진행중으로 변경되었습니다.');
								gm.me().store.load();
							}, // endofsuccess
							failure: extjsUtil.failureMessage
						});
					} 
				} 
			});
		},
		asPauseWork : function(unique_id) {
			Ext.MessageBox.show({
				title: '지연 처리',
				msg: '선택 한 건을 지연 처리 하시겠습니까?',
				buttons: Ext.MessageBox.YESNO,
				icon: Ext.MessageBox.QUESTION,
				fn: function(btn) {
					if (btn == "no") {
						return;
					} else {
						Ext.Ajax.request({
							url: CONTEXT_PATH + '/admin/board.do?method=asPause',
							params: {
								unique_id: unique_id
							},
							success: function(result, request) {
								Ext.MessageBox.alert('알림','해당 건이 지연으로 변경되었습니다.');
								gm.me().store.load();
							}, // endofsuccess
							failure: extjsUtil.failureMessage
						});
					}
				}
			});
		},
		
		asFinalFinishWork : function(unique_id) {
			Ext.MessageBox.show({
				title: '완료 처리',
				msg: '선택 한 건을 완료 처리 하시겠습니까?',
				buttons: Ext.MessageBox.YESNO,
				icon: Ext.MessageBox.QUESTION,
				fn: function(btn) {
					if (btn == "no") {
						return;
					} else {
						Ext.Ajax.request({
							url: CONTEXT_PATH + '/admin/board.do?method=asFinalfinish',
							params: {
								unique_id: unique_id
							},
							success: function(result, request) {
								Ext.MessageBox.alert('알림','해당 건이 최종완료로 변경되었습니다.');
								gm.me().store.load();
							}, // endofsuccess
							failure: extjsUtil.failureMessage
						});
					}
				}
			});
		},
		asReturnWork : function(unique_id) {
			Ext.MessageBox.show({
				title: '반려 처리',
				msg: '선택한 건을 반려 처리 하시겠습니까?',
				buttons: Ext.MessageBox.YESNO,
				icon: Ext.MessageBox.QUESTION,
				fn: function(btn) {
					if (btn == "no") {
						return;
					} else {
						Ext.Ajax.request({
							url: CONTEXT_PATH + '/admin/board.do?method=asReturn',
							params: {
								unique_id: unique_id
							},
							success: function(result, request) {
								Ext.MessageBox.alert('알림','해당 건이 반려처리 되었습니다.');
								gm.me().store.load();
							}, // endofsuccess
							failure: extjsUtil.failureMessage
						});
					} 
				} 
			}); 
		},
		selMode: 'SINGLE',	    
	});