/**
 * This example shows how to create a grid from Array data. The grid is stateful so you
 * can move or hide columns, reload the page, and come back to the grid in the same state
 * you left it in.
 *
 * The cells are selectable due to use of the `enableTextSelection` option.
 */
Ext.define('Rfx.view.criterionInfo.HEAVY5_BusinessTeam', {
    extend: 'Rfx.base.BaseView',
    xtype: 'businessteam-view',
    initComponent: function(){
    	
    	//this.initDefValue();
		
    	//생성시 디폴트 값.

		//검색툴바 필드 초기화
		this.initSearchField();
		
		this.addSearchField({
            type: 'dateRange',
            field_id: 'create_date',
            text: "요청기간",
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
		});

    	//검색툴바 추가
		this.addSearchField('pj_code');
//		this.addSearchField('state');
		this.addSearchField('item_abst');
		this.addSearchField('po_no');

		this.createStore('Rfx.model.WorkDailyHistory', [{
			property: 'unique_id',
			direction: 'DESC'
		}],
		gMain.pageSize
		,{
			creator: 'a.creator',
			unique_id: 'a.unique_id'
		}
		// 삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
		, ['rtgast']
		);

		this.store.getProxy().setExtraParam('user_type', 'TEAM');

		this.store.load();

		Ext.each(this.columns, function(columnObj, index) {
		var dataIndex = columnObj["dataIndex"];
		// console_logs('===columnObj', columnObj);
		var qty = 0;
		switch (dataIndex) {
            case 'state':
                columnObj["renderer"] = function(value, meta) {
					meta.css = 'custom-column';
					switch(value) {
						case 'I':
						return '1차 결재중';
						case 'S':
						return '2차 결재중';
						case 'R':
						return '최종 결재중';
						case 'A':
						return '결재완료';
						case 'D':
						return '반려됨';
						default:
						break;
					}
                    return value;
                }
                break;
            default:
            break;
		}
    });
		
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		//명령툴바 생성	
		// var buttonToolbar = this.createCommandToolbar();
		var buttonToolbar = this.createCommandToolbar({
        		REMOVE_BUTTONS : [
        		        	        'REGIST','COPY', 'REMOVE', 'SEARCH', 'EDIT'
        			]		
		});
				
		// buttonToolbar.insert(1, this.addAction);
		buttonToolbar.insert(0, this.checkAction);
		buttonToolbar.insert(1, this.confirmLogAction);
		buttonToolbar.insert(2, this.returnLogAction);

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


        this.callParent(arguments);
        
        //디폴트 로드
		gMain.setCenterLoading(false);
		
		this.grid.getSelectionModel().on({
			selectionchange:function(sm,selections) {
				if(selections.length > 0) {
					gm.me().confirmLogAction.enable();
					gm.me().returnLogAction.enable();
				} else {
					gm.me().confirmLogAction.disable();
					gm.me().returnLogAction.disable();
				}
			}
		});
  
	},

	returnLogAction: Ext.create('Ext.Action', {
        itemId: 'returnLogAction',
        iconCls: 'mfglabs-retweet_14_0_5395c4_none',
        disabled: true,
        text: '결재반려',
        handler: function(widget, event) {
			gm.me().returnLog();
		}
	}),

	returnLog:function() {

		var rec = gm.me().grid.getSelectionModel().getSelection()[0];
		console_logs('===rec', rec);

		var pj_name = rec.get('pj_name') == null || rec.get('pj_name') == undefined ? 
			'' : rec.get('pj_name');

		var reserved_varchar5 = rec.get('reserved_varchar5') == null || rec.get('reserved_varchar5') == undefined ?
				'' : rec.get('reserved_varchar5');

		var reserved_varcharb = rec.get('reserved_varcharb') == null || rec.get('reserved_varcharb') == undefined ?
				'' : rec.get('reserved_varcharb');

		var form = Ext.create('Ext.form.Panel', {
			id: gu.id('formPanelReturn'),
			xtype: 'form',
    		frame: false ,
    		border: false,
    		bodyPadding: '3 3 0',
    		region: 'center',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            defaults: {
                anchor: '100%',
                labelWidth: 100,
                margins: 10,
			},
			// defaults: {
			//     layout: 'form',
			//     xtype: 'container',
			//     defaultType: 'textfield',
			//     style: 'width: 100%'
			// },
			items: [
				new Ext.form.Hidden({
					name: 'rtgast_uids',
					value: rec.get('unique_id_long')
				}),
				new Ext.form.Hidden({
					name: 'type',
					value: 'return'
				}),
				new Ext.form.Hidden({
					name: 'rtg_type',
					value: 'WD' // 업무일지 rtg_type
				}),
				new Ext.form.Hidden({
					name: 'user_uid',
					value: vCUR_USER_UID
				}),
				new Ext.form.Hidden({
					name: 'user_id',
					value: vCUR_USER_ID
				}),
			{
				fieldLabel: '사용자',
				xtype: 'textfield',
				id: 'user_name',
				name: 'user_name',
				anchor: '40%',
				width: 200,
				readOnly: true,
				value:rec.get('creator'),
				editable: false,
				fieldStyle: 'background-color: #EAEAEA; background-image: none;'
			},
			{
				fieldLabel: '프로젝트',
				xtype:'textfield',
				id:'pj_uid',
				name: 'pj_uid',
				anchor: '40%',
				emptyText: '선택해주세요.',
				value: pj_name,
				editable: false
			},{
				fieldLabel: '금일업무',
				xtype: 'textarea',
				rows: 1,
				anchor: '90%',
				id: 'to_task',
				name: 'to_task',
				editable: false,
				height:170,
				value:rec.get('reserved_varchar1')
			}
			// ,{
			// 	fieldLabel: '건의사항',
			// 	xtype: 'textarea',
			// 	rows: 1,
			// 	anchor: '90%',
			// 	id: 'to_comment',
			// 	name: 'to_comment',
			// 	editable: false,
			// 	height:120,
			// 	value:rec.get('reserved_varchar2')
			// }
			,{
				fieldLabel: '내일업무',
				xtype: 'textarea',
				rows: 1,
				anchor: '90%',
				id: 'next_task',
				name: 'next_task',
				editable: false,
				height:130,
				value:rec.get('reserved_varchar3')
			},{
				fieldLabel: '건의사항',
				xtype: 'textarea',
				rows: 2,
				anchor: '90%',
				id: 'next_comment',
				name: 'next_comment',
				editable: false,
				height:120,
				value:rec.get('reserved_varchar4')
			}, {
				fieldLabel: '추가요청 사항',
				labelWidth: 100,
				xtype: 'textarea',
				rows: 2,
				anchor: '90%',
				id: 'add_request',
				name: 'add_request',
				height:120,
				value: reserved_varchar5
			}, {
					fieldLabel: '대표님 코멘트',
					labelWidth: 100,
					height:120,
					xtype: 'textarea',
					rows: 1,
					anchor: '90%',
					id: 'reserved_varcharb',
					name: 'reserved_varcharb',
					readOnly: true,
					fieldStyle: 'background-color: #EAEAEA; background-image: none;',
					value: reserved_varcharb
				}
		]
		});

		myHeight = 900;
		myWidth = 1200;
			
		var prWin =	Ext.create('Ext.Window', {
			modal : true,
			title: '결재반려',
			width: myWidth,
			height: myHeight,	
			plain:true,
			items: form,
			buttons: [{
				text: CMD_OK,
				handler: function(btn){
					console_logs('===btn', btn);
					if(btn == 'no') {
						prWin.close();
					} else {
						var selections = gm.me().grid.getSelectionModel().getSelection();
						if(selections == null || selections.length < 1) {
							Ext.MessageBox.alert(error_msg_prompt, '선택한 일지가 없습니다.');
							return;
						} else {
							var ids = [];
							for(var i=0; i<selections.length; i++) {
								var rec = selections[i];
								if(rec.get('state') == 'A') {
									Ext.MessageBox.alert(error_msg_prompt, '이미 결재완료된 일지가 있습니다.');
									return;
								}
								ids.push(rec.get('unique_id_long'));
							}

							var form = gu.getCmp('formPanelReturn').getForm();

							if(form.isValid()) {
								var val = form.getValues(false);

									Ext.Ajax.request({
									url: CONTEXT_PATH + '/production/schdule.do?method=confirmWorkLog',
									params: val,
									success: function(result, request) {
										gm.me().store.load();
										prWin.close();
									},
									failure: extjsUtil.failureMessage
								});
							}
						}
					}
							}//btn handler
					},{
						text: CMD_CANCEL,
						handler: function(){
							if(prWin) {
								
								prWin.close();
								
							}
						}
					}]
		});
		prWin.show();
	},
	
	confirmLogAction: Ext.create('Ext.Action', {
        itemId: 'confirmLogAction',
        iconCls: 'af-plus-circle',
        disabled: true,
        text: '결재확인',
        handler: function(widget, event) {
			Ext.MessageBox.show({
				title: '확인',
				msg: '해당 일지를 결재완료 하시겠습니까?',
				buttons: Ext.MessageBox.YESNO,
				fn: gm.me().confirmLog,
				icon: Ext.MessageBox.QUESTION
			});
		}
	}),

	confirmLog: function(result) {
		
		if(result == 'yes') {
			var selections = gm.me().grid.getSelectionModel().getSelection();
			if(selections == null || selections.length < 1) {
				Ext.MessageBox.alert(error_msg_prompt, '선택한 일지가 없습니다.');
				return;
			} else {
				var ids = [];
				for(var i=0; i<selections.length; i++) {
					var rec = selections[i];
					if(rec.get('state') == 'A' || rec.get('state') == 'R') {
						Ext.MessageBox.alert(error_msg_prompt, '이미 결재완료되었거나 대표님 결재 진행중인 일지가 있습니다.');
						return;
					}
					ids.push(rec.get('unique_id_long'));
				}

				Ext.Ajax.request({
                    url: CONTEXT_PATH + '/production/schdule.do?method=confirmWorkLog',
                    params: {
						rtgast_uids : ids,
						state : 'S'
					},
                    success: function(result, request) {
                        gm.me().store.load();
                    },
                    failure: extjsUtil.failureMessage
                });
			}
		}
	},

    items : [],
    itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
    	//console_logs('boardview itemdblclick record', record);
    	  	
    	var form = gm.me().createViewForm();
		var win = Ext.create('ModalWindow', {
			title: gm.me().getMC('CMD_VIEW_DTL','상세보기'),
			width: 1200,
			height: 900,
			minWidth: 250,
			minHeight: 180,
			layout: 'absolute',
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
    	
    	
	},

	checkAction : Ext.create('Ext.Action', {
		iconCls: 'af-search',
		text: CMD_SEARCH/*'검색'*/,
		tooltip: '조건 검색',
		handler: function() {
			var s_date = gm.me().link + '-' + 'srchCreate_date' + '-s';
			var e_date = gm.me().link + '-' + 'srchCreate_date' + '-e';
			var s = Ext.getCmp(s_date).getValue();
			var e = Ext.getCmp(e_date).getValue();
			s = Ext.Date.format(s, 'Y-m-d');
			e = Ext.Date.format(e, 'Y-m-d');
			gm.me().store.getProxy().setExtraParam('user_type', 'TEAM');
			gm.me().store.getProxy().setExtraParam('create_date', s + ':' + e);
			gm.me().store.load();
		}
	}),
	
	addAction: Ext.create('Ext.Action', {
        iconCls: 'af-edit',
        text: '신규 생성',
        tooltip: '신규 생성',
        toggleGroup: 'toolbarcmd',
        disabled: false,
        handler: function() {
            gm.me().addBusinessLog();
        }
	}),
	
	addBusinessLog: function() {
		var form = null;
		
		var pjStore = Ext.create('Mplm.store.PjCode', {hasNull: false});

		form = Ext.create('Ext.form.Panel', {
	    	id: gu.id('formPanel'),
	    	xtype: 'form',
    		frame: false ,
    		border: false,
    		bodyPadding: '3 3 0',
    		region: 'center',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            defaults: {
                anchor: '100%',
                labelWidth: 100,
                margins: 10,
			},
			items: [
				new Ext.form.Hidden({
					name: 'rtg_type',
					value: 'WD' // 업무일지 rtg_type
				}),
				new Ext.form.Hidden({
					name: 'user_uid',
					value: vCUR_USER_UID
				}),
				new Ext.form.Hidden({
					name: 'user_id',
					value: vCUR_USER_ID
				}),
				{
				xtype: 'datefield',
				anchor: '40%',
				fieldLabel: '날짜',
				name: 'to_date',
				value: new Date()
			},{
				fieldLabel: '사용자',
				xtype: 'textfield',
				id: 'user_name',
				name: 'user_name',
				anchor: '40%',
				width: 200,
				readOnly: true,
				value:vCUR_USER_NAME,
				fieldStyle: 'background-color: #EAEAEA; background-image: none;'
			},
			{
				fieldLabel: '프로젝트',
				xtype:'combo',
				store: pjStore,
				id:'pj_uid',
				name: 'pj_uid',
				anchor: '60%',
				valueField: 'unique_id',
				displayField: 'pj_code',
				emptyText: '선택해주세요.',
				listConfig: {
					loadingText: '검색중...',
					emptyText: '일치하는 항목 없음',
					getInnerTpl: function() {
						return '<div data-qtip="{unique_id}">{pj_code}</div>';
					}
				}
			},{
				fieldLabel: '금일업무',
				xtype: 'textarea',
				rows: 1,
				anchor: '90%',
				id: 'to_task',
				name: 'to_task'
			},{
				fieldLabel: '건의사항',
				xtype: 'textarea',
				rows: 1,
				anchor: '90%',
				id: 'to_comment',
				name: 'to_comment',
				width: 200
			},{
				fieldLabel: '내일업무',
				xtype: 'textarea',
				rows: 1,
				anchor: '90%',
				id: 'next_task',
				name: 'next_task',
				width: 200
			},{
				fieldLabel: '건의사항',
				xtype: 'textarea',
				rows: 2,
				anchor: '90%',
				id: 'next_comment',
				name: 'next_comment',
				width: 200
			},{
				fieldLabel: '대표님 코멘트',
				labelWidth: 100,
				xtype: 'textarea',
				rows: 2,
				anchor: '90%',
				id: 'reserved_varcharb',
				name: 'reserved_varcharb',
				editable: false,
				width: 200,
				value: reserved_varcharb
			}
		]
		});

		myHeight = 450;
	    myWidth = 600;

		var prWin =	Ext.create('Ext.Window', {
			modal : true,
			title: '업무일지 등록',
			width: myWidth,
			
			height: myHeight,	
			plain:true,
			items: form,
			buttons: [{
				text: CMD_OK,
				handler: function(btn){
					var msg = '추가하겠습니까?'
						var myTitle = '업무일지 추가';
						Ext.MessageBox.show({
							title: myTitle,
							msg: msg,
							buttons: Ext.MessageBox.YESNO,
							icon: Ext.MessageBox.QUESTION,
							fn: function(btn) {
								var form = gu.getCmp('formPanel').getForm();
								
	//                        	gMain.selPanel.vSELECTED_STEP_UID//stepuid
	//                        	gMain.selPanel.vSELECTED_STEP_STAT //step 진행상태
								if(btn == "no"){
									prWin.close();
								}else{
								if(form.isValid()){	
								var val = form.getValues(false);
								console_logs('val', val);
								Ext.Ajax.request({
									url: CONTEXT_PATH + '/production/schdule.do?method=addWorkDailyHistory',
									params:val,
									success : function(result, request) {  
										prWin.close(); 
										gMain.selPanel.store.load();
									},
									failure: extjsUtil.failureMessage
								});
								
												
									
								}  // end of formvalid 
							}
						}//fn function(btn)
							
						});//show
				}//btn handler
			},{
				text: CMD_CANCEL,
				handler: function(){
					if(prWin) {
						
						prWin.close();
						
					}
				}
			}]
		});
		prWin.show();
	},

    createViewForm: function () {
		
		var selections = gm.me().grid.getSelectionModel().getSelection();
		
		 var unique_id = selections[0].get('unique_id_long');
		 var user_name = selections[0].get('creator');
    	var reserved_varchar1 = selections[0].get('reserved_varchar1');
		var reserved_varchar2 = selections[0].get('reserved_varchar2');
		var reserved_varchar3 = selections[0].get('reserved_varchar3');
		var reserved_varchar4 = selections[0].get('reserved_varchar4');
		var reserved_varchar5 = selections[0].get('reserved_varchar5');
		var reserved_varcharb = selections[0].get('reserved_varcharb');
		var pj_code = selections[0].get('pj_code');
		
    	var form = Ext.create('Ext.form.Panel', {
            defaultType: 'displayfield',
            bodyPadding: 3,
            height: 1200,
            defaults: {
                anchor: '100%',
                allowBlank: false,
                msgTarget: 'side',
                labelWidth: 60
            },
            items: [
				{
					fieldLabel: '이름',
					labelWidth: 100,
					xtype: 'textfield',
					value: user_name,
					anchor: '30%',
					fieldStyle: 'background-color: #EAEAEA; background-image: none;',
					readOnly: true
				},{
					fieldLabel: gm.getColName('pj_code'),
					xtype: 'textfield',
					labelWidth: 100,
    		    	value: pj_code,
					name: 'pj_code',
					anchor: '30%',
					fieldStyle: 'background-color: #EAEAEA; background-image: none;',
					readOnly: true
    		    },{
					fieldLabel: gm.getColName('reserved_varchar1'),
					xtype: 'textarea',
					labelWidth: 100,
					rows: 1,
					height:200,
					anchor: '90%',
					value: reserved_varchar1,
					labelWidth: 100,
					name: 'reserved_varchar1',
					fieldStyle: 'background-color: #EAEAEA; background-image: none;',
					readOnly: true
				}
				// ,{
				// 	fieldLabel: gm.getColName('reserved_varchar2'),
				// 	labelWidth: 100,
				// 	xtype: 'textarea',
				// 	value: reserved_varchar2,
				// 	rows: 1,
				// 	height:120,
				// 	anchor: '90%',
				// 	name: 'reserved_varchar2',
				// 	fieldStyle: 'background-color: #EAEAEA; background-image: none;',
				// 	readOnly: true
				// }
				,{
					fieldLabel: gm.getColName('reserved_varchar3'),
					labelWidth: 100,
					xtype: 'textarea',
					value: reserved_varchar3,
					rows: 1,
					height:130,
					anchor: '90%',
					name: 'reserved_varchar3',
					fieldStyle: 'background-color: #EAEAEA; background-image: none;',
					readOnly: true
    		    },{
					fieldLabel: gm.getColName('reserved_varchar4'),
					labelWidth: 100,
					xtype: 'textarea',
					value: reserved_varchar4,
					height:120,		
					rows: 1,
					anchor: '90%',
					name: 'reserved_varchar4',
					fieldStyle: 'background-color: #EAEAEA; background-image: none;',
					readOnly: true
    		    }, {
					fieldLabel: '추가요청 사항',
					labelWidth: 100,
					xtype: 'textarea',
					height:120,
					rows: 1,
					anchor: '90%',
					id: 'add_request',
					name: 'add_request',
					value: reserved_varchar5,
					fieldStyle: 'background-color: #EAEAEA; background-image: none;',
					readOnly: true
				},{
					fieldLabel: '대표님 코멘트',
					labelWidth: 100,
					height:120,
					xtype: 'textarea',
					rows: 1,
					anchor: '90%',
					id: 'reserved_varcharb',
					name: 'reserved_varcharb',
					readOnly: true,
					fieldStyle: 'background-color: #EAEAEA; background-image: none;',
					value: reserved_varcharb
				}
    		    ]
        }); //endof form
    	
    	return form;
    }
});
