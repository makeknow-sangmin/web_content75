Ext.define('Rfx2.view.company.dabp01kr.criterionInfo.UserView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'user-view',
    initComponent: function() {
    	this.initDefValue();
    	
    	//검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.addSearchField('unique_id');
        this.addSearchField('user_id');
        this.addSearchField('user_name');
        this.addSearchField('email');

        this.addSearchField({
            type: 'radio',
            field_id :'delete_flag',
            items: [
                {
                    text :  '재직',
                    name : 'delete_flag',
                    value: 'N',
                    checked: true
                },
                {
                    text :  '퇴사',
                    name : 'delete_flag',
                    value: 'Y',
                    checked: false
                }
            ]
        });
        
        Ext.each(this.columns, function(columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            //console_logs('columnObj', columnObj);
            switch (dataIndex) {
                case 'reg_no':
                columnObj['renderer'] = function(value) {
                    if(value != null && value.length > 0) {
                        try {
                            value = value.split('-')[0] + '-*******';
                        } catch (error) {
                            value = '';
                        }
                    }
                    return value;
                }
                break;
            }
        });
//        this.setDefValue('wa_code','PAMT01KR');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar2();
        
        //console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.UsrAst', [{
            property: 'unique_id',
            direction: 'DESC'
        }],
        10000/*pageSize*/
        ,{}
        , ['usrast']
        );

        
//        for(var i=0; i< this.columns.length; i++) {
//        	var o = this.columns[i];
//            	o['field'] = {
//		    			xtype:  'textfield'
//		            };
//        }

//        var option = {
//        		plugins: [Ext.create('Ext.grid.plugin.CellEditing')]
//        };
        this.createGrid(searchToolbar, buttonToolbar);
        
        //this.createGridCore([searchToolbar, buttonToolbar], option);
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

        this.addUserButton = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '신규등록',
            tooltip: '신규등록',
            disabled: false,
            handler: function() {
               gm.me().addUserView();
            }
        });

        buttonToolbar.items.each(function(item, index, length) {
            if(index == 1) {
                buttonToolbar.items.remove(item);
            }
        })
        
        buttonToolbar.insert(1, this.addUserButton);
        
        this.callParent(arguments);
        this.store.getProxy().setExtraParam('delete_flag', 'N');
        
        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function(records){});
        
    },
    items: [],

    addUserView: function() {
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
            // defaults: {
            //     layout: 'form',
            //     xtype: 'container',
            //     defaultType: 'textfield',
            //     style: 'width: 100%'
            // },
            items: [
                {
                    xtype: 'fieldset',
                    title: '정보입력',
                    frame: true,
                    layout: 'fit',
                    items: [
                        new Ext.form.Hidden({
                            name: 'dept_code',
                            id: 'dept_code',
                        }),
                        new Ext.form.Hidden({
							name: 'dept_name',
                            id: 'dept_name',
						}),
                        {
                            fieldLabel: '사용자ID',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: false,
                            id:'user_id',
                            name:'user_id'
                        },{
                            fieldLabel: '이름',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: false,
                            id:'user_name',
                            name:'user_name'
                        },{
                            fieldLabel: '부서',
                            xtype: 'combo',
                            anchor: '100%',
                            id:'unique_id_comdst',
                            name:'unique_id_comdst',
                            store: this.deptStore,
                            displayField:'dept_name',
                            valueField: 'unique_id',
                            allowBlank: false,
                            innerTpl: "<div>[{dept_code}] {dept_name}</div>",
                            listeners: {
                                select: function(grid, data) {
                                    Ext.getCmp('dept_code').setValue(data.get('dept_code'));
                                    Ext.getCmp('dept_name').setValue(data.get('dept_name'));

                                }
                            }
                        }, {
                            fieldLabel: '권한',
                            xtype: 'combo',
                            multiSelect: true,
                            anchor: '100%',
                            store: this.roleCodeStore,
                            id:'user_type',
                            name:'user_type',
                            displayField:'role_name',
                            valueField: 'role_code',
                            allowBlank: false,
                            innerTpl: "<div>[{role_code}] {role_name}</div>"
                        },{
                            fieldLabel: '직급',
                            xtype: 'textfield',
                            anchor: '100%',
                            id:'position',
                            name:'position'
                        },{
                            fieldLabel: '전화번호',
                            xtype: 'textfield',
                            anchor: '100%',
                            id:'tel_no',
                            name:'tel_no'
                        },{
                            fieldLabel: '내선번호',
                            xtype: 'textfield',
                            anchor: '100%',
                            id:'extension_no',
                            name:'extension_no'
                        },{
                            fieldLabel: '휴대폰',
                            xtype: 'textfield',
                            anchor: '100%',
                            id:'hp_no',
                            name:'hp_no'
                        },{
                            fieldLabel: 'E-Mail',
                            xtype: 'textfield',
                            anchor: '100%',
                            id:'email',
                            name:'email'
                        },{
                            fieldLabel: '주소',
                            xtype: 'textfield',
                            anchor: '100%',
                            id:'address_1',
                            name:'address_1'
                        },{
                            fieldLabel: '보안등급',
                            xtype: 'textfield',
                            anchor: '100%',
                            id:'user_grade',
                            name:'user_grade',
                            value: 'C'
                        }
                    ]
                },
                
            ]
        });

       var prWin = Ext.create('Ext.Window', {
                modal: true,
                title: '신규등록',
                width: 350,
                height: 400,
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
                                console_logs('===val', val);

                                Ext.Ajax.request({
                                url: CONTEXT_PATH + '/userMgmt/user.do?method=create',
                                params: val,
                                success: function(result, request) {
                                    if(prWin) {
                                        prWin.close();
                                    }
                                    gm.me().store.load();
                                }, //endofsuccess
                                failure: extjsUtil.failureMessage
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
        prWin.show();
    },
    
    deptStore: Ext.create('Mplm.store.DeptStore', {}),

    roleCodeStore: Ext.create('Mplm.store.UserRoleCodeStore', {}),
    
    /**
     * 무한 그리드 사용
     */
   /* //Page toolbar 사용
    usePagingToolbar: false,
    //goto page
    useGotoToolbar: true,
    //FullPage Buffering
    bufferingStore: true*/
});