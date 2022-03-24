/**
 * This example shows how to create a grid from Array data. The grid is stateful so you
 * can move or hide columns, reload the page, and come back to the grid in the same state
 * you left it in.
 *
 * The cells are selectable due to use of the `enableTextSelection` option.
 */
Ext.define('Rfx.view.qualManage.QualDisplaySet', {
    extend: 'Rfx.base.BaseView',
    xtype: 'qual-display-set',
    initComponent: function(){
    	
    	this.initDefValue();
		
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

		var CommonCodeStore = Ext.create('Mplm.store.CommonCodeStore', {parentCode:"INPUT_TYPE"});

		Ext.each(this.columns, function(columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            //console_logs('columnObj', columnObj);
            switch (dataIndex) {
				case 'input_type_str':
					columnObj["editor"] = {
						xtype:'combo',
						store:CommonCodeStore,
						displayField:'systemCode',
						valueField:'systemCode',
						id:'input_type',
						listConfig:{
							getInnerTpl: function(){
								return '<div data-qtip="{systemCode}">{systemCode}</div>';
							}
						}
					};
                    columnObj["css"] = 'edit-cell';
                    columnObj["renderer"] = function(value, meta) {
						meta.css = 'custom-column';
                        return value;
                    };
                    break;
				case 'description_str':
					columnObj["editor"] = {};
                    columnObj["css"] = 'edit-cell';
                    columnObj["renderer"] = function(value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    };
                    break;
				case 'code_name_kr':
				case 'code_order':
                    columnObj["editor"] = {};
                    columnObj["css"] = 'edit-cell';
                    columnObj["renderer"] = function(value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    };
                    break;
            }

        });

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

		this.addSearchField(
			{
				type:'combo',
				field_id:'parent_system_code',
				id:'parent_system_code',
				name:'parent_system_code',
				store: 'QualMenuObjectStore',
				displayField : 'display_name_ko',
				valueField: 'menu_key',
				emptyText:'메뉴코드',
				innerTpl: '<div data-qtip="{parent_system_code}">{display_name_ko}</div>'
			}
		);

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		//명령툴바 생성
		var buttonToolbar = this.createCommandToolbar({
			REMOVE_BUTTONS: ['REGIST', 'COPY', 'REMOVE']
		});
		
		   //모델 정의
        this.createStore('Rfx.model.Code', [{
	            property: 'create_date',
	            direction: 'DESC'
	        }],
	        /*pageSize*/
	        gMain.pageSize
	        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
        	//Orderby list key change
        	//ordery create_date -> p.create로 변경.
	        ,
        	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
        	['code']
			);
		// var parent_system_code = 'LAB1';
		// console_logs('===parent_system_code',  this.searchToolbar['items']['items'][0]['value']);
		// this.store.getProxy().setExtraParam('parent_system_code', parent_system_code);
		// this.store.load();

		this.labRegistAction = Ext.create('Ext.Action', {
        	iconCls: 'af-plus-circle',
        	text: '추가',
        	tooltip: '컬럼 추가',
        	disabled: false,
        	handler: function() {		 	
			 	gMain.selPanel.labColumnRegistHandler();
        	}
		});
		
		(buttonToolbar.items).each(function(item,index,length){
        	if(index==1 || index==2) {
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
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
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
		
	   this.grid.on('edit', function(editor, e) {
		   var rec = e.record;
		   console_logs('==rec', e);
		   var field = e['field'];
			  console_logs('==field', field);

		   var unique_id = rec.get('unique_id_long');

		   var code_name_kr = null;
		   var input_type = null;
		   var dis_order = null;
		   var width = null;

		   if(field == 'input_type_str') {
			 input_type = rec.get('input_type_str');
		   } else if(field == 'code_name_kr') {
			 code_name_kr = rec.get('code_name_kr')
		   } else if(field == 'code_order') {
			 dis_order = rec.get('code_order');  
		   } else {
			   width = rec.get('description_str');
		   }

		   Ext.Ajax.request({
                url: CONTEXT_PATH + '/admin/codeStructure.do?method=editLabSet',
                params: {
					unique_id:unique_id,
					code_name_kr:code_name_kr,
					input_type:input_type,
					dis_order:dis_order,
					width:width
                },
                success: function(result, request) {
					var result = result.responseText;
					gm.me().store.load();
                    // console_logs("", result);

                },
                failure: extjsUtil.failureMessage
            });
	   })
	

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
		var board_content = selection.get('board_content');
		var board_title = selection.get('board_title');
		var board_uid = selection.get('unique_id');

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
                            value: 'L' // Lab
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
					items: form
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

							form.submit({
								url: CONTEXT_PATH + '/admin/board.do?method=createBoard',
								params: val,
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
	labColumnRegistHandler: function() {
		var parent_system_code = this.searchToolbar['items']['items'][0]['value'];
		if(parent_system_code == null || parent_system_code == '' || parent_system_code == undefined) {
			Ext.Msg.alert('알림','메뉴코드를 선택해 주세요.');
			return;
		} 

		// 선택된 메뉴코드에 대한 Row 추가(J2_CODE)
		Ext.Ajax.request({
			url: CONTEXT_PATH + '/admin/mescode.do?method=addDisplaySetRow',
			params:{
				parent_system_code:parent_system_code
			},
			
			success : function(result, request) { 
				gMain.selPanel.store.load();
				
			},// endofsuccess
			failure: extjsUtil.failureMessage
		});// endofajax
	},

	
});
