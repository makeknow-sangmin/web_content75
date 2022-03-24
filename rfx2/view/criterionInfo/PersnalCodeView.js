Ext.define('Rfx2.view.criterionInfo.PersnalCodeView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'persnal-code-view',
    //items: [{html: 'Rfx.view.criterionInfo.CodeView'}],
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();
 
    	this.setDefComboValue('parent_system_code', 'valueField', '1');//ComboBOX의 ValueField 기준으로 디폴트 설정.
    	this.setDefComboValue('use_yn', 'valueField', 'Y');
    	this.setDefComboValue('discriptionSortable','displayField','true')
//    	this.setDefComboValue('role_code', 'string');
//    	this.setDefValue('descriptionWidth','100');
//    	this.setDefValue('input_type', '{xtype: "textfield"}');
//    	this.setDefValue('create_ep_id', '{tabTitle:"입력항목", tableName:"", position:"center"}');
//    	this.setDefValue('member_type', '{canEdit:true, canCreate:true, canView:true, size:100}');
//    	this.setDefValue('code_order', '100');

    	
		this.addSearchField({
				field_id:		'parent_system_code',
	            displayField:   'display_name_ko',
	            valueField:     'child',
	            store: 			'MenuCodeStore',
	            innerTpl: 		'<div>{display_name_ko}</div>'	
		
   });
	// 	this.addSearchField({
	// 			field_id:		'parent_system_code',
	//             displayField:   'system_code',
	//             valueField:     'system_code',
	//             store: 			'ParentMenuCodeStore',
	//             innerTpl: 		'<div>{parent_system_code} - {code_name_kr} [{systemCode}]</div>',
	//             width: 300
		
    // });
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        

        //2020.10.27 KNH
        //등록, 수정(기존), 복사등록, 삭제버튼 삭제
        (buttonToolbar.items).each(function(item,index,length){
      	  if(index==1||index==2||index==3||index==5) {
            	buttonToolbar.items.remove(item);
      	  }
        });


        this.modifyMenuUserButton = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-edit',
            text: gm.getMC('CMD_MODIFY', '수정'),
            tooltip: '수정하기',
            disabled: true,
            handler: function() {
               
                gm.me().modifyMenuUserView();
            }
        });

        buttonToolbar.insert(2, this.modifyMenuUserButton);

        //모델 정의
        this.createStore('Rfx.model.PersnalCode', [{
            property: 'parent_system_code',
            direction: 'ASC'
	        }],
	        gMain.pageSize/*pageSize*/
	        ,{}
        ,['code']
	        );
				
        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });


        //수정버튼 콜백
        this.setGridOnCallback(function(selections) {
            console_logs('>>>>callback', selections);
            if(selections != null && selections.length > 0) {
                this.modifyMenuUserButton.enable();
            } else {
                this.modifyMenuUserButton.disable();
            }
        });

        this.callParent(arguments);
        
      //디폴트 로드
        gMain.setCenterLoading(false);
        // this.store.load(function(records){});

    },
    items : [],

    //수정폼
    modifyMenuUserView: function() {
        var rec = gm.me().grid.getSelectionModel().getSelection()[0];
        console_logs('>>>>>rrr', rec);

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
                            id: 'unique_id',
                            value: rec.get('unique_id_long')
                        }),
                        new Ext.form.Hidden({
                            name: 'dept_code',
                            id: 'dept_code',
                        }),
                        new Ext.form.Hidden({
                            name: 'dept_name',
                            id: 'dept_name',
                        }),
                        {
                            fieldLabel: '메뉴 그룹',
                            xtype: 'textfield',
                            anchor: '100%',
                            readOnly:true,
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            id:'parent_system_code',
                            name:'parent_system_code',
                            value:rec.get('parent_system_code')
                        },{
                            fieldLabel: '메뉴 코드',
                            xtype: 'textfield',
                            anchor: '100%',
                            readOnly:true,
                            allowBlank: false,
                            id:'system_code',
                            name:'system_code',
                            value:rec.get('system_code')
                        },{
                            fieldLabel: '컬럼명',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            id:'culumn_name',
                            name:'culumn_name',
                            value:rec.get('culumn_name')
                        },{
                            fieldLabel: '영문명',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            id:'code_name_en',
                            name:'code_name_en',
                            value:rec.get('code_name_en')
                        },{
                            fieldLabel: '중국어명',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            id:'code_name_zh',
                            name:'code_name_zh',
                            value:rec.get('code_name_zh')
                        },{
                            fieldLabel: '표시여부',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            id:'use_yn',
                            name:'use_yn',
                            value:rec.get('use_yn')
                        },{
                            fieldLabel: '순서',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            id:'code_order',
                            name:'code_order',
                            value:rec.get('code_order')
                        },{
                            fieldLabel: '필드폭',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            id:'descriptionWidth',
                            name:'descriptionWidth',
                            value:rec.get('descriptionWidth')
                        },{
                            fieldLabel: '데이터유형',
                            xtype: 'textfield',
                            anchor: '100%',
                            readOnly:true,
                            allowBlank: true,
                            id:'role_code',
                            name:'role_code',
                            value:rec.get('role_code')
                        },{
                            fieldLabel: '정렬기준',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            id:'descriptionSortable',
                            name:'descriptionSortable',
                            value:rec.get('descriptionSortable')
                        },{
                            fieldLabel: '수정일자',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            readOnly:true,
                            id:'create_date',
                            name:'create_date',
                            value:rec.get('create_date')
                        },
                        // {
                        //     fieldLabel: '부서',
                        //     xtype: 'combo',
                        //     anchor: '100%',
                        //     id:'unique_id_comdst',
                        //     name:'unique_id_comdst',
                        //     store: gm.me().deptStore,
                        //     displayField:'dept_name',
                        //     valueField: 'unique_id',
                        //     allowBlank: true,
                        //     value:rec.get('unique_id_comdst'),
                        //     listConfig: {
                        //         getInnerTpl: function() {
                        //             return '<div data-qtip="{dept_code}">{dept_name}</div>';
                        //         }
                        //     },
                        //     // innerTpl: "<div>[{dept_code}] {dept_name}</div>",
                        //     listeners: {
                        //         select: function(grid, data) {
                        //             Ext.getCmp('dept_code').setValue(data.get('dept_code'));
                        //             Ext.getCmp('dept_name').setValue(data.get('dept_name'));

                        //         }
                        //     }
                        // }, {
                            /* 권한은 별도 입력 */
                            //     fieldLabel: '권한',
                            //     xtype: 'combo',
                            //     multiSelect: true,
                            //     anchor: '100%',
                            //     store: this.roleCodeStore,
                            //     id:'user_type',
                            //     name:'user_type',
                            //     displayField:'role_name',
                            //     valueField: 'role_code',
                            //     allowBlank: true,
                            //     // value:rec.get('user_type'),
                            //     listConfig: {
                            //         getInnerTpl: function() {
                            //             return '<div data-qtip="{role_code}">{role_name}</div>';
                            //         }
                            //     },
                            //     // innerTpl: "<div>[{role_code}] {role_name}</div>"
                            // }
                    ]
                },

            ]
        });

        var myWidth = 310;
        var myHeight = 420;

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '수정',
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function(btn) {
                    if(btn == 'no') {
                        prWin.close();
                    } else {

                        if(form.isValid()) {
                            var val = form.getValues(false);
                            prWin.setLoading(true);

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/admin/codeStructure.do?method=updatePersnalCode',
                                params: val,
                                success: function(result, request) {
                                    if(prWin) {
                                        prWin.setLoading(false);
                                        prWin.close();
                                    }
                                    gm.me().store.load();
                                }, //endofsuccess
                                failure: function() {
                                    prWin.setLoading(false);
                                    extjsUtil.failureMessage();
                                }
                            }); //endofajax
                        }
                    }
                }
            }, {
                text: CMD_CANCEL,
                handler: function() {
                    if(prWin) {
                        prWin.close();
                    }
                }
            }
            ]
        });
        prWin.show(this, function() {
            var combo = Ext.getCmp('unique_id_comdst');
            var val = combo.getValue();
            var record = combo.findRecordByValue(val);
            if(record!=null) {
                combo.select(record);
            }

        });
    },
});