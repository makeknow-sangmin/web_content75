Ext.define('Rfx2.view.company.tosimbio.currentSituation.TempHumidityView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'board-view',
    initComponent: function () {

        this.setDefValue('board_email', /*GLOBAL*/vCUR_EMAIL);
        this.setDefValue('user_id', /*GLOBAL*/vCUR_USER_ID);
        this.setDefValue('board_name', /*GLOBAL*/vCUR_USER_NAME);
        this.setDefValue('board_count', 0); //Hidden Value임.
        this.setDefComboValue('gubun', 'valueField', '0');//ComboBOX의 ValueField 기준으로 디폴트 설정.

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        this.addSearchField({
            type: 'dateRange',
            field_id: 'create_date',
            width: 400,
            text: '등록시간',
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
        });


        this.addSearchField(
            {
                xtype: 'combo'
                , field_id: 'gubun'
                , store: "MonthStore"
                , params: {parentCode: 'TEMP_HUMIDITY'}
                , displayField: 'codeName'
                , valueField: 'systemCode'
                , emptyText: '구분'
                , innerTpl: '<div data-qtip="{systemCode}">{codeName}</div>'
                , minChars: 2
            });


        this.addSearchField(
            {
                xtype: 'combo'
                , field_id: 'location'
                , store: "MonthStore"
                , params: {parentCode: 'LOCATION'}
                , displayField: 'codeName'
                , valueField: 'systemCode'
                , emptyText: '위치'
                , innerTpl: '<div data-qtip="{systemCode}">{codeName}</div>'
                , minChars: 2
            });


        // this.addSearchField (
        // 	{
        // 				 xtype: 'combo'
        // 				,field_id: 'month_field'
        // 				,store: "MonthStore"
        // 				,params:{parentCode: 'MONTH'}
        // 				,displayField: 'codeName'
        // 				,valueField: 'systemCode'
        // 				,emptyText: '적용월'
        // 				,innerTpl : '<div data-qtip="{systemCode}">{codeName}</div>'
        // 				,minChars: 2
        // });
        // this.addSearchField('item_name');
        // this.addSearchField('board_title');
        // this.addSearchField('board_content');
        // this.addSearchField('board_name');
        // this.addSearchField('user_id');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        // (buttonToolbar.items).each(function (item, index, length) {
        //     switch (index) {
        //         case 1:
        //         case 2:
        //         case 3:
        //         case 4:
        //         case 5:
        //             buttonToolbar.items.remove(item);
        //             break;
        //         default:
        //             break;
        //     }
        // });

        var buttonToolbar = this.createCommandToolbar(
			{REMOVE_BUTTONS: [
			'REGIST', 'COPY',/* 'REMOVE',*/ 'EDIT', 'VIEW'
			],
			}
		);


        buttonToolbar.insert(1, this.environmentCreateAction/* 액션1 */);
        buttonToolbar.insert(1, /* 액션2 */);

        //모델 정의
        this.createStore('Rfx.model.TempHumidity', [{
                property: 'create_date',
                direction: 'DESC'
            }],
            /*pageSize*/
            gMain.pageSize
            //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
            //Orderby list key change
            //ordery create_date -> p.create로 변경.
            , {
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
            , ['']
        );

        //그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);

        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });


        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function (records) {
        });
        this.loadStoreAlways = true;

    },
    items: [],

    
        environmentCreateAction : Ext.create('Ext.Action', {
		iconCls: 'mfglabs-retweet_14_0_5395c4_none',
		text: '설비 온/습도 등록',
		tooltip: '설비 온/습도 등록',
		disabled: false,
		handler: function() {

			var form = Ext.create('Ext.form.Panel', {
					id: gu.id('environmentCreatePanel'),
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
							id: 'pcsmchn',
							name: 'pcsmchn',
							editable: false,
							fieldLabel:'설비위치',
							store : Ext.create('Rfx2.store.company.tosimbio.EnvironmentStore', {limit :10}),
							displayField: 'machine',
                            valueField: 'machine',
                            listConfig: {
                                getInnerTpl: function() {
                                    return '<div data-qtip="{machine}"><small><font color=blue>{machine}</font></small></div>';
                                }
                            },
							// fieldStyle: 'background-color: #ddd; background-image: none;',
							anchor:'100%',
						}, 
						
                        {
                            xtype: 'radiogroup',
                            fieldLabel: '구분',
                            margin: '0 5 0 5',
                            width: 200,
                            allowBlank: false,
                            items: [
                                {boxLabel: '온도', name: 'temperature', inputValue: 'temperature', checked: true}
                                ,{boxLabel: '습도', name: 'humidity', inputValue: 'humidity'},
                            ]

                        },
                        {
							xtype: 'textarea',
							id: 'envir',
							name: 'envir',
							fieldLabel:'값',
							// fieldStyle: 'background-color: #ddd; background-image: none;',
							anchor:'100%',
						}, 
						// {
						// 	xtype: 'combo',
						// 	id: 'task_link',
						// 	name: 'task_link',
						// 	store : Ext.create('Mplm.store.MenuObjectLineStore', {}),
						// 	fieldLabel:'업무메뉴설정',
						// 	displayField: 'display_name_ko',
                        //     valueField: 'menu_full_code',
						// 	// fieldStyle: 'background-color: #ddd; background-image: none;',
						// 	anchor:'100%',
						// 	listConfig: {
                        //         getInnerTpl: function() {
                        //             return '<div data-qtip="{menu_key}"><small><font color=blue>{display_name_ko}</font></small></div>';
                        //         }
                        //     },
						// },  

						
						
						// {
						// 	// Use the default, automatic layout to distribute the controls evenly
						// 	// across a single row
						// 	xtype: 'checkboxgroup',
						// 	fieldLabel: '반복 요일',
						// 	cls: 'x-check-group-alt',
						// 	items: [
						// 		{ boxLabel: '월', name: 'Monday', inputValue: 'Monday' },
						// 		{ boxLabel: '화', name: 'Tuesday', inputValue: 'Tuesday' },
						// 		{ boxLabel: '수', name: 'Wednesday', inputValue: 'Wednesday' },
						// 		{ boxLabel: '목', name: 'Thursday', inputValue: 'Thursday' },
						// 		{ boxLabel: '금', name: 'Friday', inputValue: 'Friday' }
						// 	]
						// }, 
					
						
					
					
					]
			});

			var win = Ext.create('ModalWindow', {
				title: '업무 등록',
				width: 500,
				height: 320,
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










    // itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
    // 	//console_logs('boardview itemdblclick record', record);

    // 	Rfx.model.Board.load(record.get('unique_id'), {
    // 	    success: function(board) {
    //         	console_logs('board', board);
    // 	    	var form = gm.me().createViewForm(board);
    // 	    	var win = Ext.create('ModalWindow', {
    // 	            title: gm.me().getMC('CMD_VIEW_DTL','상세보기'),
    // 	            width: 700,
    // 	            height: 530,
    // 	            minWidth: 250,
    // 	            minHeight: 180,
    // 	            layout: 'absolute',
    // 	            plain:true,
    // 	            items: form,
    // 	            buttons: [{
    // 	                text: CMD_OK,
    // 	            	handler: function(){
    // 	                       	if(win) 
    // 	                       	{
    // 	                       		win.close();
    // 	                       	} 
    // 	                  }
    // 	            }]
    // 	        });
    // 	    	win.show();
    // 	    }
    // 	});


    // },
//     createViewForm: function (board) {
//     	//Ext.MessageBox.alert('Find Board', "unique_id : " + board.get('unique_id'));
//     	console_logs('board', board);
// //    	var lineGap = 30;
//      	var unique_id = board.get('unique_id');
//     	var user_id = board.get('user_id');
//     	var board_email = board.get('board_email'  );
//     	var board_title = board.get('board_title' );
//     	var board_content = board.get('board_content' );
//     	var htmlFileNames = board.get('htmlFileNames' );
//     	var fileQty = board.get('fileQty' );
//     	var form = Ext.create('Ext.form.Panel', {
//             defaultType: 'displayfield',
//             bodyPadding: 3,
//             height: 650,
//             defaults: {
//                 anchor: '100%',
//                 allowBlank: false,
//                 msgTarget: 'side',
//                 labelWidth: 60
//             },
//             items: [{
// 	    			fieldLabel: '등록자',
// 	    			value: user_id + '(' + board_email + ')'
//     		    },{
//     		    	fieldLabel: gm.getColName('board_title'),
//     		    	value: board_title,
//     		    	name: 'board_title'
//     		    },{
//     		    	fieldLabel: '첨부파일',
//     		    	value: htmlFileNames
//     		    },{
//                     value: board_content,
//                     xtype:          'textarea',
//                     fieldStyle: 'overflow:scroll ;overflow-x:hidden; background-color: #F0F0F0; background-image: none;border-bottom: #999999 1px solid;border-left: #999999 1px solid;border-right: #999999 1px solid;border-top: #999999 1px solid;',
//                     height: 340,
//                     readOnly: true,
//                     anchor: '100%'
//                 }  
//     		    ]
//         }); //endof form


//     	return form;
//     }
});
