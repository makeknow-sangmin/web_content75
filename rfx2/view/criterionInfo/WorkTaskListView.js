Ext.define('Rfx2.view.criterionInfo.WorkTaskListView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'work-task-list-view',
    initComponent: function(){
    	
		this.setDefValue('board_email', /*GLOBAL*/vCUR_EMAIL);
		this.setDefValue('user_id', /*GLOBAL*/vCUR_USER_ID);
		this.setDefValue('board_name', /*GLOBAL*/vCUR_USER_NAME);
		this.setDefValue('board_count', 0); //Hidden Value임.
		this.setDefComboValue('gubun', 'valueField', '0');//ComboBOX의 ValueField 기준으로 디폴트 설정.

		//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
		// this.addSearchField (
		// {
		// 		field_id: 'gubun'
		// 		,store: 'BoardGubunStore'
		// 		,displayField: 'codeName'
		// 		,valueField: 'systemCode'
		// 		,innerTpl	: '<div data-qtip="{codeNameEn}">[{systemCode}] {codeName}</div>'
		// });	
		// this.addSearchField('unique_id');
		// this.addSearchField('board_title');
		// this.addSearchField('board_content');
		// this.addSearchField('board_name');
		// this.addSearchField('user_id');
		
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar(
			{REMOVE_BUTTONS: [
			'REGIST', 'COPY',/* 'REMOVE',*/ 'EDIT', 'VIEW'
			],
			}
		);
		

        //모델 정의
        this.createStore('Rfx.model.WorkTask', [{
	            property: 'create_date',
	            direction: 'DESC'
	        }],
	        /*pageSize*/
	        gMain.pageSize
	        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
        	//Orderby list key change
        	//ordery create_date -> p.create로 변경.
	        ,{
	        	receiver_uid: vCUR_USER_UID
	        }
        	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
        	, ['worktask']
	        );

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);
        
        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
		// buttonToolbar.insert(1, this.taskRemoveAction);
		buttonToolbar.insert(1, this.taskModifyAction);
		buttonToolbar.insert(1, this.taskCreateAction);

		




		//grid를 선택했을 때 Callback
		this.setGridOnCallback(function(selections) {
			if (selections.length) {
				this.taskModifyAction.enable();
				// this.taskRemoveAction.enable();
			}else{
				this.taskModifyAction.disable();
				// this.taskRemoveAction.disable();
			}		
		});


        this.callParent(arguments);
        
        //디폴트 로드
        gMain.setCenterLoading(false);
		this.store.getProxy().setExtraParam('receiver_uid', vCUR_USER_UID);
		this.store.getProxy().setExtraParam('dept_code', vCUR_DEPT_CODE );
		this.store.getProxy().setExtraParam('sr_admin_flag', vCUR_SR_ADMIN_FLAG );
		this.store.load(function(records){});
		this.loadStoreAlways = true;
        //
		// switch (vCompanyReserved4) {
		// 	case 'BIOT01KR':
		// 		Ext.Ajax.request({
		// 			url: 'https://mail.protechsite.com/',
		// 			success : function(result, request) {
		// 			},
		// 			failure: extjsUtil.failureMessage
		// 		});
		// 		break;
		// }


		
		
    },
    items : [],


	


	taskCreateAction : Ext.create('Ext.Action', {
		iconCls: 'mfglabs-retweet_14_0_5395c4_none',
		text: '업무 등록',
		tooltip: '업무 등록',
		disabled: false,
		handler: function() {

			var form = Ext.create('Ext.form.Panel', {
					id: gu.id('TaskCreatePanel'),
					xtype: 'form',
					frame: false ,
					border: false,
					bodyPadding: '10 10 10 10',
					region: 'center',
					fieldDefaults: {
						// labelAlign: 'right',
						msgTarget: 'side'
					},
					defaults: {
						anchor: '100%',
						//labelWidth: 60,
						margins: 10,
						
					},
					items: [
						// {
						// 	xtype: 'radiogroup',
						// 	fieldLabel: '업무구분',
						// 	// Arrange radio buttons into two columns, distributed vertically
						// 	columns: 3,
						// 	vertical: true,
						// 	items: [
						// 		{ boxLabel: '개인업무', name: 'task_type', inputValue: 'M', checked: true },
						// 		{ boxLabel: '팀업무', name: 'task_type', inputValue: 'T'},
						// 		{ boxLabel: '회사업무', name: 'task_type', inputValue: 'A' },
						// 	]
						// },
						
						{
							xtype: 'combo',
							id: 'receiver_uid',
							name: 'receiver_uid',
							editable: false,
							fieldLabel:'담당자',
							store : Ext.create('Rfx2.store.company.sejun.UsrAstStore', {limit :100, deptCode:vCUR_DEPT_CODE,sr_admin_flag:vCUR_SR_ADMIN_FLAG}),
							displayField: 'user_name',
                            valueField: 'unique_id',
                            listConfig: {
                                getInnerTpl: function() {
                                    return '<div data-qtip="{dept_name}"><small><font color=blue>{user_name}</font></small></div>';
                                }
                            },
							// fieldStyle: 'background-color: #ddd; background-image: none;',
							anchor:'100%',
						}, 
						{
							xtype: 'textfield',
							id: 'owner_uid',
							name: 'owner_uid',
							fieldLabel:'업무 지시자',
							value : vCUR_USER_NAME,
							readOnly: true,
							fieldStyle: 'background-color: #ddd; background-image: none;',
							anchor:'100%',
						},
						{
							xtype: 'textarea',
							id: 'task_contents',
							name: 'task_contents',
							fieldLabel:'업무내용',
							// fieldStyle: 'background-color: #ddd; background-image: none;',
							anchor:'100%',
						}, 
						{
							xtype: 'combo',
							id: 'task_link',
							name: 'task_link',
							store : Ext.create('Mplm.store.MenuObjectLineStore', {}),
							fieldLabel:'업무메뉴설정',
							displayField: 'display_name_ko',
                            valueField: 'menu_full_code',
							// fieldStyle: 'background-color: #ddd; background-image: none;',
							anchor:'100%',
							listConfig: {
                                getInnerTpl: function() {
                                    return '<div data-qtip="{menu_key}"><small><font color=blue>{display_name_ko}</font></small></div>';
                                }
                            },
						},  

						
						
						{
							// Use the default, automatic layout to distribute the controls evenly
							// across a single row
							xtype: 'checkboxgroup',
							fieldLabel: '반복 요일',
							cls: 'x-check-group-alt',
							items: [
								{ boxLabel: '월', name: 'Monday', inputValue: 'Monday' },
								{ boxLabel: '화', name: 'Tuesday', inputValue: 'Tuesday' },
								{ boxLabel: '수', name: 'Wednesday', inputValue: 'Wednesday' },
								{ boxLabel: '목', name: 'Thursday', inputValue: 'Thursday' },
								{ boxLabel: '금', name: 'Friday', inputValue: 'Friday' }
							]
						}, 
						{
							xtype: 'timefield',
							id: 'start_time',
							name: 'start_time',
							fieldLabel:'시작시간',
							increment: 1,
							format: 'H:i',
							// fieldStyle: 'background-color: #ddd; background-image: none;',
							anchor:'100%',
						}, 
						{
							xtype: 'timefield',
							id: 'end_time',
							name: 'end_time',
							increment: 1,
							fieldLabel:'종료시간',
							// fieldStyle: 'background-color: #ddd; background-image: none;',
							anchor:'100%',
							format: 'H:i',
						}, 
					
						
					
					
					]
			});

			var win = Ext.create('ModalWindow', {
				title: '업무 등록',
				width: 500,
				height: 350,
				minWidth: 250,
				minHeight: 180,
				items: form,
				buttons: [{
					text: CMD_OK,
					handler: function(btn){
						if(btn == 'no') {
							win.close();
						} else {
							// var po_no = Ext.getCmp('po_no').getValue();
							// var wa_code = Ext.getCmp('wa_code').getValue();
							// console_logs('==po_no', po_no);
							// console_logs('==wa_code', wa_code);
							var repeated_day = [];

							var form = gu.getCmp('TaskCreatePanel').getForm();
							var val = form.getValues(false);
							if(val['Monday'] != null){
								repeated_day.push(val['Monday']);
							}
							if(val['Tuesday'] != null){
								repeated_day.push(val['Tuesday']);
							}
							if(val['Wednesday'] != null){
								repeated_day.push(val['Wednesday']);
							}
							if(val['Thursday'] != null){
								repeated_day.push(val['Thursday']);
							}
							if(val['Friday'] != null){
								repeated_day.push(val['Friday']);
							}

							// return;
							Ext.Ajax.request({
							url: CONTEXT_PATH + '/statistics/task.do?method=createWorkTask',
							contentType: 'application/json',
							params: {
								owner_uid : vCUR_USER_UID ,
								receiver_uid: val['receiver_uid'],
								task_link: val['task_link'],
								task_contents : val['task_contents'],
								dept_code : vCUR_DEPT_CODE,
								repeated_day : repeated_day,
								start_time :val['start_time'],
								end_time : val['end_time']
								

							},
							success: function(result, request) {
								gm.me().store.load();
								if(win) {
									win.close();
								}
							}, // endofsuccess
							failure: extjsUtil.failureMessage
						}); // endofajax
						}
						
					}
				}, {
						text: CMD_CANCEL,
						handler: function(btn) {
							win.close();
						}
					}]
			});
			win.show();
		}//handler end...
		
	}),

	taskModifyAction : Ext.create('Ext.Action', {
		iconCls: 'mfglabs-retweet_14_0_5395c4_none',
		text: '업무 수정',
		tooltip: '업무 수정',
		disabled: true,
		handler: function() {
			
			gm.me().receiverStore.load();
			gm.me().taskLinkStore.load();
			var selections = gm.me().grid.getSelectionModel().getSelection();
			var rec = gm.me().grid.getSelectionModel().getSelection()[0];
			var po_no = selections[0].get('po_no');
			console_logs("1111111", rec);
		    var aaa = Ext.getVersion().version;
			console_logs("1111111", aaa);
			

			var form = Ext.create('Ext.form.Panel', {
				id: gu.id('TaskUpdatePanel'),
				xtype: 'form',
				frame: false ,
				border: false,
				bodyPadding: '10 10 10 10',
				region: 'center',
				fieldDefaults: {
					// labelAlign: 'right',
					msgTarget: 'side'
				},
				defaults: {
					anchor: '100%',
					//labelWidth: 60,
					margins: 10,
					
				},
					items: [
						// {
						// 	xtype: 'radiogroup',
						// 	fieldLabel: '업무구분',
						// 	// Arrange radio buttons into two columns, distributed vertically
						// 	columns: 3,
						// 	vertical: true,
						// 	items: [
						// 		{ boxLabel: '개인업무', name: 'task_type', inputValue: 'M', checked: true },
						// 		{ boxLabel: '팀업무', name: 'task_type', inputValue: 'T'},
						// 		{ boxLabel: '회사업무', name: 'task_type', inputValue: 'A' },
						// 	]
						// },
						
						{
							xtype: 'combo',
							id: 'receiver_uid',
							name: 'receiver_uid',
							editable: true,
							fieldLabel:'담당자',
							store : gm.me().receiverStore,
							displayField: 'user_name',
                            valueField: 'unique_id',
							value: rec.get('receiver_uid'),
                            listConfig: {
                                getInnerTpl: function() {
                                    return '<div data-qtip="{dept_name}"><small><font color=blue>{user_name}</font></small></div>';
                                }
                            },
							// fieldStyle: 'background-color: #ddd; background-image: none;',
							anchor:'100%',
							
						}, 
					
						{
							xtype: 'textarea',
							id: 'task_contents',
							name: 'task_contents',
							fieldLabel:'업무내용',
							// fieldStyle: 'background-color: #ddd; background-image: none;',
							anchor:'100%',
							value: rec.get('task_contents')
						}, 
						// {
						// 	xtype: 'textarea',
						// 	id: 'test',
						// 	name: 'test',
						// 	fieldLabel:'테스트',
						// 	// fieldStyle: 'background-color: #ddd; background-image: none;',
						// 	anchor:'100%',
						// 	value: rec.get('unique_id')
						// }, 
						{
							xtype: 'combo',
							id: 'task_link',
							name: 'task_link',
							store : gm.me().taskLinkStore,
							fieldLabel:'업무메뉴설정',
							displayField: 'display_name_ko',
                            valueField: 'menu_full_code',
							// fieldStyle: 'background-color: #ddd; background-image: none;',
							anchor:'100%',
							value: rec.get('task_link'),
							listConfig: {
                                getInnerTpl: function() {
                                    return '<div data-qtip="{menu_key}"><small><font color=blue>{display_name_ko}</font></small></div>';
                                }
                            },
						},  
						{
							// Use the default, automatic layout to distribute the controls evenly
							// across a single row
							xtype: 'checkboxgroup',
							fieldLabel: '반복 요일',
							id: 'week',
							cls: 'x-check-group-alt',
							items: [
								{ boxLabel: '월', name: 'Monday', inputValue: 'Monday' /*,hideLabel: true, checked: true*/},
								{ boxLabel: '화', name: 'Tuesday', inputValue: 'Tuesday' },
								{ boxLabel: '수', name: 'Wednesday', inputValue: 'Wednesday' },
								{ boxLabel: '목', name: 'Thursday', inputValue: 'Thursday' },
								{ boxLabel: '금', name: 'Friday', inputValue: 'Friday' }
							]
						}, 
						{
							xtype: 'timefield',
							id: 'start_time',
							name: 'start_time',
							fieldLabel:'시작시간',
							increment: 1,
							// fieldStyle: 'background-color: #ddd; background-image: none;',
							anchor:'100%',
							value: rec.get('start_time')
						}, 
						{
							xtype: 'timefield',
							id: 'end_time',
							name: 'end_time',
							fieldLabel:'종료시간',
							increment: 1,
							// fieldStyle: 'background-color: #ddd; background-image: none;',
							anchor:'100%',
							value: rec.get('end_time')
						}, 
					],
				
			});
			
			// console_logs('333333333', rec.get('repeated_day'));

			var arrRepeated_days = new Array();
			arrRepeated_days = rec.get('repeated_day_ko').split(",");

			// console_logs('44444444444', arrRepeated_days);
			// console_logs('5555555555555555', rec.get('repeated_day').indexOf("Tuesday"));
			// console_logs('666666666666666666', rec.get('repeated_day').indexOf("Monday"));

			var week_boolean1 = false;
			var week_boolean2 = false;
			var week_boolean3 = false;
			var week_boolean4 = false;
			var week_boolean5 = false;

			if(rec.get('repeated_day').indexOf("월")>=0) {
				week_boolean1 = true;
			} 
			if(rec.get('repeated_day').indexOf("화")>=0) {
				week_boolean2 = true;
			}
			if(rec.get('repeated_day').indexOf("수")>=0) {
				week_boolean3 = true;
			} 
			if(rec.get('repeated_day').indexOf("목")>=0) {
				week_boolean4 = true;
			} 
			if(rec.get('repeated_day').indexOf("금")>=0) {
				week_boolean5 = true;
			} 

			Ext.getCmp("week").setValue({Monday: week_boolean1, Tuesday: week_boolean2, Wednesday: week_boolean3, Thursday: week_boolean4, Friday: week_boolean5})
			

			// Ext.getCmp("week").setValue({Friday: true, Monday: true, Tuesday:true})
				

			var win = Ext.create('ModalWindow', {
				title: '업무 수정',
				width: 500,
				height: 350,
				minWidth: 250,
				minHeight: 180,
				items: form,
				buttons: [{
					text: CMD_OK,
					handler: function(btn){
						if(btn == 'no') {
							win.close();
						} else {
							// var po_no = Ext.getCmp('po_no').getValue();
							// var wa_code = Ext.getCmp('wa_code').getValue();
							// console_logs('==po_no', po_no);
							// console_logs('==wa_code', wa_code);
							var repeated_day = [];

							var form = gu.getCmp('TaskUpdatePanel').getForm();
							var val = form.getValues(false);
							if(val['Monday'] != null){
								repeated_day.push(val['Monday']);
							}
							if(val['Tuesday'] != null){
								repeated_day.push(val['Tuesday']);
							}
							if(val['Wednesday'] != null){
								repeated_day.push(val['Wednesday']);
							}
							if(val['Thursday'] != null){
								repeated_day.push(val['Thursday']);
							}
							if(val['Friday'] != null){
								repeated_day.push(val['Friday']);
							}

							// return;
							Ext.Ajax.request({
							url: CONTEXT_PATH + '/statistics/task.do?method=updateWorkTask',
							contentType: 'application/json',
							params: {
								unique_id : rec.get('unique_id'),
								receiver_uid: val['receiver_uid'],
								task_link: val['task_link'],
								task_contents : val['task_contents'],
								dept_code : vCUR_DEPT_CODE,
								repeated_day : repeated_day,
								start_time : val['start_time'],
								end_time : val['end_time']
								

							},
							success: function(result, request) {
								gm.me().store.load();
								if(win) {
									win.close();
								}
							}, // endofsuccess
							failure: extjsUtil.failureMessage
						}); // endofajax
						}
						
					}
				}, {
						text: CMD_CANCEL,
						handler: function(btn) {
							win.close();
						}
					}]
			});
			win.show();
		}//handler end...
		
	}),
	receiverStore: Ext.create('Rfx2.store.company.sejun.UsrAstStore', {limit :100, deptCode:vCUR_DEPT_CODE,sr_admin_flag:vCUR_SR_ADMIN_FLAG}),
    taskLinkStore: Ext.create('Mplm.store.MenuObjectLineStore', {})
	
});
