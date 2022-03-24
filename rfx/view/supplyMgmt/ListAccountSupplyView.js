Ext.define('Rfx.view.supplyMgmt.ListAccountSupplyView', {
    extend: 'Rfx.base.BaseView',
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

        Ext.each(this.columns, function(columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            console_logs('columnObj', columnObj);
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

        this.createStore('Rfx.model.UsrAstSupplier', [{
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
            //items: [this.grid,  this.crudTab]
            items: [this.grid]
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

        this.modifyUserButton = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-edit',
            text: gm.getMC('CMD_MODIFY', '수정'),
            tooltip: '수정하기',
            disabled: true,
            handler: function() {
                gm.me().deptStore.load();
                gm.me().roleCodeStore.load();
                gm.me().modifyUserView();
            }
        });

        this.changePwdButton =  Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-edit',
            text: '암호 변경',
            tooltip: '사용자 암호를 변경합니다.',
            disabled: true,
            handler: function() {
                gm.me().changePwdView();
            }
        });

        this.deleteUserButton =  Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-remove',
            text: gm.getMC('CMD_DELETE', '삭제'),
            tooltip: '삭제하기',
            disabled: true,
            handler: function() {
                Ext.MessageBox.show({
                    title: '삭제하기',
                    msg: '선택한 항목을 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: gm.me().deleteUserConfirm,
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

    

        buttonToolbar.items.each(function(item, index, length) {
                if(vCUR_LOGIN_ID==vCUR_USER_ID){
                    if(index == 1 || index == 2 || index == 3 || index == 4 || index == 5 || index == 7) {
                        buttonToolbar.items.remove(item);
                    }
                }else{
                    
                        buttonToolbar.items.remove(item);
                  
                }
            
        })

        if(vCUR_LOGIN_ID==vCUR_USER_ID){
            buttonToolbar.insert(1, this.addUserButton);
            buttonToolbar.insert(2, this.deleteUserButton);
        }else{
            buttonToolbar.insert(1, this.changePwdButton);
        }
        //buttonToolbar.insert(2, this.modifyUserButton);

        this.callParent(arguments);
        this.store.getProxy().setExtraParam('delete_flag', 'N');
        this.SupastStore.getProxy().setExtraParam('menuCode', this.link);


        this.setGridOnCallback(function(selections) {
            console_logs('>>>>callback', selections);
            if(selections != null && selections.length > 0) {
                this.modifyUserButton.enable();
                this.changePwdButton.enable();
                this.deleteUserButton.enable();
            } else {
                this.modifyUserButton.disable();
                this.changePwdButton.disable();
                this.deleteUserButton.disable();
            }
        });
        console_logs('>>>>callback');
        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function(records){
        });
    },
    items: [],

    addUserView: function() {
        this.SupastStore.getProxy().setExtraParam('menuCode', this.link);
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
                    title: '공급사 선택',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '공급사',
                            xtype: 'combo',
                            anchor: '100%',
                            id:'supast',
                            name:'unique_id_comdst',
                            store: this.SupastStore,
                            displayField:'supplier_name',
                            valueField: 'unique_id',
                            allowBlank: false,
                            sortInfo: { field: 'supplier_name', direction: 'ASC' },
                            innerTpl: '<div data-qtip="{unique_id}">[{supplier_code}] {supplier_name}</div>',
                            listeners: {
                                select: function(grid, data) {
                                    Ext.getCmp('user_name').setValue(data.get('supplier_name'));
                                    Ext.getCmp('address_1').setValue(data.get('address_1'));
                                    Ext.getCmp('supLoginId').setValue(data.get('unique_id'));                                    
                                    
                                    //Ext.getCmp('dept_code').setValue();
                                    console_logs("dept  data  ", data);

                                }
                            },
                            minChars: 1,
                            listConfig:{
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                  getInnerTpl: function(){
                                      return '<div data-qtip="{unique_id}">[{supplier_code}] {supplier_name}</div>';
                                  }
                            }
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: '공급사 정보',
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
                            id: 'dept_code',
                            value: 'B01'
                        }),
                        new Ext.form.Hidden({
                            name: 'unique_id_comdst',
                            id: 'unique_id_comdst',
                            value: '79090000011'
                        }),
                        new Ext.form.Hidden({
                            name: 'dept_name',
                            id: 'dept_name',
                            value: '공급사'
                        }),
                        new Ext.form.Hidden({
                            name: 'supLoginId',
                            id: 'supLoginId'
                        }),
                        new Ext.form.Hidden({
                            name: 'user_type',
                            id: 'user_type',
                            value: 'SUP'
                        }),
                        {
                            fieldLabel: '공급사명',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: false,
                            id:'user_name',
                            name:'user_name'
                        },{
                            fieldLabel: '주소',
                            xtype: 'textfield',
                            anchor: '100%',
                            id:'address_1',
                            name:'address_1'
                        }
                    ]
                },{
                    xtype: 'fieldset',
                    title: '계정 등록',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items:[{
                        fieldLabel: '사용자ID',
                        xtype: 'textfield',
                        id:'user_id',
                        name:'user_id'
                    }]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '신규등록',
            width: 310,
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

                            // Ext.Ajax.request({
                            //     url: CONTEXT_PATH + '/userMgmt/user.do?method=create',
                            //     params: val,
                            //     success: function(result, request) {
                            //         if(prWin) {
                            //             prWin.close();
                            //         }
                            //         gm.me().store.load();
                            //     }, //endofsuccess
                            //     failure: extjsUtil.failureMessage
                            // }); //endofajax

                            // User Id 중복확인
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/userMgmt/user.do?method=userCheck',
                                params: {
                                    user_id:val['user_id']
                                },
                                success: function(result, request) {
                                    var jsonData = Ext.decode(result.responseText);
                                    console_logs('>>> jsonData', jsonData);
                                    var records = jsonData.datas;
                                    var cnt = jsonData['count'];
                                    console_logs('>>> records', records);

                                    if(cnt < 1) {
                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/userMgmt/user.do?method=create',
                                            params: val,
                                            success: function(result, request) {
                                                if(prWin) {
                                                    prWin.close();
                                                    gm.me().SupastStore.getProxy().setExtraParam('menuCode', '');
                                                    gm.me().store.load(function() {
                                
                                                        gm.me().grid.setLoading(false);
                                                    });
                                                }
                                               
                                            }, //endofsuccess
                                            failure: extjsUtil.failureMessage
                                        }); //endofajax
                                    } else {
                                        Ext.MessageBox.alert(error_msg_prompt, '중복된 사용자ID가 있습니다.');
                                    }

                                    

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
                        gm.me().SupastStore.getProxy().setExtraParam('menuCode', '');
                    }
                }
            }
            ]
        });
        prWin.show();
        
    },

    modifyUserView: function() {
        var rec = gm.me().grid.getSelectionModel().getSelection()[0];
        this.SupastStore.getProxy().setExtraParam('menuCode', this.link);
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
                    title: '공급사 선택',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '공급사',
                            xtype: 'combo',
                            anchor: '100%',
                            id:'supast',
                            name:'unique_id_comdst',
                            store: this.SupastStore,
                            displayField:'supplier_name',
                            valueField: 'unique_id',
                            allowBlank: false,
                            innerTpl: "<div>[{dept_code}] {dept_name}</div>",
                            listeners: {
                                select: function(grid, data) {
                                    Ext.getCmp('user_name').setValue(data.get('supplier_name'));
                                    Ext.getCmp('address_1').setValue(data.get('address_1'));
                                    Ext.getCmp('supLoginId').setValue(data.get('unique_id'));                                    
                                    
                                    //Ext.getCmp('dept_code').setValue();
                                    console_logs("dept  data  ", data);

                                }
                            }
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: '공급사 정보',
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
                            id: 'dept_code',
                            value: 'B01'
                        }),
                        new Ext.form.Hidden({
                            name: 'unique_id_comdst',
                            id: 'unique_id_comdst',
                            value: '79090000011'
                        }),
                        new Ext.form.Hidden({
                            name: 'dept_name',
                            id: 'dept_name',
                            value: '공급사'
                        }),
                        new Ext.form.Hidden({
                            name: 'supLoginId',
                            id: 'supLoginId'
                        }),
                        new Ext.form.Hidden({
                            name: 'user_type',
                            id: 'user_type',
                            value: 'SUP'
                        }),
                        {
                            fieldLabel: '공급사명',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: false,
                            id:'user_name',
                            name:'user_name'
                        },{
                            fieldLabel: '주소',
                            xtype: 'textfield',
                            anchor: '100%',
                            id:'address_1',
                            name:'address_1'
                        }
                    ]
                },{
                    xtype: 'fieldset',
                    title: '계정 등록',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items:[{
                        fieldLabel: '사용자ID',
                        xtype: 'textfield',
                        id:'user_id',
                        name:'user_id'
                    }]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '신규등록',
            width: 310,
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

                            // User Id 중복확인
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/userMgmt/user.do?method=userCheck',
                                params: {
                                    user_id:val['user_id']
                                },
                                success: function(result, request) {
                                    var jsonData = Ext.decode(result.responseText);
                                    console_logs('>>> jsonData', jsonData);
                                    var records = jsonData.datas;
                                    var cnt = jsonData['count'];
                                    console_logs('>>> records', records);

                                    if(cnt < 1) {
                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/userMgmt/user.do?method=create',
                                            params: val,
                                            success: function(result, request) {
                                                if(prWin) {
                                                    prWin.close();
                                                    this.SupastStore.getProxy().setExtraParam('menuCode', '');
                                                }
                                                gm.me().store.load();
                                            }, //endofsuccess
                                            failure: extjsUtil.failureMessage
                                        }); //endofajax
                                    } else {
                                        Ext.MessageBox.alert(error_msg_prompt, '중복된 사용자ID가 있습니다.');
                                    }

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
                        gm.me().SupastStore.getProxy().setExtraParam('menuCode', '');
                    }
                }
            }
            ]
        });
        prWin.show();
    },

    changePwdView: function() {
        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
        var rec = selections[0];
        var pwChangeForm = Ext.create('Ext.form.Panel', {
            id: 'pwChangeForm',
            defaultType: 'textfield',
            border: false,
            bodyPadding: 15,
            region: 'center',
            defaults: {
                anchor: '100%',
                allowBlank: false,
                msgTarget: 'side',
                labelWidth: 100
            },
            items: [
                new Ext.form.Hidden({
                    name: 'unique_id',
                    value: rec.get('unique_id')
                }),
                {
                    xtype: 'label',
                    text : "암호는 6자리 이상으로 문자, 숫자, 특수문자 1개 이상의 조합으로 입력하세요.",
                    anchor: '100%',
                    margin: '0 0 60 0'
                },
                {
                    fieldLabel: '종전암호',
                    name: 'cur_password',
                    allowBlank: false,
                    xtype: 'textfield',
                    id :'cur_password',
                    inputType: 'password',
                    value: "",
                    height: 30,
                    anchor: '100%'
                },{
                    fieldLabel: '새 암호',
                    name: 'new_password',
                    id :'new_password',
                    allowBlank: false,
                    xtype: 'textfield',
                    
                    inputType: 'password',
                    value: "",
                    height: 30,
                    anchor: '100%'
                },{
                    fieldLabel: '암호 확인',
                    name: 'new_password_2T',
                    id :'new_password_2T',
                    allowBlank: false,
                    xtype: 'textfield',
                    inputType: 'password',
                    value: "",
                    height: 30,
                    anchor: '100%'
                }
            ]
        });

        var win = Ext.create('ModalWindow', {
            title: '암호변경',
            width: 750,
            height: 250,
            items: pwChangeForm,
            buttons: [{
                text: CMD_OK,
                handler: function(){
                    var form = Ext.getCmp('pwChangeForm').getForm();
                    if(form.isValid()) {
                        var val = form.getValues(false);
                        var cur_passwordT = val['cur_password'];
                        var new_passwordT = val['new_password'];
                        var new_password2T = val['new_password_2T'];

                        var new_pass = new_passwordT; 
                        var con_password = new_password2T;	
                        var check_pass = cur_passwordT;
                        var check = /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*+=-])(?=.*[0-9]).{6,16}$/;
                        if(new_pass.length < 6) {
                            Ext.MessageBox.alert('알림','비밀번호는 6자리 이상 입력하세요.');
                            form.reset();
                            return;
                        }
                        if(!check.test(new_pass)) {
                            Ext.MessageBox.alert('알림','비밀번호는 문자, 숫자, 특수문자 1개 이상의 조합으로 입력하세요.');
                            form.reset();
                            return;
                        }
                        var str = new_pass.length;
                        var strp = con_password.length;
                        if(new_pass==con_password && str==strp){
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/userMgmt/user.do?method=changeMyPassword',				
                                params:{
                                    check_pass : check_pass,
                                    new_pass : new_pass,
                                    con_pass : con_password
                                },
                                success : function(result, request) {
                                    var result = result.responseText;
                                    console_logs('result:', result);
                                    if(result == 'false'){
                                        Ext.MessageBox.alert('오류','종전 암호가 정확하지 않습니다.');
                                    } else { 
                                        gm.me().doCreateCore();
                                        Ext.MessageBox.show({
                                            title:'알림',
                                            msg: '수정 되었습니다.',
                                            buttons: Ext.MessageBox.YES
                                        });
                                        if(win){
                                            win.close();
                                        }
                                    }
                                },
                                failure: extjsUtil.failureMessage
                            });
                        } else{
                            Ext.MessageBox.alert('안내','입력한 암호가 일치하지 않습니다.');
                        }							
                        return false;
                    } else {
                        Ext.MessageBox.alert(error_msg_prompt, '해당 란을 정확히 입력하세요.');
                    }
                }
            },{
                text: CMD_CANCEL,
                handler: function(){
                    if(win) {
                        win.close();
                    }
                }
            }]
        });
        win.show();
    },

    deleteUserConfirm: function (){
        var uids = [];

        var rec = gm.me().grid.getSelectionModel().getSelection(); 

        for(var i=0; i<rec.length;i++){
            var uid = rec[0].get('id');
            uids.push(uid);
        }

        console_logs("selections  : ", gm.me().link);
        
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/userMgmt/user.do?method=destroy',
            params: {unique_id : uids,
                    menuCode: gm.me().link
                    },
            success: function(result, request) {
               
                   
                    gm.me().SupastStore.getProxy().setExtraParam('menuCode', '');
                    gm.me().store.load(function() {

                        gm.me().grid.setLoading(false);
                    });
              
               
            }, //endofsuccess
            failure: extjsUtil.failureMessage
        }); //endofajax
    },

    deptStore: Ext.create('Mplm.store.DeptStore', {}),

    SupastStore: Ext.create('Mplm.store.SupastStore', {menuCode: this.link}),

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