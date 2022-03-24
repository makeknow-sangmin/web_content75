//고객사 관리 메뉴
Ext.define('Rfx2.view.company.dabp01kr.salesDelivery.BuyerListView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'buyer-list-view',
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();
    	
    	switch(vCompanyReserved4){
        case 'DOOS01KR':
		case 'KYNL01KR':
		case 'HSGC01KR':
        	break;
		case 'SKNH01KR':
            this.addSearchField ({
                field_id: 'pr_active_flag'
                ,store: 'PrActiveFlagStore'
                ,displayField: 'codeName'
                ,valueField: 'systemCode'
                ,innerTpl	: '{codeName}'
            });
            break;
        default :
        	this.addSearchField ({
				field_id: 'pr_active_flag'
				,store: 'PrActiveFlagStore'
				,displayField: 'codeName'
				,valueField: 'systemCode'
				,innerTpl	: '{codeName}'
        	});	
        	
        	// this.addSearchField ({
			// 	field_id: 'def_rep_uid'
			// 	,store: "UserDeptStoreOnly"
			//     ,displayField:   'user_name'
			//     ,valueField:   'unique_id'
			//     ,value: vCUR_USER_UID
			// 	,innerTpl	: '<div data-qtip="{unique_id}">[{dept_name}] {user_name}</div>'
			// 	,params:{dept_code: '02'}
    		// });	
        	 break;
    	}
    	
    	
    	
//    	this.addSearchField('pr_active_flag');
    	this.addSearchField('wa_name');
		this.addSearchField('biz_no');
		this.addSearchField('president_name');
//		this.addSearchField('wa_name_en');
    	//1) 회사명 2) 사업자번호 3) 대표자명 4) 영업담당자
		//Readonly Field 정의
		this.initReadonlyField();
		this.addReadonlyField('unique_id');

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.BuyerList', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/,{}
        ,['combst']
	        );
        
        
        
        this.addCallback('CHECK_CODE', function(o){
        	var target = gMain.selPanel.getInputTarget('wa_code');
        	
        	var code = target.getValue();
        	
        	var uppercode = code.toUpperCase();
        	
        	//if(code == null || code == ""){
//        	if(code.length < 2){
//        		Ext.Msg.alert('안내', '코드는 두자리 영문으로 입력해주세요', function() {});
//        	}else {
        		console_logs('===cc', 'cc');
        		Ext.Ajax.request({
        			url: CONTEXT_PATH + '/userMgmt/combst.do?method=checkWaCode',
            		params: {
            			code: code
            		},
            		success : function(result, request){
            			var resultText = result.responseText;
            			
            			if(resultText=='0') {
            				Ext.Msg.alert('안내', '사용가능한 코드입니다', function() {});
            				gMain.selPanel.getInputTarget('wa_code').setValue(uppercode);
        				}else {
        					Ext.Msg.alert('사용불가', '이미 사용중인 코드입니다', function() {});
        					gMain.selPanel.getInputTarget('wa_code').setValue('');
        				}
            		},
            		failure: extjsUtil.failureMessage
            	}); //end of ajax
//       	}
        	
        	
		});  // end of addCallback

		Ext.each(this.columns, function(columnObj, index) {
			var dataIndex = columnObj["dataIndex"];
			
			switch(dataIndex) {
				case 'bs_flag':
				columnObj['renderer'] = function(value) {
					console_logs('>>bs_flag', value);
					if(value == null || value.length < 1) {
						value = 'N';
					}
					return value;
				}
				break;
			}
		});

        //grid 생성.
        this.createGrid(searchToolbar, buttonToolbar);

		this.createCrudTab('buyer-list-view');

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
		var tabPanel = Ext.getCmp(gm.geTabPanelId());
		console_logs('>>>> tabPanel', this.columns);

		var addBranchAction = Ext.create('Ext.Action', {
			iconCls: 'af-plus-circle',
			text: '지사등록',
			tooltip: '지사등록',
			handler: function() {
				gm.me().addBranchHandler(true, gm.me().grid);
			}
		});

		var editBranchAction = Ext.create('Ext.Action', {
			iconCls: 'af-edit',
			text: gm.getMC('CMD_MODIFY', '수정'),
			tooltip: '수정',
			disabled: true,
			handler: function() {
				gm.me().addBranchHandler(false, gm.me().grid);
			}
		});

		var removeBranchAction = Ext.create('Ext.Action', {
			iconCls: 'af-remove',
			text: gm.getMC('CMD_DELETE', '삭제'),
			tooltip: '삭제',
			disabled: true,
			handler: this.removeBranchHandler
		});

		var branchColumns = [];

		for(var i=0; i<this.columns.length; i++) {
			var col = this.columns[i];
			branchColumns.push({
				text: col['text'],
				align: col['align'],
				dataIndex: col['dataIndex'],
				style: col['style'],
				width: col['width']
			})
		};

		var addSubAction = Ext.create('Ext.Action', {
			iconCls: 'af-plus-circle',
			text: '납품처등록',
			tooltip: '납품처등록',
			handler: function() {
				gm.me().addSubHandler(true, gm.me().grid);
			}
		});

		var editSubAction = Ext.create('Ext.Action', {
			iconCls: 'af-edit',
			text: gm.getMC('CMD_MODIFY', '수정'),
			tooltip: '수정',
			disabled: true,
			handler: function() {
				gm.me().addSubHandler(false, gm.me().grid);
			}
		});

		var removeSubAction = Ext.create('Ext.Action', {
			iconCls: 'af-remove',
			text: gm.getMC('CMD_DELETE', '삭제'),
			tooltip: '삭제',
			disabled: true,
			handler: this.removeSubHandler
		});

		var subColumns = [];

		for(var i=0; i<this.columns.length; i++) {
			var col = this.columns[i];
			subColumns.push({
				text: col['text'],
				align: col['align'],
				dataIndex: col['dataIndex'],
				style: col['style'],
				width: col['width']
			})
		};

		this.branchGrid = Ext.create('Ext.grid.Panel',{
			id : 'branchGrid',
			store : this.combstBranchStore,
			border : true,
			resizable : true,
			scroll : true,
			title:'지사정보',
			// multiSelect : true,
			collapsible : false,
			autoScroll: true,
			layout : 'fit',
			// forceFit: true,
			region : 'center',
			columns : branchColumns,
			selModel : Ext.create("Ext.selection.CheckboxModel",{}),
			dockedItems: [
				{
					dock: 'top',
					xtype: 'toolbar',
					cls: 'my-x-toolbar-default3',
					items: [
						addBranchAction, '-', editBranchAction, '-', removeBranchAction
					]
				}
			],
		});

		this.branchGrid.getSelectionModel().on({
			selectionchange:function(sm, selections) {
				if(selections != null && selections.length > 0) {
					editBranchAction.enable();
					removeBranchAction.enable();
				} else {
					editBranchAction.disable();
					removeBranchAction.disable();
				}
			}
		});

		this.combstSubGrid = Ext.create('Ext.grid.Panel',{
			id : 'combstSubGrid',
			store : this.combstSubStore,
			border : true,
			resizable : true,
			scroll : true,
			title:'납품처 관리',
			// multiSelect : true,
			collapsible : false,
			autoScroll: true,
			layout : 'fit',
			// forceFit: true,
			region : 'center',
			columns : subColumns,
			selModel : Ext.create("Ext.selection.CheckboxModel",{}),
			dockedItems: [
				{
					dock: 'top',
					xtype: 'toolbar',
					cls: 'my-x-toolbar-default3',
					items: [
						addSubAction, '-', editSubAction, '-', removeSubAction
					]
				}
			],
		});

		this.combstSubGrid.getSelectionModel().on({
			selectionchange:function(sm, selections) {
				if(selections != null && selections.length > 0) {
					editSubAction.enable();
					removeSubAction.enable();
				} else {
					editSubAction.disable();
					removeSubAction.disable();
				}
			}
		});

		var branchTab = Ext.widget('tabpanel', {
			layout:'border',
			title: '지사관리',
			border: false,
			items: this.branchGrid
		});
		tabPanel.add(branchTab);

		var combstSubTab = Ext.widget('tabpanel', {
			layout:'border',
			title: '납품처관리',
			border: false,
			items: this.combstSubGrid
		});
		tabPanel.add(combstSubTab);

		this.callParent(arguments);
		
		this.setGridOnCallback(function(selections) {
			if(selections != null && selections.length > 0) {
				var selection = selections[0];
				// 지사 검색
				var wa_code = selection.get('wa_code');
				gm.me().combstBranchStore.getProxy().setExtraParam('wa_group_only', wa_code);
				gm.me().combstBranchStore.load();
				
				// 납품처 검색
				gm.me().combstSubStore.getProxy().setExtraParam('wa_group_only', wa_code + '-SUB');
				gm.me().combstSubStore.load();
			} else {

			}
		});

        //디폴트 로드
        this.store.load(function(records){});
    },
	items : [],
	
	addBranchHandler: function(check, grid) {
		var selection = grid.getSelectionModel().getSelection()[0];
		
		if(selection == null || selection.length < 1) {
			Ext.Msg.alert('안내', '본사를 등록 후 진행해주세요.',  function(){});
			return;
		};

		var branch_rec = gm.me().branchGrid.getSelectionModel().getSelection()[0];
		var title = check == true ? '지사등록' : '지사수정';
		var id = check == true ? 'registForm' : 'editForm';
		var trans_use_flag = check == true ? 'N' : branch_rec.get('trans_use_flag');
		if(trans_use_flag == 'Y') {
			trans_use_flag = true;
		} else {
			trans_use_flag = false;
		}
		if(check == true) {
			gm.me().userDeptStore.load();
		}

		var form = Ext.create('Ext.form.Panel', {
			id: id,
			defaultType: 'textfield',
			xtype:'form',
			border: false,
			// bodyPadding: 15,
			width: 1200,
			height: 800,
			//layout:'fit',
			// margins: '0 0 10 0',
			scroll: true,
			autoScroll: true,
			defaults: {
				// anchor: '100%',
				// editable:false,
				// allowBlank: false,
				msgTarget: 'side',
				labelWidth: 100
			},
			 items: [
				new Ext.form.Hidden({
					name: 'unique_id',
					id: 'unique_id',
					value: check == true ? -1 : branch_rec.get('unique_id_long')
				}),
				new Ext.form.Hidden({
					name: 'wa_group',
					id: 'wa_group',
					value: selection.get('wa_code')
				}),
				{
					xtype: 'container',
					// title: '지사정보',
					// frame:true,
					layout:'hbox',
					items: [
						{
							xtype:'container',
							width:'50%',
							margin: '10 0 0 100',
							border:true,
							layout: 'anchor',
							items:[
								{
									fieldLabel: '회사코드*',
									xtype: 'textfield',
									id:'wa_code',
									name:'wa_code',
									allowBlank:false,
									anchor:'60%',
									value: check == true ? '' : branch_rec.get('wa_code')
								},{
									fieldLabel: '회사명*',
									xtype: 'textfield',
									id:'wa_name',
									name:'wa_name',
									allowBlank:false,
									anchor:'60%',
									value: check == true ? '' : branch_rec.get('wa_name')
								},{
									fieldLabel: '부가세여부',
									xtype: 'combo',
									id:'bs_flag',
									name:'bs_flag',
									store: gm.me().codeYnStore,
									displayField: 'codeName',
									valueField:'systemCode',
									value: check == true ? selection.get('bs_flag') : branch_rec.get('bs_flag'),
									listConfig : {
										getInnerTpl : function() {
											return '<div data-qtip="{systemCode}">{codeName}</div>';
										}
									},
									anchor:'60%'
								},{
									fieldLabel: '사업자번호*',
									xtype: 'textfield',
									id:'biz_no',
									name:'biz_no',
									allowBlank:false,
									anchor:'60%',
									value: check == true ? '' : branch_rec.get('biz_no')
								},{
									fieldLabel: '지사대표자명',
									xtype: 'textfield',
									id:'president_name',
									name:'president_name',
									anchor:'60%',
									value: check == true ? '' : branch_rec.get('president_name')
								},{
									fieldLabel: '법인등록번호',
									xtype: 'textfield',
									id:'company_code',
									name:'company_code',
									anchor:'60%',
									value: check == true ? '' : branch_rec.get('company_code')
								},{
									fieldLabel: '업태',
									xtype: 'textfield',
									id:'biz_condition',
									name:'biz_condition',
									value: check == true ? selection.get('biz_condition') : branch_rec.get('biz_condition') ,
									anchor:'60%'
								},{
									fieldLabel: '종복',
									xtype: 'textfield',
									id:'biz_category',
									name:'biz_category',
									value: check == true ? selection.get('biz_category') : branch_rec.get('biz_category'),
									anchor:'60%'
								},{
									fieldLabel: '사업자주소',
									xtype: 'textfield',
									id:'address_1',
									name:'address_1',
									anchor:'60%',
									value: check == true ? '' : branch_rec.get('address_1')
								},{
									fieldLabel: '회사전화번호',
									xtype: 'textfield',
									id:'site_manager_tel_no',
									name:'site_manager_tel_no',
									anchor:'60%',
									value: check == true ? '' : branch_rec.get('site_manager_tel_no')
								},{
									fieldLabel: '회사 Fax',
									xtype: 'textfield',
									id:'arap_fax_no',
									name:'arap_fax_no',
									anchor:'60%',
									value: check == true ? '' : branch_rec.get('arap_fax_no')
								},{
									fieldLabel: '대표자 HP',
									xtype: 'textfield',
									id:'rep_account_code',
									name:'rep_account_code',
									anchor:'60%',
									value: check == true ? selection.get('rep_account_code') : branch_rec.get('rep_account_code')
								},{
									fieldLabel: '납품챠랑크기',
									xtype: 'textfield',
									id:'po_comment',
									name:'po_comment',
									anchor:'60%',
									value: check == true ? '' : branch_rec.get('po_comment')
								},{
									fieldLabel: '입고시간',
									xtype: 'textfield',
									id:'gr_pop_date',
									name:'gr_pop_date',
									anchor:'60%',
									value: check == true ? '' : branch_rec.get('gr_pop_date')
								}
							]
						}, {
							xtype: 'container',
							width: '50%',
							margin: '10 100 0 0',
							border:true,
							layout: 'anchor',
							items: [
								{
									fieldLabel: '담당자1',
									xtype: 'textfield',
									id:'site_manager_name',
									name:'site_manager_name',
									anchor:'60%',
									value: check == true ? '' : branch_rec.get('site_manager_name')
								},{
									fieldLabel: '담당자 HP',
									xtype: 'textfield',
									id:'site_manager_mobile_no',
									name:'site_manager_mobile_no',
									anchor:'60%',
									value: check == true ? '' : branch_rec.get('site_manager_mobile_no')
								},{
									fieldLabel: '담당자 EMAIL',
									xtype: 'textfield',
									id:'arap_email',
									name:'arap_email',
									anchor:'60%',
									value: check == true ? '' : branch_rec.get('arap_email')
								},{
									fieldLabel: '담당자2',
									xtype: 'textfield',
									id:'arap_user_name',
									name:'arap_user_name',
									anchor:'60%',
									value: check == true ? '' : branch_rec.get('arap_user_name')
								},{
									fieldLabel: '담당자2 HP',
									xtype: 'textfield',
									id:'arap_tel_no',
									name:'arap_tel_no',
									anchor:'60%',
									value: check == true ? '' : branch_rec.get('arap_tel_no')
								},{
									fieldLabel: '주요생산품목',
									xtype: 'textarea',
									id:'company_info',
									name:'company_info',
									anchor:'60%',
									value: check == true ? selection.get('company_info') : branch_rec.get('company_info')
								},{
									fieldLabel: '실제납품주소',
									xtype: 'textfield',
									id:'address_2',
									name:'address_2',
									anchor:'60%',
									value: check == true ? '' : branch_rec.get('address_2')
								},{
									fieldLabel: '하차지정보',
									xtype: 'textfield',
									id:'del_area_info',
									name:'del_area_info',
									anchor:'60%',
									value: check == true ? '' : branch_rec.get('del_area_info')
								},{
									fieldLabel: '대표자주소',
									xtype: 'textfield',
									id:'major_del_area',
									name:'major_del_area',
									anchor:'60%',
									value: check == true ? '' : branch_rec.get('major_del_area')
								},{
									fieldLabel: '비고',
									xtype: 'textfield',
									id:'comment_etc',
									name:'comment_etc',
									anchor:'60%',
									value: check == true ? selection.get('comment_etc') : branch_rec.get('comment_etc')
								},{
									fieldLabel: '영업담당자*',
									xtype: 'combo',
									id:'def_rep_uid',
									name:'def_rep_uid',
									store: gm.me().userDeptStore,
									displayField: 'user_name',
									valueField:'unique_id',
									allowBlank:false,
									value:check == true ? selection.get('def_rep_uid') : branch_rec.get('def_rep_uid') ,
									listConfig : {
										getInnerTpl : function() {
											return '<div data-qtip="{unique_id}">{user_name}</div>';
										}
									},
									anchor:'60%'
								},{
									fieldLabel: '거래중단',
									xtype: 'combo',
									id:'pr_active_flag',
									name:'pr_active_flag',
									store: gm.me().prActiveFlagStore,
									displayField: 'codeName',
									valueField:'systemCode',
									value:check == true ? selection.get('pr_active_flag') : branch_rec.get('pr_active_flag') ,
									listConfig : {
										getInnerTpl : function() {
											return '<div data-qtip="{systemCode}">{codeName}</div>';
										}
									},
									anchor:'60%'
								},{
									fieldLabel: '지게차 유무',
									xtype: 'checkbox',
									id:'trans_use_flag',
									name:'trans_use_flag',
									anchor:'60%',
									checked: check == true ? false : trans_use_flag
								}
							]
						}
					]
				}
			 ],
		});

		var prWin = Ext.create('Ext.Window', {
			modal: true,
			title: title,
			width: 1000,
			height: 600,
			plain: true,
			items: form,
			buttons: [{
				text: CMD_OK,
				handler: function(btn) {
					var wa_code = Ext.getCmp('wa_code').getValue();
					var wa_name = Ext.getCmp('wa_name').getValue();
					var biz_no = Ext.getCmp('biz_no').getValue();

					if(wa_code == null || wa_code == undefined || wa_code.length < 1 || 
						wa_name == null || wa_name == undefined || wa_name.length < 1 || 
						biz_no == null || biz_no == undefined || biz_no.length < 1) {
							Ext.Msg.alert("알림", "회사코드/회사명/사업자 를 확인해주세요.");
							return;
					}
					
					if(btn == 'no') {
						prWin.close();
					} else {
						console_logs('>>>>>>>>>>form', form);
						if(form.isValid()) {
							console_logs('>>>>>>>>>>form 2222', form.isValid());
							var val = form.getValues(false);

							Ext.Ajax.request({
                                url: CONTEXT_PATH + '/sales/buyer.do?method=addBranch',
                                params: val,
                                success: function(result, request) {
                                    if(prWin) {
                                        prWin.close();
                                    }
                                    gm.me().combstBranchStore.load();
                                }, //endofsuccess
                                failure: extjsUtil.failureMessage
                            }); //endofajax
						} else {
							Ext.Msg.alert("알림", "* 항목 값을 입력해주세요.");
							return;
						}
					}
				}
			},{
				text: CMD_CANCEL,
				handler: function() {
					if(prWin) {
						prWin.close();
					}
				}
			}]
		});
		prWin.show();
	},
	removeBranchHandler: function() {
		Ext.MessageBox.show({
			title: '확인',
			msg: '해당 지사를 삭제하시겠습니까?',
			buttons: Ext.MessageBox.YESNO,
			icon: Ext.MessageBox.QUESTION,
			fn: function(btn) {
				var selections = gm.me().branchGrid.getSelectionModel().getSelection();
				var unique_ids = [];
				for(var i=0; i<selections.length; i++) {
					var unique_id = selections[i].get('unique_id_long');
					unique_ids.push(unique_id);
				}

				if (btn == 'yes') {
					Ext.Ajax.request({
						url: CONTEXT_PATH + '/sales/buyer.do?method=removeBranch',
						params: {
							unique_ids:unique_ids
						},
						success: function(result, request) {
							gm.me().showToast('결과', '해당 지사가 삭제되었습니다.');
							gm.me().combstBranchStore.load();
						},
						failure: extjsUtil.failureMessage
					});
				}
			}
		});
	},addSubHandler: function(check, grid) {
		var selection = grid.getSelectionModel().getSelection()[0];
		
		if(selection == null || selection.length < 1) {
			Ext.Msg.alert('안내', '본사를 등록 후 진행해주세요.',  function(){});
			return;
		};

		var sub_rec = gm.me().combstSubGrid.getSelectionModel().getSelection()[0];
		var title = check == true ? '납품처등록' : '납품처수정';
		var id = check == true ? 'registFormSub' : 'editFormSub';
		var trans_use_flag = check == true ? 'N' : sub_rec.get('trans_use_flag');
		if(trans_use_flag == 'Y') {
			trans_use_flag = true;
		} else {
			trans_use_flag = false;
		}
		if(check == true) {
			gm.me().userDeptStore.load();
		}

		var form = Ext.create('Ext.form.Panel', {
			id: id,
			defaultType: 'textfield',
			xtype:'form',
			border: false,
			// bodyPadding: 15,
			width: 1200,
			height: 800,
			//layout:'fit',
			// margins: '0 0 10 0',
			scroll: true,
			autoScroll: true,
			defaults: {
				// anchor: '100%',
				// editable:false,
				// allowBlank: false,
				msgTarget: 'side',
				labelWidth: 100
			},
			 items: [
				new Ext.form.Hidden({
					name: 'unique_id',
					id: 'unique_id',
					value: check == true ? -1 : sub_rec.get('unique_id_long')
				}),
				new Ext.form.Hidden({
					name: 'wa_group',
					id: 'wa_group',
					value: selection.get('wa_code') + '-SUB'
				}),
				{
					xtype: 'container',
					// title: '지사정보',
					// frame:true,
					layout:'hbox',
					items: [
						{
							xtype:'container',
							width:'50%',
							margin: '10 0 0 100',
							border:true,
							layout: 'anchor',
							items:[
								{
									fieldLabel: '회사코드*',
									xtype: 'textfield',
									id:'wa_code',
									name:'wa_code',
									allowBlank:false,
									anchor:'60%',
									value: check == true ? '' : sub_rec.get('wa_code')
								},{
									fieldLabel: '회사명*',
									xtype: 'textfield',
									id:'wa_name',
									name:'wa_name',
									allowBlank:false,
									anchor:'60%',
									value: check == true ? '' : sub_rec.get('wa_name')
								},{
									fieldLabel: '부가세여부',
									xtype: 'combo',
									id:'bs_flag',
									name:'bs_flag',
									store: gm.me().codeYnStore,
									displayField: 'codeName',
									valueField:'systemCode',
									value: check == true ? selection.get('bs_flag') : sub_rec.get('bs_flag'),
									listConfig : {
										getInnerTpl : function() {
											return '<div data-qtip="{systemCode}">{codeName}</div>';
										}
									},
									anchor:'60%'
								},{
									fieldLabel: '사업자번호*',
									xtype: 'textfield',
									id:'biz_no',
									name:'biz_no',
									allowBlank:false,
									anchor:'60%',
									value: check == true ? '' : sub_rec.get('biz_no')
								},{
									fieldLabel: '지사대표자명',
									xtype: 'textfield',
									id:'president_name',
									name:'president_name',
									anchor:'60%',
									value: check == true ? '' : sub_rec.get('president_name')
								},{
									fieldLabel: '법인등록번호',
									xtype: 'textfield',
									id:'company_code',
									name:'company_code',
									anchor:'60%',
									value: check == true ? '' : sub_rec.get('company_code')
								},{
									fieldLabel: '업태',
									xtype: 'textfield',
									id:'biz_condition',
									name:'biz_condition',
									value: check == true ? selection.get('biz_condition') : sub_rec.get('biz_condition') ,
									anchor:'60%'
								},{
									fieldLabel: '종복',
									xtype: 'textfield',
									id:'biz_category',
									name:'biz_category',
									value: check == true ? selection.get('biz_category') : sub_rec.get('biz_category'),
									anchor:'60%'
								},{
									fieldLabel: '사업자주소',
									xtype: 'textfield',
									id:'address_1',
									name:'address_1',
									anchor:'60%',
									value: check == true ? '' : sub_rec.get('address_1')
								},{
									fieldLabel: '회사전화번호',
									xtype: 'textfield',
									id:'site_manager_tel_no',
									name:'site_manager_tel_no',
									anchor:'60%',
									value: check == true ? '' : sub_rec.get('site_manager_tel_no')
								},{
									fieldLabel: '회사 Fax',
									xtype: 'textfield',
									id:'arap_fax_no',
									name:'arap_fax_no',
									anchor:'60%',
									value: check == true ? '' : sub_rec.get('arap_fax_no')
								},{
									fieldLabel: '대표자 HP',
									xtype: 'textfield',
									id:'rep_account_code',
									name:'rep_account_code',
									anchor:'60%',
									value: check == true ? selection.get('rep_account_code') : sub_rec.get('rep_account_code')
								},{
									fieldLabel: '납품챠랑크기',
									xtype: 'textfield',
									id:'po_comment',
									name:'po_comment',
									anchor:'60%',
									value: check == true ? '' : sub_rec.get('po_comment')
								},{
									fieldLabel: '입고시간',
									xtype: 'textfield',
									id:'gr_pop_date',
									name:'gr_pop_date',
									anchor:'60%',
									value: check == true ? '' : sub_rec.get('gr_pop_date')
								}
							]
						}, {
							xtype: 'container',
							width: '50%',
							margin: '10 100 0 0',
							border:true,
							layout: 'anchor',
							items: [
								{
									fieldLabel: '담당자1',
									xtype: 'textfield',
									id:'site_manager_name',
									name:'site_manager_name',
									anchor:'60%',
									value: check == true ? '' : sub_rec.get('site_manager_name')
								},{
									fieldLabel: '담당자 HP',
									xtype: 'textfield',
									id:'site_manager_mobile_no',
									name:'site_manager_mobile_no',
									anchor:'60%',
									value: check == true ? '' : sub_rec.get('site_manager_mobile_no')
								},{
									fieldLabel: '담당자 EMAIL',
									xtype: 'textfield',
									id:'arap_email',
									name:'arap_email',
									anchor:'60%',
									value: check == true ? '' : sub_rec.get('arap_email')
								},{
									fieldLabel: '담당자2',
									xtype: 'textfield',
									id:'arap_user_name',
									name:'arap_user_name',
									anchor:'60%',
									value: check == true ? '' : sub_rec.get('arap_user_name')
								},{
									fieldLabel: '담당자2 HP',
									xtype: 'textfield',
									id:'arap_tel_no',
									name:'arap_tel_no',
									anchor:'60%',
									value: check == true ? '' : sub_rec.get('arap_tel_no')
								},{
									fieldLabel: '주요생산품목',
									xtype: 'textarea',
									id:'company_info',
									name:'company_info',
									anchor:'60%',
									value: check == true ? selection.get('company_info') : sub_rec.get('company_info')
								},{
									fieldLabel: '실제납품주소',
									xtype: 'textfield',
									id:'address_2',
									name:'address_2',
									anchor:'60%',
									value: check == true ? '' : sub_rec.get('address_2')
								},{
									fieldLabel: '하차지정보',
									xtype: 'textfield',
									id:'del_area_info',
									name:'del_area_info',
									anchor:'60%',
									value: check == true ? '' : sub_rec.get('del_area_info')
								},{
									fieldLabel: '대표자주소',
									xtype: 'textfield',
									id:'major_del_area',
									name:'major_del_area',
									anchor:'60%',
									value: check == true ? '' : sub_rec.get('major_del_area')
								},{
									fieldLabel: '비고',
									xtype: 'textfield',
									id:'comment_etc',
									name:'comment_etc',
									anchor:'60%',
									value: check == true ? selection.get('comment_etc') : sub_rec.get('comment_etc')
								},{
									fieldLabel: '영업담당자*',
									xtype: 'combo',
									id:'def_rep_uid',
									name:'def_rep_uid',
									store: gm.me().userDeptStore,
									displayField: 'user_name',
									valueField:'unique_id',
									allowBlank:false,
									value:check == true ? selection.get('def_rep_uid') : sub_rec.get('def_rep_uid') ,
									listConfig : {
										getInnerTpl : function() {
											return '<div data-qtip="{unique_id}">{user_name}</div>';
										}
									},
									anchor:'60%'
								},{
									fieldLabel: '거래중단',
									xtype: 'combo',
									id:'pr_active_flag',
									name:'pr_active_flag',
									store: gm.me().prActiveFlagStore,
									displayField: 'codeName',
									valueField:'systemCode',
									value:check == true ? selection.get('pr_active_flag') : sub_rec.get('pr_active_flag') ,
									listConfig : {
										getInnerTpl : function() {
											return '<div data-qtip="{systemCode}">{codeName}</div>';
										}
									},
									anchor:'60%'
								},{
									fieldLabel: '지게차 유무',
									xtype: 'checkbox',
									id:'trans_use_flag',
									name:'trans_use_flag',
									anchor:'60%',
									checked: check == true ? false : trans_use_flag
								}
							]
						}
					]
				}
			 ],
		});

		var prWin = Ext.create('Ext.Window', {
			modal: true,
			title: title,
			width: 1000,
			height: 600,
			plain: true,
			items: form,
			buttons: [{
				text: CMD_OK,
				handler: function(btn) {
					var wa_code = Ext.getCmp('wa_code').getValue();
					var wa_name = Ext.getCmp('wa_name').getValue();
					var biz_no = Ext.getCmp('biz_no').getValue();

					if(wa_code == null || wa_code == undefined || wa_code.length < 1 || 
						wa_name == null || wa_name == undefined || wa_name.length < 1 || 
						biz_no == null || biz_no == undefined || biz_no.length < 1) {
							Ext.Msg.alert("알림", "회사코드/회사명/사업자 를 확인해주세요.");
							return;
					}
					
					if(btn == 'no') {
						prWin.close();
					} else {
						console_logs('>>>>>>>>>>form', form);
						if(form.isValid()) {
							console_logs('>>>>>>>>>>form 2222', form.isValid());
							var val = form.getValues(false);
							console_logs('>>>> zzzz', Ext.getCmp('trans_use_flag').getValue());

							Ext.Ajax.request({
                                url: CONTEXT_PATH + '/sales/buyer.do?method=addBranch',
                                params: val,
                                success: function(result, request) {
                                    if(prWin) {
                                        prWin.close();
                                    }
                                    gm.me().combstSubStore.load();
                                }, //endofsuccess
                                failure: extjsUtil.failureMessage
                            }); //endofajax
						} else {
							Ext.Msg.alert("알림", "* 항목 값을 입력해주세요.");
							return;
						}
					}
				}
			},{
				text: CMD_CANCEL,
				handler: function() {
					if(prWin) {
						prWin.close();
					}
				}
			}]
		});
		prWin.show();
	},
	removeSubHandler: function() {
		Ext.MessageBox.show({
			title: '확인',
			msg: '해당 지사를 삭제하시겠습니까?',
			buttons: Ext.MessageBox.YESNO,
			icon: Ext.MessageBox.QUESTION,
			fn: function(btn) {
				var selections = gm.me().combstSubGrid.getSelectionModel().getSelection();
				var unique_ids = [];
				for(var i=0; i<selections.length; i++) {
					var unique_id = selections[i].get('unique_id_long');
					unique_ids.push(unique_id);
				}

				if (btn == 'yes') {
					Ext.Ajax.request({
						url: CONTEXT_PATH + '/sales/buyer.do?method=removeBranch',
						params: {
							unique_ids:unique_ids
						},
						success: function(result, request) {
							gm.me().showToast('결과', '해당 지사가 삭제되었습니다.');
							gm.me().combstSubStore.load();
						},
						failure: extjsUtil.failureMessage
					});
				}
			}
		});
	},
	branchGrid:null,
	combstSubGrid:null,
	combstBranchStore: Ext.create('Mplm.store.CombstBranchStore', {}),
	combstSubStore: Ext.create('Mplm.store.CombstSubStore', {}),
	codeYnStore: Ext.create('Mplm.store.CodeYnStore', {}),
	userDeptStore:Ext.create('Mplm.store.UserDeptStoreOnly', {params:{dept_code:'02'}}),
	prActiveFlagStore:Ext.create('Mplm.store.PrActiveFlagStore', {}),
});
