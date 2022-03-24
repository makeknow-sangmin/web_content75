/**
 * This example shows how to create a grid from Array data. The grid is stateful so you
 * can move or hide columns, reload the page, and come back to the grid in the same state
 * you left it in.
 *
 * The cells are selectable due to use of the `enableTextSelection` option.
 */
Ext.define('Rfx.view.lab.InnoBirds', {
    extend: 'Rfx.base.BaseView',
    xtype: 'innobirds-regist-view',
    initComponent: function(){
    	
    	//this.initDefValue();
		
    	//생성시 디폴트 값.
		this.setDefValue('board_email', /*GLOBAL*/vCUR_EMAIL);
		this.setDefValue('user_id', /*GLOBAL*/vCUR_USER_ID);
		this.setDefValue('board_name', /*GLOBAL*/vCUR_USER_NAME);
		this.setDefValue('board_count', 0); //Hidden Value임.

		switch(vSYSTEM_TYPE) {
		case 'MES':
			this.setDefComboValue('gubun', 'valueField', 'IB');//ComboBOX의 ValueField 기준으로 디폴트 설정.
			break;
		case 'PLACE':
			this.setDefComboValue('gubun', 'valueField', 'notice');//ComboBOX의 ValueField 기준으로 디폴트 설정.
		}


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
		this.addSearchField('unique_id');
		this.addSearchField('board_title');
		this.addSearchField('board_content');
		
		this.addSearchField('board_name');
		this.addSearchField('user_id');

		
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		//명령툴바 생성
		var buttonToolbar = this.createCommandToolbar();

		   //모델 정의
        this.createStore('Rfx.model.Board', [{
	            property: 'create_date',
	            direction: 'DESC'
	        }],
	        /*pageSize*/
	        gMain.pageSize
	        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
        	//Orderby list key change
        	//ordery create_date -> p.create로 변경.
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
		
		this.store.getProxy().setExtraParam('gubun', 'IB');

		this.store.load();

		this.labRegistAction = Ext.create('Ext.Action', {
        	iconCls: 'af-plus-circle',
        	text: gm.getMC('CMD_Enrollment', '등록'),
        	tooltip: '게시글 등록',
        	disabled: false,
        	handler: function() {		 	
			 	gMain.selPanel.labRegistHandler();
        	}
		});
		
		(buttonToolbar.items).each(function(item,index,length){
        	if(index==1 || index==2 || index==3) {
            	buttonToolbar.items.remove(item);        		
        	}
        });     
		buttonToolbar.insert(1, this.labRegistAction);

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);
        
        //입력/상세 창 생성.
        // this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.createWest(),this.createCenter()]
        });

		this.callParent(arguments);

		this.labEditAction = Ext.create('Ext.Action', {
        	iconCls: 'af-edit',
        	text: gm.getMC('CMD_MODIFY', '수정'),
        	tooltip: '게시글 수정',
        	disabled: true,
        	handler: function() {	
				var selection = gm.me().grid.getSelectionModel().getSelection()[0];	 
			 	gMain.selPanel.labEditHandler(selection);
        	}
		});
		buttonToolbar.insert(2, this.labEditAction);


		//grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
        	
        	console_logs('setGridOnCallback selections', selections);
        	var rec = selections[0];
        	if(rec!=undefined && rec!=null) {
            	gUtil.enable(this.labEditAction);
        	} else {
				gUtil.disable(this.labEditAction);
			}

        });
		
       
        //디폴트 로드
		gMain.setCenterLoading(false);
	       		
		this.store.on('load',function (store, records, successful, eOpts ){
        	gMain.selPanel.StoreLoadRecordSet(records);
       });
	

	},
	createCenter: function() {

		var docu_columns = [];

		console_logs('==this.columns', this.columns);
		Ext.each(this.columns, function(columnObj, index) {
			var dataIndex = columnObj["dataIndex"];
			var text = columnObj["text"];
			var type = columnObj["dataType"];
			var xtype = null;
			var check = dataIndex.substr(0,2);

			switch(type) {
				case 'string':
					xtype = 'textfield';
				break;
				case 'int':
					xtype = 'numberfield';
				break;
				case 'sdate':
					xtype = 'datefield';
				break;
				default:
					xtype = 'textfield';
				break;
			}

			if(check == 'v0') {
				docu_columns.push(
					{
						text:text,
						width:100,
						sortable:true,
						dataIndex:dataIndex,
						listeners:{}
					}
				)
			}			
		});

		this.docuGrid = 
			Ext.create('Ext.grid.Panel', {
	    	 //id: gm.me().link + 'DBM7-Assembly',
//			 id: 'PPO1_TURN_PREQ',
	    	 title: '문서목록',// cloud_product_class,
			 border: true,
	         resizable: true,
	         scroll: true,
	         collapsible: false,
			 store: this.docuStore,
			 columns: docu_columns,
			 autoScroll:true,
			 cls : 'rfx-panel',
	         //layout          :'fit',
	         //forceFit: true,
	         multiSelect: true,
			 selModel: Ext.create("Ext.selection.CheckboxModel", {} ),
	         bbar: Ext.create('Ext.PagingToolbar', {
		            store: null,
		            displayInfo: true,
		            displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
		            emptyMsg: "표시할 항목이 없습니다."
	                ,listeners: {
	                    beforechange: function (page, currentPage) {
	//		                        //--- Get Proxy ------//
	//		                        var myProxy = this.store.getProxy();                        
	//		                 //--- Define Your Parameter for send to server ----//
	//		                        myProxy.params = {
	//		                            MENU_NAME: '',
	//		                            MENU_DETAIL: ''
	//		                        };
	//		                  //--- Set value to your parameter  ----//
	//		                        myProxy.setExtraParam('MENU_NAME', '222222');
	//		                        myProxy.setExtraParam('MENU_DETAIL', '555555');
	                    }
	                }
		         
		        }),
	            dockedItems: [
	            {
				    dock: 'top',
				    xtype: 'toolbar',
				    cls: 'my-x-toolbar-default2',
					items: [
						// this.purListSrch//, 
					        //this.removeAssyAction, 
					        //'->', 
					        //this.expandAllTreeAction 
					        ]
				},
				{
				    dock: 'top',
				    xtype: 'toolbar',
				    cls: 'my-x-toolbar-default1',
					items: [{
					    xtype:'label',
					    width:40,
					    text: '기간',
					    style: 'color:white;'
						 
			    	},{
						  id: gu.id('s_date_arv'),
			              name: 's_date',
			              format: 'Y-m-d',
			              fieldStyle: 'background-color: #FBF8E6; background-image: none;',
			              submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
					    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
						    	xtype: 'datefield',
						    	value: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
						    	width: 98

			        },{
					    xtype:'label',
					    text: "~",
					    style: 'color:white;'
			        },{
						  id: gu.id('e_date_arv'),
			              name: 'e_date',
			              format: 'Y-m-d',
			              fieldStyle: 'background-color: #FBF8E6; background-image: none;',
			              submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
					    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
						    	xtype: 'datefield',
						    	value: new Date(),
						    	width: 98

			        }
			    	]
				}
	    	] //dockedItems of End
			
		
		});//supplierGrid of End

		this.docuGrid.setTitle('문서목록');
		this.center = Ext.widget('tabpanel', {
			layout:'border',
			border: true,
			region: 'center',
			width: '55%',
			items: [this.docuGrid]
		});

		return this.center;
	},

	createWest: function() {

		this.grid.setTitle('헤드목록');
		this.west = Ext.widget('tabpanel', {
			layout:'border',
			border: true,
			region: 'west',
			width: '45%',
			layoutConfig: {columns: 2, rows:1},

			items: [this.grid]
		});

		// 추가 컬럼 지우기
		for(var i=0; i<this.grid.columns.length; i++) {
			var dataIndex = this.grid.columns[i].dataIndex;
			if(dataIndex.substr(0,2) == 'v0') {
				this.grid.columns[i].destroy();
			}
		}


		this.grid.getSelectionModel().on({
			selectionchange: function(sm, selections) {
				console_logs('==sm', sm);
				console_logs('==selectrions', selections);

				if(selections.length > 0) {
					gm.me().docuStore.getProxy().setExtraParam('target_uid', selections[0].get('unique_id_long'));
				}
				gm.me().docuStore.getProxy().setExtraParam('menu_code', 'INNB_CLD');
				gm.me().docuStore.load();
			}
		});

		return this.west;
	},
    items : [],
    itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
    	//console_logs('boardview itemdblclick record', record);
    	  	
    	Rfx.model.Board.load(record.get('unique_id'), {
    	    success: function(board) {
            	console_logs('board', board);
    	    	var form = gm.me().createViewForm(board);
    	    	var win = Ext.create('ModalWindow', {
    	            title: gm.me().getMC('CMD_VIEW_DTL','상세보기'),
    	            width: 700,
    	            height: 530,
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
    	    }
    	});
    	
    	
    },
    createViewForm: function (board) {
    	//Ext.MessageBox.alert('Find Board', "unique_id : " + board.get('unique_id'));
    	console_logs('board', board);
//    	var lineGap = 30;
     	var unique_id = board.get('unique_id');
    	var user_id = board.get('user_id');
    	var board_email = board.get('board_email'  );
    	var board_title = board.get('board_title' );
    	var board_content = board.get('board_content' );
    	var htmlFileNames = board.get('htmlFileNames' );
    	var fileQty = board.get('fileQty' );
    	var form = Ext.create('Ext.form.Panel', {
            defaultType: 'displayfield',
            bodyPadding: 3,
            height: 650,
            defaults: {
                anchor: '100%',
                allowBlank: false,
                msgTarget: 'side',
                labelWidth: 60
            },
            items: [{
	    			fieldLabel: '등록자',
	    			value: user_id + '(' + board_email + ')'
    		    },{
    		    	fieldLabel: gm.getColName('board_title'),
    		    	value: board_title,
    		    	name: 'board_title'
    		    },{
    		    	fieldLabel: '첨부파일',
    		    	value: htmlFileNames
    		    },{
                    value: board_content,
                    xtype:          'textarea',
                    fieldStyle: 'overflow:scroll ;overflow-x:hidden; background-color: #F0F0F0; background-image: none;border-bottom: #999999 1px solid;border-left: #999999 1px solid;border-right: #999999 1px solid;border-top: #999999 1px solid;',
                    height: 340,
                    readOnly: true,
                    anchor: '100%'
                }  
    		    ]
        }); //endof form
    	
    	return form;
	},

	StoreLoadRecordSet: function(records){
	    	console_logs('StoreLoadRecordSet>>>>>>>>>>>>>>>>>', records);
	       	// for(var i=0; records!=null && i<records.length; i++) {
	    		
	    	// 	// console_logs('rec', rec);
	    	// }
		},
	labEditHandler:function(selection) {
		var file_code = gUtil.RandomString(10);
		var board_content = selection.get('board_content');
		var board_title = selection.get('board_title');
		var board_uid = selection.get('unique_id');
		var docu_items = [];

		Ext.each(this.columns, function(columnObj, index) {
			var dataIndex = columnObj["dataIndex"];
			var text = columnObj["text"];
			var type = columnObj["dataType"];
			var xtype = null;
			var check = dataIndex.substr(0,2);

			switch(type) {
				case 'string':
					xtype = 'textfield';
				break;
				case 'int':
					xtype = 'numberfield';
				break;
				case 'sdate':
					xtype = 'datefield';
				break;
				default:
					xtype = 'textfield';
				break;
			}

			var record = gm.me().docuStore.data.items[0];
			var val = record.get(dataIndex);

			if(check == 'v0') {				
				docu_items.push(
					{
						xtype:xtype,
						id:dataIndex,
						name:dataIndex,
						fieldLabel:text,
						width:500,
						height:50,
						value:val
					}
				)
			}			
		});

		var form_docu = Ext.create('Ext.form.Panel', {
			id: gu.id('formPanelDocu'),
			xtype: 'form',
			title: '추가정보',
			frame: false,
			border: false,
			width: 1000,
			height: 400,
			autoScroll:true,
			bodyPadding: '3 3 0',
			region: 'center',
			fieldDefaults: {
				labelAlign: 'right',
				msgTarget: 'side'
			},
			// defaults: {
			// 	anchor: '100%',
			// 	labelWidth: 60,
			// 	margins: 60
			// },
			items: docu_items
			
		});

		var form = Ext.create('Ext.form.Panel', {
			id: gu.id('formPanel'),
			xtype: 'form',
			title: '기본정보',
			frame: false,
			border: false,
			width: 1000,
			height: 400,
			bodyPadding: '3 3 0',
			region: 'center',
			fieldDefaults: {
				labelAlign: 'right',
				msgTarget: 'side'
			},
			// defaults: {
			// 	anchor: '100%',
			// 	labelWidth: 60,
			// 	margins: 60
			// },
			items: [
				{
					xtype: 'fieldset',
					title: '입력사항',
					// collapsible: true,
					items: [
						new Ext.form.Hidden({
                            name: 'gubun',
                            value: 'IB' // Lab
						}),
						new Ext.form.Hidden({
                            name: 'board_count',
                            value: 0
						}),
						new Ext.form.Hidden({
                            name: 'board_uid',
                            value: board_uid
				        }),		
						{
							xtype: 'textfield',
							fieldLabel: '제목',
							id: 'board_title',
							name: 'board_title',
							width: 500,
							allowBlank: false,
							value: board_title
						},{
							xtype: 'textfield',
							fieldLabel: '사용자아이디',
							id: 'user_id',
							name: 'user_id',
							fieldStyle: 'background-color: #E7E6E6; background-image: none;',
							editable: false,
							width: 200,
							allowBlank: false,
							value: 'root',
						},{
							xtype: 'textarea',
							fieldLabel: '내용',
							id: 'board_content',
							name: 'board_content',
							width: 800,
							height: 300,
							maxLength: 255,
							value: board_content
						}
					]
				}
			]
		});

		this.attachedFileStore.getProxy().setExtraParam('group_code',board_uid);
		this.attachedFileStore.load();

		var attachFileGrid = Ext.create('Ext.grid.Panel', {
			title: '첨부파일',
			store: this.attachedFileStore,
			layout:'fit',
			columns : [
				{text: "UID", width: 120, dataIndex: 'unique_id', sortable: true},
				{text: "파일명", flex: 1, dataIndex: 'object_name', sortable: true},
				{text: "날짜", width: 125, dataIndex: 'create_date', sortable: true},
				{text: "크기", width: 125, dataIndex: 'file_size', sortable: true}
			],
			border : false,
			multiSelect: false,
			frame: false,
			dockedItems: [{
				dock : 'top',
				xtype: 'toolbar',
				cls: 'my-x-toolbar-default1',
				items:[
					{
						xtype: 'button',
						text: '파일 첨부',
						scale: 'small',
						glyph: 'xf0c6@FontAwesome',
						scope : this.attachFileGrid,
						handler : function() {
							
							var url =  CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' + file_code + '&group_code=' + null;

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
								
								gm.me().attachedFileStore.getProxy().setExtraParam('item_code', file_code);
								gm.me().attachedFileStore.load();

                                uploadDialog.show();
						}
					},
				]
			}]
		})

		var prWin = Ext.create('ModalWindow', {
			modal: true,
			title: '수정',
			plain:true,
			width: 1100,
			height: 600,
			items: [
				{
					region: 'center',
					xtype: 'tabpanel',
					items: [form, form_docu, attachFileGrid]
				}
			],
			buttons: [{
				text: CMD_OK,
				handler: function(btn) {
					if(btn == "no") {
						prWin.close();
					} else {
						if(form.isValid()) {
							var val = form.getValues(false);
							var val2 = form_docu.getValues(false);

							form.submit({
								url: CONTEXT_PATH + '/admin/board.do?method=createBoardDocu',
								params: val2,
								success: function(result, response) {
									console_logs('result', result);
									console_logs('response', response);
									prWin.close();
									gm.me().store.load();
								},
								failure: extjsUtil.failureMessage
							})
						}
					}
				}
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
	labRegistHandler: function() {
		var file_code = gUtil.RandomString(10);

		console_logs('==z', this.columns);

		var docu_items = [];

		Ext.each(this.columns, function(columnObj, index) {
			var dataIndex = columnObj["dataIndex"];
			var text = columnObj["text"];
			var type = columnObj["dataType"];
			var xtype = null;
			var check = dataIndex.substr(0,2);

			switch(type) {
				case 'string':
					xtype = 'textfield';
				break;
				case 'int':
					xtype = 'numberfield';
				break;
				case 'sdate':
					xtype = 'datefield';
				break;
				default:
					xtype = 'textfield';
				break;
			}

			if(check == 'v0') {
				docu_items.push(
					{
						xtype:xtype,
						id:dataIndex,
						name:dataIndex,
						fieldLabel:text,
						width:500,
						height:50
					}
				)
			}			
		});

		console_logs('=zasd', docu_items);

		var form = Ext.create('Ext.form.Panel', {
			id: gu.id('formPanel'),
			xtype: 'form',
			title: '기본정보',
			frame: false,
			border: false,
			width: 1000,
			height: 400,
			autoScroll:true,
			bodyPadding: '3 3 0',
			region: 'center',
			fieldDefaults: {
				labelAlign: 'right',
				msgTarget: 'side'
			},
			// defaults: {
			// 	anchor: '100%',
			// 	labelWidth: 60,
			// 	margins: 60
			// },
			items: [
				{
					xtype: 'fieldset',
					title: '입력사항',
					// collapsible: true,
					items: [
						new Ext.form.Hidden({
                            name: 'gubun',
                            value: 'IB' // Lab
						}),
						new Ext.form.Hidden({
							name: 'menu_code',
							value: 'INNB_CLD'
						}),
						new Ext.form.Hidden({
                            name: 'board_count',
                            value: 0
						}),
						new Ext.form.Hidden({
                            name: 'file_code',
                            value: file_code
				        }),
						{
							xtype: 'textfield',
							fieldLabel: '제목',
							id: 'board_title',
							name: 'board_title',
							width: 500,
							allowBlank: false
						},{
							xtype: 'textfield',
							fieldLabel: '사용자아이디',
							id: 'user_id',
							name: 'user_id',
							fieldStyle: 'background-color: #E7E6E6; background-image: none;',
							editable: false,
							width: 200,
							allowBlank: false,
							value: 'root',
						},{
							xtype: 'textarea',
							fieldLabel: '내용',
							id: 'board_content',
							name: 'board_content',
							width: 800,
							height: 300,
							maxLength: 255
						}
					]
				}
			]
		});

		var form_docu = Ext.create('Ext.form.Panel', {
			id: gu.id('formPanelDocu'),
			xtype: 'form',
			title: '추가정보',
			frame: false,
			border: false,
			width: 1000,
			height: 400,
			autoScroll:true,
			bodyPadding: '3 3 0',
			region: 'center',
			fieldDefaults: {
				labelAlign: 'right',
				msgTarget: 'side'
			},
			// defaults: {
			// 	anchor: '100%',
			// 	labelWidth: 60,
			// 	margins: 60
			// },
			items: docu_items
			
		});

		var attachFileGrid = Ext.create('Ext.grid.Panel', {
			title: '첨부파일',
			store: this.attachedFileStore,
			layout:'fit',
			columns : [
				{text: "UID", width: 120, dataIndex: 'unique_id', sortable: true},
				{text: "파일명", flex: 1, dataIndex: 'object_name', sortable: true},
				{text: "날짜", width: 125, dataIndex: 'create_date', sortable: true},
				{text: "크기", width: 125, dataIndex: 'file_size', sortable: true}
			],
			border : false,
			multiSelect: false,
			frame: false,
			dockedItems: [{
				dock : 'top',
				xtype: 'toolbar',
				cls: 'my-x-toolbar-default1',
				items:[
					{
						xtype: 'button',
						text: '파일 첨부',
						scale: 'small',
						glyph: 'xf0c6@FontAwesome',
						scope : this.attachFileGrid,
						handler : function() {
							
							var url =  CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' + file_code + '&group_code=' + null;

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
								
								gm.me().attachedFileStore.getProxy().setExtraParam('item_code', file_code);
								gm.me().attachedFileStore.load();

                                uploadDialog.show();
						}
					},
				]
			}]
		});

		console_logs('---zas', form_docu.items);

		var win_form = [];
		if(form_docu.items.length > 0) {
			win_form.push(form);
			win_form.push(form_docu);
			win_form.push(attachFileGrid);
		} else {
			win_form.push(form);
			win_form.push(attachFileGrid);
		}

		var prWin = Ext.create('ModalWindow', {
			modal: true,
			title: '등록',
			plain:true,
			width: 1100,
			height: 600,
			items: [
				{
					region: 'center',
					xtype: 'tabpanel',
					items: win_form
				}
			],
			buttons: [{
				text: CMD_OK,
				handler: function(btn) {
					if(btn == "no") {
						prWin.close();
					} else {
						if(form.isValid()) {
							var val = form.getValues(false);
							var val2 = form_docu.getValues(false);

							form.submit({
								url: CONTEXT_PATH + '/admin/board.do?method=createBoardDocu',
								params: val2,
								success: function(result, response) {
									console_logs('result', result);
									console_logs('response', response);
									prWin.close();
									gm.me().store.load();
								},
								failure: extjsUtil.failureMessage
							})
						}
					}
				}
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
	
	attachedFileStore : Ext.create('Mplm.store.AttachedFileStore', {group_code: null} ),

	docuStore : Ext.create('Mplm.store.DocuStore'),
	
});
