Ext.require([
    'Ext.data.*',
    'Ext.grid.*',
    'Ext.tree.*',
    'Ext.tip.*',
    'Ext.ux.CheckColumn'
]);

//외주현황
Ext.define('Rfx2.view.company.dabp01kr.purStock.HEAVY4_OutSourceView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'outsource-po-view',
    
    
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField(); 
    	
    	this.OutSourceStore = Ext.create('Mplm.store.OutSourceStore',{});
    	
    	
    	//검색툴바 추가
    	//일자검색
    	this.addSearchField ({
            type: 'dateRange',
            field_id: 'treat_date',
            text: "일자" ,
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
        });
    	
    	//입출고검색
    	this.addSearchField({
            field_id:		'innout_type',
            store: 			'OutSourceStore',
            displayField:   'codeName',
            valueField:     'systemCode',
            innerTpl: 		'<div data-qtip="{systemCode}">[{systemCode}] {codeName}</div>'
        });
		
		this.addSearchField('supplier_name');
		this.addSearchField('user_name');

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        
        
        this.createStore('Rfx.model.OutSource', [{
            property: 'unique_id',
            direction: 'DESC'
        }],{
			deleteClass: ['cartmap']
		},
        gMain.pageSize/*pageSize*/
        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
        ,
        ['history']
		);
	
		Ext.each(this.columns, function(columnObj, index) {
				var dataIndex = columnObj["dataIndex"];

			switch(dataIndex) {
				case 'innout_type':
					columnObj['renderer'] = function(value) {
						switch(value) {
							case 'IN' :
							value = '입고';
							break;
							case 'OUT':
							value = '출고';
							break;
							}
					return value; 
				}
				break;
				case 'user_name':
					columnObj['renderer'] = function(value) {
						if(value == null || value.length < 1 || value == 'NULL') {
							value = '';
						}
						return value;
					}
				break;
			}
		});
    
        this.store.load();
        
        
        
        //추가 수정 삭제
        
        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
        	if(index==3||index==1||index==2) {
            	buttonToolbar.items.remove(item);        		
        	}

        }); 
        
        //등록
        this.labRegistAction = Ext.create('Ext.Action', {
        	iconCls: 'af-plus-circle',
        	text: gm.getMC('CMD_Enrollment', '등록'),
        	tooltip: '외주등록',
        	disabled: false,
        	handler: function() {		 	
			 	gMain.selPanel.labRegistHandler();
        	}
		});

		//등록
        this.labEditAction = Ext.create('Ext.Action', {
        	iconCls: 'af-edit',
        	text: gm.getMC('CMD_MODIFY', '수정'),
        	tooltip: '등록수정',
        	disabled: true,
        	handler: function() {		 	
			 	gMain.selPanel.labEditHandler();
        	}
		});

		buttonToolbar.insert(1, this.labRegistAction);
		buttonToolbar.insert(2, this.labEditAction);
		
		
		//그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);
		
		this.callParent(arguments);
		       
        
        //grid 생성.
        this.createGrid(searchToolbar, buttonToolbar);

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
        
        this.callParent(arguments);
        
        
      //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
            	var rec = selections[0];
            	gm.me().labEditAction.enable();
             } else {
				 gm.me().labEditAction.disable();
            	//  gMain.selPanel.reReceiveAction.disable();
             }
             })	

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function(records){});
    },
    items : [],
	
	labEditHandler: function() {
		var selection = gm.me().grid.getSelectionModel().getSelection()[0];

		gm.me().supplierStore.load();
		gm.me().OutSourceStore.load();
		gm.me().userStore.load();

		gm.me().editSrcahdForm = Ext.create('Ext.form.Panel', {
			title: '등록수정',
			xtype:'form',
			width:500,
			height:500,
			bodyPadding:15,
			layout: {
				type:'vbox',
				align:'stretch'
			},
			
			items: [
				new Ext.form.Hidden({
					name: 'unique_id',
					value: selection.get('unique_id_long')
				}),
				//일자
				{
					xtype: 'datefield',
					fieldLabel: gm.me().getColName('treat_date'),
					id: gu.id('treat_date'),
					name: 'treat_date',
					value: new Date(selection.get('treat_date')),
					allowBlank: false,
				}, 
				
				//외주처
				{
					xtype: 'combo',
					fieldLabel: gm.me().getColName('supplier_name'),
					id: gu.id('buyer_uid'),
					name: 'buyer_uid',
					store: gm.me().supplierStore,
					displayField:   'supplier_name',
                    valueField:   'unique_id',
					sortInfo: { field: 'create_date', direction: 'DESC' },
					listConfig: {
                        getInnerTpl: function() {
                            return '<div data-qtip="{unique_id}">{supplier_name}|{supplier_code}</div>';
                        }
					},
					emptyText: '선택',
					allowBlank: false,
					value: selection.get('supplier_name'),
				}, 
				//입출고 콤보
				{
					xtype: 'combo',
					fieldLabel: gm.me().getColName('innout_type'),
					id: gu.id('innout_type'),
					name: 'innout_type',
					store: gm.me().OutSourceStore,
					displayField: 'codeName',
					valueField: 'systemCode',
                	emptyText: '선택',
					allowBlank: false,
					value: selection.get('innout_type'),
					listConfig: {
                        getInnerTpl: function() {
                            return '<div data-qtip="{systemCode}">{codeName}</div>';
                        }
					},
//					listeners: {
//                        select: function(combo, record) {
//                            var val = record.get('system_code');
//                            Ext.getCmp(gu.id('innout_type')).setValue(val);
//                        }
//                    }
				},
				//운행자
				{
					xtype: 'combo',
					fieldLabel: gm.me().getColName('user_name'),
					id: gu.id('operator'),
					name: 'operator',
					store: gm.me().userStore,
					displayField:   'user_name',
					valueField:   'unique_id',
					value: selection.get('user_name'),
					sortInfo: { field: 'user_name', direction: 'ASC' },
					listConfig: {
                        getInnerTpl: function() {
                            return '<div data-qtip="{unique_id}">{user_name} {position} ({dept_name}</div>';
                        }
					},
					emptyText: '선택',
					allowBlank: true
				},
				
				//품평
				{
					xtype: 'textarea',
					fieldLabel: gm.me().getColName('item_name'),
					id: gu.id('item_name'),
					name: 'item_name',
					value: selection.get('item_name'),
					allowBlank: true
				},
				
				//비고
				{
					xtype: 'textarea',
					fieldLabel: gm.me().getColName('etc'),
					id: gu.id('etc'),
					name: 'etc',
					value: selection.get('etc'),
					allowBlank: true
				},
			]
		});

		var editWin = Ext.create('ModalWindow', {
			title: '등록수정',
			width: 500,
			height: 500,
			minWidth: 250,
			minHeight: 180,
			items:
				[{
					region: 'center',
					xtype: 'tabpanel',
					items: gm.me().editSrcahdForm
				}],
			buttons: [{
				text: CMD_OK,
				handler: function() {
					var op = Ext.getCmp(gu.id('operator')).getValue();
					
					if(op == null || op==undefined || op.length < 1) {
						Ext.getCmp(gu.id('operator')).setValue(-1);
					}

					var inout_type = Ext.getCmp(gu.id('innout_type')).getValue();
					var type_val = inout_type;
					switch(inout_type) {
						case '입고':
							type_val = 'IN';
						case '출고':
							type_val = 'OUT';
						break;
					}

					Ext.getCmp(gu.id('innout_type')).setValue(type_val);

					var form = gm.me().editSrcahdForm;
					if (form.isValid()) {
						var val = form.getValues(false);
					form.submit({
                        url: CONTEXT_PATH + '/purchase/request.do?method=createHistory',
                        params: val,
                        success: function(val, action) {
                        	editWin.close();
                            gm.me().store.load(function() {});
                        },
                        failure: function(val, action) {

                        	editWin.close();
                            gm.me().store.load(function() {});

                        }
                    });

					}
				}
			}, {
				text: CMD_CANCEL,
				handler: function() {
					if (editWin) {
						editWin.close();
					}
				}
			}]
		});
		editWin.show(  this, function(){}  );
	},
    
    //등록폼 출력
    labRegistHandler: function() {
		gm.me().addSrcahdForm = Ext.create('Ext.form.Panel', {
			title: '외주등록',
			xtype:'form',
			width:500,
			height:500,
			bodyPadding:15,
			layout: {
				type:'vbox',
				align:'stretch'
			},
			
			items: [
				
				//일자
				{
					xtype: 'datefield',
					fieldLabel: gm.me().getColName('treat_date'),
					id: gu.id('treat_date'),
					name: 'treat_date',
					value: new Date(),
					allowBlank: false,
				}, 
				
				//외주처
				{
					xtype: 'combo',
					fieldLabel: gm.me().getColName('supplier_name'),
					id: gu.id('buyer_uid'),
					name: 'buyer_uid',
					store: gm.me().supplierStore,
					displayField:   'supplier_name',
                    valueField:   'unique_id',
					sortInfo: { field: 'create_date', direction: 'DESC' },
					listConfig: {
                        getInnerTpl: function() {
                            return '<div data-qtip="{unique_id}">{supplier_name}|{supplier_code}</div>';
                        }
					},
					emptyText: '선택',
					allowBlank: false,
				}, 
				//입출고 콤보
				{
					xtype: 'combo',
					fieldLabel: gm.me().getColName('innout_type'),
					id: gu.id('innout_type'),
					name: 'innout_type',
					store: gm.me().OutSourceStore,
					displayField: 'codeName',
					valueField: 'systemCode',
                	emptyText: '선택',
					allowBlank: false,
					listConfig: {
                        getInnerTpl: function() {
                            return '<div data-qtip="{systemCode}">{codeName}</div>';
                        }
					},
//					listeners: {
//                        select: function(combo, record) {
//                            var val = record.get('system_code');
//                            Ext.getCmp(gu.id('innout_type')).setValue(val);
//                        }
//                    }
				},
				//운행자
				{
					xtype: 'combo',
					fieldLabel: gm.me().getColName('user_name'),
					id: gu.id('operator'),
					name: 'operator',
					store: gm.me().userStore,
					displayField:   'user_name',
                    valueField:   'unique_id',
					sortInfo: { field: 'user_name', direction: 'ASC' },
					listConfig: {
                        getInnerTpl: function() {
                            return '<div data-qtip="{unique_id}">{user_name} {position} ({dept_name}</div>';
                        }
					},
					emptyText: '선택',
					allowBlank: true
				},
				
				//품평
				{
					xtype: 'textarea',
					fieldLabel: gm.me().getColName('item_name'),
					id: gu.id('item_name'),
					name: 'item_name',
					value: '',
					allowBlank: true
				},
				
				//비고
				{
					xtype: 'textarea',
					fieldLabel: gm.me().getColName('etc'),
					id: gu.id('etc'),
					name: 'etc',
					value: '',
					allowBlank: true
				},
			]
		});
		
		

		//폼출력되는애?
		var winForm = Ext.create('ModalWindow', {
			title: '신규등록',
			width: 500,
			height: 500,
			minWidth: 250,
			minHeight: 180,
			items:
				[{
					region: 'center',
					xtype: 'tabpanel',
					items: gm.me().addSrcahdForm
				}],
			buttons: [{
				text: CMD_OK,
				handler: function() {
					var op = Ext.getCmp(gu.id('operator')).getValue();
					
					if(op == null || op==undefined || op.length < 1) {
						Ext.getCmp(gu.id('operator')).setValue(-1);
					}

					var inout_type = Ext.getCmp(gu.id('innout_type')).getValue();
					var type_val = 'IN';
					switch(inout_type) {
						case '입고':
							type_val = 'IN';
						case '출고':
							type_val = 'OUT';
						break;
					}

					Ext.getCmp(gu.id('innout_type')).setValue(type_val);

					var form = gm.me().addSrcahdForm;
					if (form.isValid()) {
						var val = form.getValues(false);
					form.submit({
                        url: CONTEXT_PATH + '/purchase/request.do?method=createHistory',
                        params: val,
                        success: function(val, action) {
                        	winForm.close();
                            gm.me().store.load(function() {});
                        },
                        failure: function(val, action) {

                        	winForm.close();
                            gm.me().store.load(function() {});

                        }
                    });

					}
				}
			}, {
				text: CMD_CANCEL,
				handler: function() {
					if (winForm) {
						winForm.close();
					}
				}
			}]
		});
		winForm.show(  this, function(){}  );
	},

	//운행자
	userStore : Ext.create('Mplm.store.UserStore', {hasNull: false} ),
	
	//외주처
	supplierStore : Ext.create('Mplm.store.SupastStore', {
				hasOwn : true
	}),
    
});



