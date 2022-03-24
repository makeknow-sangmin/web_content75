//고객사 관리 메뉴
Ext.define('Rfx2.view.criterionInfo.MemberManagementView', {
	extend: 'Rfx.base.BaseView',
	xtype: 'buyer-list-view',
	initComponent: function () {
		//검색툴바 필드 초기화
		this.initSearchField();
		
		this.addSearchField({
			field_id: 'pr_active_flag'
			, store: 'PrActiveFlagStore'
			, displayField: 'codeName'
			, valueField: 'systemCode'
			, innerTpl: '{codeName}'
		});
				
		//    	this.addSearchField('pr_active_flag');
		// this.addSearchField('wa_name');
		// this.addSearchField('biz_no');
		// this.addSearchField('president_name');
		//		this.addSearchField('wa_name_en');
		//1) 회사명 2) 사업자번호 3) 대표자명 4) 영업담당자
		//Readonly Field 정의
		this.initReadonlyField();
		this.addReadonlyField('unique_id');

		//검색툴바 생성
		var searchToolbar = this.createSearchToolbar();
		//명령툴바 생성
		var buttonToolbar = this.createCommandToolbar();
		console_logs('this.fields', this.fields);
		this.createStore('Rfx.model.BuyerList', [{
			property: 'unique_id',
			direction: 'DESC'
		}],
			gMain.pageSize/*pageSize*/, {}
			, ['combst']
		);

		//메인그리드 버튼
		buttonToolbar.items.each(function (item, index, length) {
            if (index == 3 || index == 4) {
                buttonToolbar.items.remove(item);
            }
        })



		var myUsrAst = Ext.create('Rfx.model.UsrAst', {
            fields: this.fields
        });


        this.memberOfCompanyStore = new Ext.data.Store({
            pageSize: 100,
            model: myUsrAst
        });

		//서브그리드 버튼들
		this.addMemberButton = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '회원등록',
            tooltip: '회원등록',
            disabled: false,
            hidden: gu.setCustomBtnHiddenProp('addMemberButton'),
            handler: function () {
                gm.me().addMemberView();
            }
        });

		this.editMemberButton = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-edit',
            text: gm.getMC('CMD_MODIFY', '회원수정'),
            tooltip: '회원수정',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('editMemberButton'),
            handler: function () {
                gm.me().editMemberView();
            }
        });
		
		this.deleteMemberButton = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: gm.getMC('CMD_DELETE', '회원 삭제'),
            tooltip: '회원 삭제',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('deleteMemberButton'),
            handler: function() {
				gm.me().deleteMemberView();
            }
        });


		this.memberGrid = Ext.create('Ext.grid.Panel', {
			cls: 'rfx-panel',
			id: gu.id('memberGrid'),
			store: this.memberOfCompanyStore,
			viewConfig: {
				markDirty: false
			},
			collapsible: false,
			multiSelect: false,
			region: 'center',
			autoScroll: true,
			autoHeight: true,
			flex: 0.5,
			frame: true,
			bbar: getPageToolbar(this.memberOfCompanyStore),
			border: true,
			layout: 'fit',
			forceFit: false,
			selModel: Ext.create("Ext.selection.CheckboxModel", {}),
			margin: '0 0 0 0',
			dockedItems: [
				// BaseView 기본 툴바
				// this.createCommandToolbar(toolbarOptions),
				{
					dock: 'top',
					xtype: 'toolbar',
					items: [
						//버튼 등록, 수정, 삭제 버튼 생성 후 추가
						this.addMemberButton,
						this.editMemberButton,
						this.deleteMemberButton
					]
				}
			],
			columns: [
				{ text: '주소', width: 130, style: 'text-align:center', dataIndex: 'address_1', sortable: false },
				{ text: '부서명', width: 130, style: 'text-align:center', dataIndex: 'dept_name', sortable: false },
				{ text: 'e메일', width: 130, style: 'text-align:center', dataIndex: 'email', sortable: false },
				{ text: '사번', width: 130, style: 'text-align:center', dataIndex: 'emp_no', sortable: false },
				{ text: '내선번호', width: 130, style: 'text-align:center', dataIndex: 'extension_no', sortable: false },
				{ text: '팩스번호', width: 210, style: 'text-align:center', dataIndex: 'fax_no', sortable: false },
				{ text: '휴대폰번호', width: 70, style: 'text-align:center', dataIndex: 'hp_no', sortable: false },
				{ text: '직급', width: 70, style: 'text-align:center', dataIndex: 'position', sortable: false },
				{ text: '전화번호', width: 100, style: 'text-align:center', dataIndex: 'tel_no', sortable: false },
				{ text: '사용자ID', width: 100, style: 'text-align:center', dataIndex: 'login_id', sortable: false },
				{ text: 'unique_id', width: 100, style: 'text-align:center', dataIndex: 'unique_id', sortable: false },
				{ text: '이름', width: 100, style: 'text-align:center', dataIndex: 'user_name', sortable: false },
				{ text: '권한유형', width: 100, style: 'text-align:center', dataIndex: 'user_type', sortable: false },
			],
			title: '회원 목록',
			// name: 'po',
			autoScroll: true
			});
			this.memberGrid.getSelectionModel().on({
				selectionchange: function (sm, selections) {
					if (selections) {
						console_logs('통과했니-------------- : ', selections);
					}
				}
		})

		//grid 생성.
		var arr=[];
		arr.push(searchToolbar, buttonToolbar);
		this.createGrid(arr);
		this.createCrudTab('buyer-list-view');
		Ext.apply(this, {
			layout: 'border',
			items: [
				{
                    collapsible: false,
                    frame: false,
                    region: 'west',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    width: '50%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        items: [this.grid]
                    }]
                }, this.crudTab, this.memberGrid]
		});

		this.setGridOnCallback(function(selections){
            if (selections.length) {
                var rec = selections[0];
                this.memberOfCompanyStore.getProxy().setExtraParams(
                        {
                        	wa_code: rec.get('wa_code')
                        }
                    );
                // 오른쪽 단 스토어 로드
                this.memberOfCompanyStore.load();
                this.addMemberButton.enable();
                this.deleteMemberButton.disable();
                this.editMemberButton.disable();
            } else {
                this.addMemberButton.disable();
            }
        })

		// 서브 그리드 선택 시 
        this.memberGrid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if (selections.length > 0) {
                    gm.me().deleteMemberButton.enable();
                    gm.me().editMemberButton.enable();
                } else {
                    gm.me().deleteMemberButton.disable();
                    gm.me().editMemberButton.disable();
                }
            }
        })
		

        

		this.callParent(arguments);

		//디폴트 로드
		this.store.load(function (records) { });



	},
	items: [],

	addMemberView: function () {
		var form = Ext.create('Ext.form.Panel', {
			id: gu.id('formPanel'),
			xtype: 'form',
			frame: false,
			border: false,
			width: '100%',
			height: '100%',
			bodyPadding: '3 3 0',
			region: 'center',
			layout: 'column',
			fieldDefaults: {
				labelAlign: 'right',
				msgTarget: 'side'
			},
			items: [
				{
					xtype: 'fieldset',
					title: '신규 등록 정보입력',
					id: gu.id('registration'),
					frame: true,
					width: '100%',
					height: '100%',
					layout: 'fit',
					defaults: {
						margin: '2 2 2 2'
					},
					items: [
						new Ext.form.Hidden({
							name: 'dept_code',
							id: gu.id('dept_code'),
						}),
						new Ext.form.Hidden({
							name: 'dept_name',
							id: gu.id('dept_name'),
						}),
						{
							fieldLabel: '사용자ID',
							xtype: 'textfield',
							anchor: '100%',
							allowBlank: false,
							id: gu.id('user_id'),
							name: 'user_id'
						}, {
							fieldLabel: '이름',
							xtype: 'textfield',
							anchor: '100%',
							allowBlank: false,
							id: gu.id('user_name'),
							name: 'user_name'
						}, {
							fieldLabel: '사번',
							xtype: 'textfield',
							anchor: '100%',
							allowBlank: true,
							id: gu.id('emp_no'),
							name: 'emp_no'
						}, {
							fieldLabel: '부서',
							xtype: 'combo',
							anchor: '100%',
							id: gu.id('unique_id_comdst'),
							name: 'unique_id_comdst',
							store: this.deptStore,
							displayField: 'dept_name',
							valueField: 'unique_id',
							allowBlank: false,
							innerTpl: "<div>[{dept_code}] {dept_name}</div>",
							listeners: {
								select: function (grid, data) {
									gu.getCmp('dept_code').setValue(data.get('dept_code'));
									gu.getCmp('dept_name').setValue(data.get('dept_name'));

								}
							}
						}, {
							fieldLabel: '권한',
							xtype: 'combo',
							multiSelect: true,
							anchor: '100%',
							store: this.roleCodeStore,
							id: gu.id('user_type'),
							name: 'user_type',
							displayField: 'role_name',
							valueField: 'role_code',
							allowBlank: true,
							innerTpl: "<div>[{role_code}] {role_name}</div>"
						}, {
							fieldLabel: '직급',
							xtype: 'textfield',
							anchor: '100%',
							id: gu.id('position'),
							name: 'position'
						}, {
							fieldLabel: '전화번호',
							xtype: 'textfield',
							anchor: '100%',
							id: gu.id('tel_no'),
							name: 'tel_no'
						}, {
							fieldLabel: '내선번호',
							xtype: 'textfield',
							anchor: '100%',
							id: gu.id('extension_no'),
							name: 'extension_no'
						}, {
							fieldLabel: '휴대폰',
							xtype: 'textfield',
							anchor: '100%',
							id: gu.id('hp_no'),
							name: 'hp_no'
						}, {
							fieldLabel: '팩스번호',
							xtype: 'textfield',
							anchor: '100%',
							id: gu.id('fax_no'),
							name: 'fax_no'
						}, {
							fieldLabel: 'E-Mail',
							xtype: 'textfield',
							anchor: '100%',
							id: gu.id('email'),
							name: 'email'
						}, {
							fieldLabel: '주소',
							xtype: 'textfield',
							anchor: '100%',
							id: gu.id('address_1'),
							name: 'address_1'
						}, {
							fieldLabel: '보안등급',
							xtype: 'textfield',
							anchor: '100%',
							id: gu.id('user_grade'),
							name: 'user_grade',
							value: 'C'
						}
					]
				},

			]
		});
        
        
        var myWidth = 310;
        var myHeight = 480;

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '신규등록',
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (form.isValid()) {

                            prWin.setLoading(true);

                            var val = form.getValues(false);
                            // User Id 중복확인
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/userMgmt/user.do?method=userCheck',
                                params: {
                                    user_id: val['user_id']
                                },
                                success: function (result, request) {
                                    var jsonData = Ext.decode(result.responseText);
                                    console_logs('>>> jsonData', jsonData);
                                    var records = jsonData.datas;
                                    var cnt = jsonData['count'];
                                    console_logs('>>> records', records);

                                    if (cnt < 1) {
                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/userMgmt/user.do?method=create',
                                            params: val,
                                            success: function (result, request) {
                                                if (prWin) {
                                                    prWin.setLoading(false);
                                                    prWin.close();
                                                }
                                                gm.me().store.load();
                                            }, //endofsuccess
                                            failure: function () {
                                                prWin.setLoading(false);
                                                extjsUtil.failureMessage();
                                            }
                                        }); //endofajax
                                    } else {
                                        prWin.setLoading(false);
                                        Ext.MessageBox.alert(error_msg_prompt, '중복된 사용자ID가 있습니다.');
                                    }

                                }, //endofsuccess
                                failure: function () {
                                    prWin.setLoading(false);
                                    extjsUtil.failureMessage();
                                }
                            }); //endofajax


                        }
                    }
                }
            }, {
                text: CMD_CANCEL,
                handler: function () {
                    if (prWin) {
                        prWin.close();
                    }
                }
            }
            ]
        });
        prWin.show();
    },

    editMemberView: function () {
        var rec = gm.me().grid.getSelectionModel().getSelection()[0];
        console_logs('>>>>>rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr', rec);
		var form = Ext.create('Ext.form.Panel', {
			id: gu.id('formPanelModify'),
			xtype: 'form',
			frame: false,
			border: false,
			width: '100%',
			height: '100%',
			bodyPadding: '3 3 0',
			region: 'center',
			layout: 'column',
			fieldDefaults: {
				labelAlign: 'right',
				msgTarget: 'side'
			},
			items: [
				{
					xtype: 'fieldset',
					id: gu.id('modification'),
					title: '수정 정보입력',
					frame: true,
					width: '100%',
					height: '100%',
					layout: 'fit',
					defaults: {
						margin: '2 2 2 2'
					},
					items: [
						new Ext.form.Hidden({
							name: 'unique_id',
							id: gu.id('unique_id'),
							value: rec.get('unique_id_long')
						}),
						new Ext.form.Hidden({
							name: 'dept_code',
							id: gu.id('dept_code'),
						}),
						new Ext.form.Hidden({
							name: 'dept_name',
							id: gu.id('dept_name'),
						}),
						{
							fieldLabel: '사용자ID',
							xtype: 'textfield',
							anchor: '100%',
							readOnly: true,
							fieldStyle: 'background-color: #FBF8E6; background-image: none;',
							id: gu.id('user_id'),
							name: 'user_id',
							value: rec.get('user_id')
						}, {
							fieldLabel: '이름',
							xtype: 'textfield',
							anchor: '100%',
							allowBlank: false,
							id: gu.id('user_name'),
							name: 'user_name',
							value: rec.get('user_name')
						}, {
							fieldLabel: '사번',
							xtype: 'textfield',
							anchor: '100%',
							allowBlank: true,
							id: gu.id('emp_no'),
							name: 'emp_no',
							value: rec.get('emp_no')
						}, {
							fieldLabel: '부서',
							xtype: 'combo',
							anchor: '100%',
							id: gu.id('unique_id_comdst'),
							name: 'unique_id_comdst',
							store: gm.me().deptStore,
							displayField: 'dept_name',
							valueField: 'unique_id',
							allowBlank: true,
							value: rec.get('unique_id_comdst'),
							listConfig: {
								getInnerTpl: function () {
									return '<div data-qtip="{dept_code}">{dept_name}</div>';
								}
							},
							// innerTpl: "<div>[{dept_code}] {dept_name}</div>",
							listeners: {
								select: function (grid, data) {
									gu.getCmp('dept_code').setValue(data.get('dept_code'));
									gu.getCmp('dept_name').setValue(data.get('dept_name'));

								}
							}
						}, {
							fieldLabel: '직급',
							xtype: 'textfield',
							anchor: '100%',
							id: gu.id('position'),
							name: 'position',
							value: rec.get('position')
						}, {
							fieldLabel: '전화번호',
							xtype: 'textfield',
							anchor: '100%',
							id: gu.id('tel_no'),
							name: 'tel_no',
							value: rec.get('tel_no')
						}, {
							fieldLabel: '내선번호',
							xtype: 'textfield',
							anchor: '100%',
							id: gu.id('extension_no'),
							name: 'extension_no',
							value: rec.get('extension_no')
						}, {
							fieldLabel: '휴대폰',
							xtype: 'textfield',
							anchor: '100%',
							id: gu.id('hp_no'),
							name: 'hp_no',
							value: rec.get('hp_no')
						}, {
							fieldLabel: '팩스번호',
							xtype: 'textfield',
							anchor: '100%',
							id: gu.id('fax_no'),
							name: 'fax_no',
							value: rec.get('fax_no')
						}, {
							fieldLabel: 'E-Mail',
							xtype: 'textfield',
							anchor: '100%',
							id: gu.id('email'),
							name: 'email',
							value: rec.get('email')
						}, {
							fieldLabel: '주소',
							xtype: 'textfield',
							anchor: '100%',
							id: gu.id('address_1'),
							name: 'address_1',
							value: rec.get('address_1')
						}, {
							fieldLabel: '보안등급',
							xtype: 'textfield',
							anchor: '100%',
							id: gu.id('user_grade'),
							name: 'user_grade',
							value: rec.get('user_grade')
						}
					]
				},

			]
		});
        
        var myWidth = 310;
        var myHeight = 480;
        
        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '수정',
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {

                        if (form.isValid()) {
                            var val = form.getValues(false);
                            prWin.setLoading(true);

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/userMgmt/user.do?method=edit',
                                params: val,
                                success: function (result, request) {
                                    if (prWin) {
                                        prWin.setLoading(false);
                                        prWin.close();
                                    }
                                    gm.me().store.load();
                                }, //endofsuccess
                                failure: function () {
                                    prWin.setLoading(false);
                                    extjsUtil.failureMessage();
                                }
                            }); //endofajax
                        }
                    }
                }
            }, {
                text: CMD_CANCEL,
                handler: function () {
                    if (prWin) {
                        prWin.close();
                    }
                }
            }
            ]
        });
        prWin.show(this, function () {
            var combo = gu.getCmp('unique_id_comdst');
            var val = combo.getValue();
            var record = combo.findRecordByValue(val);
            if (record != null) {
                combo.select(record);
            }

        });
    },

	deleteMemberView: function() {
		Ext.MessageBox.show({
			title: '회원 삭제',
			msg: '선택한 코드 정보를 삭제하시겠습니까?',
			buttons: Ext.MessageBox.YESNO,
			fn: function(btn) {
				if(btn=='yes') {

					var selectionMember = gm.me().memberGrid.getSelectionModel().getSelection()[0];

					Ext.Ajax.request({
						url: CONTEXT_PATH + '/userMgmt/user.do?method=destroy',
						params:{
							unique_id: selectionMember.get('unique_id_long')
						},
						success : function(result, request) {
							var resultText = result.responseText;
							gm.me().store.load();
							gm.me().memberOfCompanyStore.load();
						},
						failure : extjsUtil.failureMessage
					});

				}
			},
			icon: Ext.MessageBox.QUESTION
		});
	}

});
