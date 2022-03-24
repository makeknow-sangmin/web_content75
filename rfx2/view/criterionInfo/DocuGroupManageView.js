/**
 * This example shows how to create a grid from Array data. The grid is stateful so you
 * can move or hide columns, reload the page, and come back to the grid in the same state
 * you left it in.
 *
 * The cells are selectable due to use of the `enableTextSelection` option.
 */
Ext.define('Rfx2.view.criterionInfo.DocuGroupManageView', {
    extend: 'Ext.panel.Panel',
    xtype: 'docuGroup-manage-view',
    initComponent: function(){
    	
    	var storeTemplate = Ext.create('Mplm.store.CubeStore', {} );

        /*var storeTemplate = Ext.create('Ext.data.Store', {
            autoLoad: false,
            fields: [{
                name: 'buyer_name',
                type: 'string'
            }, {
                name: 'template_name',
                type: 'string'
            }],
            data: [{
                buyer_name: '삼성전자',
                template_name: '기본성적서'
            },{
                buyer_name: 'Hitachi',
                template_name: '기본성적서'
            }]
        });*/
		console_logs('>gMain.menu_check', gMain.menu_check);
        var storeInspect = Ext.create('Ext.data.Store', {
            autoLoad: false,
            fields: [{
                name: 'inst_name',
                type: 'string'
            }, {
                name: 'inst_date',
                type: 'string'
            }, {
                name: 'lot_no',
                type: 'string'
            }],
            data: [{
                inst_name: '테스트용 검사_C1000001',
                inst_date: '2018-06-11 11:30:30',
                lot_no: '김철수'
            },{
                inst_name: '테스트용 검사_C1000002',
                inst_date: '2018-06-11 15:01:33',
                lot_no: '장영희'
            }]
        });

        var storeContent = Ext.create('Ext.data.Store', {
            autoLoad: false,
            fields: [{
                name: 'inst_name',
                type: 'string'
            }, {
                name: 'inst_date',
                type: 'string'
            }, {
                name: 'lot_no',
                type: 'string'
            }],
            data: [{
                inst_name: '연월일',
                inst_date: '2018-06-11 11:30:30'
            }, {
                inst_name: '테스트값',
                inst_date: '12345'
            }]
		});
		
		this.claast_level1 = Ext.create('Mplm.store.ClaAstStoreDC', {} );

		this.claast_level1.getProxy().setExtraParam('level1', 1);
		this.claast_level1.load();

        this.gridTemplate = Ext.create('Ext.grid.Panel', {
            store: this.claast_level1,
            cls : 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll : true,
			autoHeight: true,
			selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'single'}),
            // bbar: getPageToolbar(storeTemplate),
            frame: true,
            layout :'fit',
            forceFit: true,
            margin: '0 10 0 0',
			width: 300,
			dockedItems: [
				{
					dock : 'top',
					xtype: 'toolbar',
					items: [				 
                        this.addAction_level1, this.removeAction_level1
					]
				}
			],
            columns: [{
                text: '대분류코드',
                dataIndex: 'class_code',
				width: 40
            },{
                text: '대분류명',
                dataIndex: 'class_name'
            }],
            title: '대분류 선택'
		});

		this.gridTemplate.getSelectionModel().on({
			selectionchange: function(sm, selections) {
				if(selections.length) {
					gm.me().addAction_level2.enable();
					gm.me().removeAction_level1.enable();
				} else {
					gm.me().addAction_level2.disable();
					gm.me().removeAction_level1.disable();
				}
			}
		});
		
		this.claast_level2 = Ext.create('Mplm.store.ClaAstStoreDC', {} );
		this.claast_level2.getProxy().setExtraParam('level1', 2);
		this.claast_level2.load();

		this.gridTemplate2 = Ext.create('Ext.grid.Panel', {
            store: this.claast_level2,
            cls : 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll : true,
			autoHeight: true,
			selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'single'}),
            // bbar: getPageToolbar(storeTemplate),
            frame: true,
            layout :'fit',
            forceFit: true,
            margin: '0 10 0 0',
			width: 300,
			dockedItems: [
				{
					dock : 'top',
					xtype: 'toolbar',
					items: [				 
                        this.addAction_level2, this.removeAction_level2
					]
				}
			],
            columns: [{
                text: '중분류코드',
                dataIndex: 'class_code',
				width: 40
            },{
                text: '중분류명',
                dataIndex: 'class_name'
            }],
            title: '중분류 선택'
		});

		this.gridTemplate2.getSelectionModel().on({
			selectionchange: function(sm, selections) {
				if(selections.length) {
					gm.me().addAction_level3.enable();
					gm.me().removeAction_level2.enable();
				} else {
					gm.me().addAction_level3.disable();
					gm.me().removeAction_level2.disable();
				}
			}
		});
		
		this.claast_level3 = Ext.create('Mplm.store.ClaAstStoreDC', {} );
		this.claast_level3.getProxy().setExtraParam('level1', 3);
		this.claast_level3.load();

        this.gridTemplate3 = Ext.create('Ext.grid.Panel', {
            store: this.claast_level3,
            cls : 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll : true,
			autoHeight: true,
			selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'single'}),
            // bbar: getPageToolbar(storeTemplate),
            frame: true,
            layout :'fit',
            forceFit: true,
            margin: '0 10 0 0',
			width: 300,
			dockedItems: [
				{
					dock : 'top',
					xtype: 'toolbar',
					items: [				 
                        this.addAction_level3, this.removeAction_level3
					]
				}
			],
            columns: [{
                text: '소분류코드',
				dataIndex: 'class_code',
				width: 40
            },{
                text: '소분류명',
                dataIndex: 'class_name'
            }],
            title: '소분류 선택'
        });

		this.gridTemplate3.getSelectionModel().on({
			selectionchange: function(sm, selections) {
				if(selections.length) {
					gm.me().addAction_level4.enable();
					gm.me().removeAction_level3.enable();
				} else {
					gm.me().addAction_level4.disable();
					gm.me().removeAction_level3.disable();
				}
			}
		});
		
		this.claast_level4 = Ext.create('Mplm.store.ClaAstStoreDC', {} );
		this.claast_level4.getProxy().setExtraParam('level1', 4);
		this.claast_level4.load();

        this.gridContent = Ext.create('Ext.grid.Panel', {
            store: this.claast_level4,
            cls : 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll : true,
			autoHeight: true,
			selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'single'}),
            // bbar: getPageToolbar(storeContent),
            frame: true,
            layout          :'fit',
            forceFit: true,
            margin: '0 10 0 0',
			flex:1,
			dockedItems: [
				{
					dock : 'top',
					xtype: 'toolbar',
					items: [				 
                        this.addAction_level4, this.removeAction_level4  
					]
				}
			],
            columns: [{
                text: '상세분류코드',
                dataIndex: 'class_code',
				width: 40
            }, {
                text: '상세분류명',
                dataIndex: 'class_name'
            }],
            title: '상세 내용'
		});

		this.gridContent.getSelectionModel().on({
			selectionchange: function(sm, selections) {
				if(selections.length) {
					gm.me().removeAction_level4.enable();
				} else {
					gm.me().removeAction_level4.disable();
				}
			}
		});
		
        var items = [
            this.gridTemplate,
            this.gridTemplate2,
			this.gridTemplate3,
			this.gridContent
        ];

        Ext.apply(this, {
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'stretch'
            },
            items: items
        });


        this.callParent(arguments);

	},
	
	addAction_level1: Ext.create('Ext.Action',{
		iconCls: 'af-plus-circle',
		text: '신규생성',
		hidden: gMain.menu_check == true ? false : true,
		disabled: false,
		handler: function(widget, event) {
			var selections = gm.me().gridTemplate.getSelectionModel().getSelection()[0];
			gm.me().addGroupByLevel(1, null);
		}
	}),

	addAction_level2: Ext.create('Ext.Action',{
		iconCls: 'af-plus-circle',
		text: '신규생성',
		hidden: gMain.menu_check == true ? false : true,
		disabled: true,
		handler: function(widget, event) {
			var selections = gm.me().gridTemplate.getSelectionModel().getSelection()[0];
			gm.me().addGroupByLevel(2, selections);
		}
	}),

	addAction_level3: Ext.create('Ext.Action',{
		iconCls: 'af-plus-circle',
		text: '신규생성',
		hidden: gMain.menu_check == true ? false : true,
		disabled: true,
		handler: function(widget, event) {
			var selections = gm.me().gridTemplate2.getSelectionModel().getSelection()[0];
			gm.me().addGroupByLevel(3, selections);
		}
	}),

	addAction_level4: Ext.create('Ext.Action',{
		iconCls: 'af-plus-circle',
		text: '신규생성',
		hidden: gMain.menu_check == true ? false : true,
		disabled: true,
		handler: function(widget, event) {
			var selections = gm.me().gridTemplate3.getSelectionModel().getSelection()[0];
			gm.me().addGroupByLevel(4, selections);
		}
	}),

	removeAction_level1: Ext.create('Ext.Action',{
		iconCls: 'af-remove',
		text: gm.getMC('CMD_DELETE', '삭제'),
		hidden: gMain.menu_check == true ? false : true,
		disabled: true,
		handler: function(widget, event) {
			console_logs('=====asdasdasd', gm.me().gridTemplate);
			var selections = gm.me().gridTemplate.getSelectionModel().getSelection();
			gm.me().removeGroupByLevel(1, selections);
		}
	}),

	removeAction_level2: Ext.create('Ext.Action',{
		iconCls: 'af-remove',
		text: gm.getMC('CMD_DELETE', '삭제'),
		hidden: gMain.menu_check == true ? false : true,
		disabled: true,
		handler: function(widget, event) {
			var selections = gm.me().gridTemplate2.getSelectionModel().getSelection();
			gm.me().removeGroupByLevel(2, selections);
		}
	}),

	removeAction_level3: Ext.create('Ext.Action',{
		iconCls: 'af-remove',
		text: gm.getMC('CMD_DELETE', '삭제'),
		hidden: gMain.menu_check == true ? false : true,
		disabled: true,
		handler: function(widget, event) {
			var selections = gm.me().gridTemplate3.getSelectionModel().getSelection();
			gm.me().removeGroupByLevel(3, selections);
		}
	}),

	removeAction_level4: Ext.create('Ext.Action',{
		iconCls: 'af-remove',
		text: gm.getMC('CMD_DELETE', '삭제'),
		hidden: gMain.menu_check == true ? false : true,
		disabled: true,
		handler: function(widget, event) {
			var selections = gm.me().gridContent.getSelectionModel().getSelection();
			gm.me().removeGroupByLevel(4, selections);
		}
	}),

	addGroupByLevel:function(level, selections) {

		console_logs('===lv', level);
		console_logs('===selections', selections);

		var class_name_label = '';
		var class_code_label = '';

		var parent_class_code = '';

		if(selections != null && selections != undefined) {
			parent_class_code = selections.get('class_code');
		}

		switch(level) {
			case 1:
			class_name_label = '대분류명';
			class_code_label = '대분류코드';
			break;
			case 2:
			class_name_label = '중분류명';
			class_code_label = '중분류코드';
			break;
			case 3:
			class_name_label = '소분류명';
			class_code_label = '소분류코드';
			break;
			case 4:
			class_name_label = '상세분류명';
			class_code_label = '상세분류코드';
			break;
			default:
			break;
		}

		var form = Ext.create('Ext.form.Panel', {
			id: 'form',
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
				new Ext.form.Hidden({
					name: 'level',
					value: level
				}),
				{
					xtype: 'textfield',
					name: 'class_name',
					id: 'class_name',
					allowBlank: false,
					fieldLabel: class_name_label
				},{
					xtype: 'textfield',
					name: 'class_code',
					id: 'class_code',
					allowBlank: false,
					fieldLabel: class_code_label
				},{
					xtype: 'textfield',
					name: 'parent_class_code',
					id: 'parent_class_code',
					allowBlank: true,
					value: parent_class_code,
					fieldLabel: '상위코드',
					editable: false
				}
			]
		});

		var win = Ext.create('ModalWindow', {
                    title: '신규 생성',
                    width: 400,
                    height: 250,
                    minWidth: 250,
                    minHeight: 180,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function(){
							var form = Ext.getCmp('form');
							if (form.isValid()) {
								var val = form.getValues(false);

								console_logs('==val', val);

								Ext.Ajax.request({
									url: CONTEXT_PATH + '/admin/stdClass.do?method=addGroupByLevel',
									params: val,
									success: function(result, request) {
										console_logs('success level', level);
										if(win) {
											win.close();
										}
										switch(level) {
											case 1:
											gm.me().claast_level1.load();
											break;
											case 2:
											gm.me().claast_level2.load();
											break;
											case 3:
											gm.me().claast_level3.load();
											break;
											case 4:
											gm.me().claast_level4.load();
											break;
											default:
											break;
											
										}
									}, // endof success for ajax
									failure: extjsUtil.failureMessage
								});
							} else {
								Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
							}
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
		win.show();
	},

	removeGroupByLevel:function(level, selections) {

		console_logs('===lv', level);
		console_logs('===sel', selections[0]);

		var unique_id_long = selections[0].get('unique_id_long');
		console_logs('===unique_id_long', unique_id_long);
		Ext.MessageBox.show({
				title:'확인',
				msg: '삭제 하시겠습니까?',
				buttons: Ext.MessageBox.YESNO,
				fn:  function(result) {
					if(result=='yes') {
						Ext.Ajax.request({
							url: CONTEXT_PATH + '/admin/stdClass.do?method=removeGroupByLevel',
							params: {
								unique_id_long : unique_id_long
							},
							success: function(result, request) {
								var result = result.responseText;

								switch(level) {
									case 1:
									gm.me().claast_level1.load();
									break;
									case 2:
									gm.me().claast_level2.load();
									break;
									case 3:
									gm.me().claast_level3.load();
									break;
									case 4:
									gm.me().claast_level4.load();
									break;
									default:
									break;
									
								}
							},
							failure: extjsUtil.failureMessage
						});
					}
				}
		});
	}
});
