Ext.define('Rfx2.view.criterionInfo.UserView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'user-view',
    initComponent: function () {
        this.initDefValue();

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.addSearchField('unique_id');
        this.addSearchField('user_id');
        this.addSearchField('user_name');
        this.addSearchField('email');

        switch (vCompanyReserved4) {
            case 'KWLM01KR':
                this.addSearchField({
                    type: 'radio',
                    field_id: 'delete_flag',
                    items: [
                        {
                            text: '재직',
                            name: 'delete_flag',
                            value: 'N',
                            checked: true
                        },
                        {
                            text: '퇴사',
                            name: 'delete_flag',
                            value: 'Y',
                            checked: false
                        }
                    ]
                });
                break;
            default:
                break;
        }
        Ext.each(this.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            //console_logs('columnObj', columnObj);
            switch (dataIndex) {
                case 'reg_no':
                    columnObj['renderer'] = function (value) {
                        if (value != null && value.length > 0) {
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
            , {}
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
            items: [this.grid, this.crudTab]
        });

        this.addUserButton = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '신규등록',
            tooltip: '신규등록',
            disabled: false,
            hidden: gu.setCustomBtnHiddenProp('addUserButton'),
            handler: function () {
                gm.me().addUserView();
            }
        });

        this.modifyUserButton = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-edit',
            text: gm.getMC('CMD_MODIFY', '수정'),
            tooltip: '수정하기',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('modifyUserButton'),
            handler: function () {
                gm.me().deptStore.load();
                gm.me().roleCodeStore.load();
                gm.me().modifyUserView();
            }
        });

        buttonToolbar.items.each(function (item, index, length) {
            if (index == 1 || index == 2) {
                buttonToolbar.items.remove(item);
            }
        })

        buttonToolbar.insert(1, this.addUserButton);
        buttonToolbar.insert(2, this.modifyUserButton);

        this.callParent(arguments);
        this.store.getProxy().setExtraParam('delete_flag', 'N');

        this.setGridOnCallback(function (selections) {
            console_logs('>>>>callback', selections);
            if (selections != null && selections.length > 0) {
                this.modifyUserButton.enable();
            } else {
                this.modifyUserButton.disable();
            }
        });

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function (records) {
        });
    },
    items: [],

    addUserView: function () {
        if(vCompanyReserved4 === 'BIOT01KR' || 'HSCT01KR') {
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
                                name: 'comcst_code',
                                id: gu.id('comcst_code'),
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
                                allowBlank: false,
                                id: gu.id('user_id'),
                                name: 'user_id'
                            }, 
                            {
                                fieldLabel: '이름',
                                xtype: 'textfield',
                                anchor: '100%',
                                allowBlank: false,
                                id: gu.id('user_name'),
                                name: 'user_name'
                            }, 
                            {
                                fieldLabel: '사번',
                                xtype: 'textfield',
                                anchor: '100%',
                                allowBlank: true,
                                id: gu.id('emp_no'),
                                name: 'emp_no'
                            },
                            {
                                fieldLabel: vCompanyReserved4 == 'BIOT01KR' ? 'Site' : '소속',
                                xtype: 'combo',
                                anchor: '100%',
                                id: gu.id('unique_id_comcst'),
                                name: 'uid_comcst',
                                store: this.comcstStore,
                                displayField: 'division_code',
                                valueField: 'unique_id',
                                allowBlank: false,
                                innerTpl: "<div>[{dept_code}] {dept_code}</div>",
                                listeners: {
                                    select: function (grid, data) {
                                        gu.getCmp('comcst_code').setValue(data.get('division_code'));
                                        gm.me().deptStore.getProxy().setExtraParam('division_code_sel', data.get('division_code'));
                                        gm.me().deptStore.load();
                                        // gu.getCmp('dept_name').setValue(data.get('dept_name'));
    
                                    }
                                }
                            }, 
                            {
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
                            }, 
                            {
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
                            }, 
                            {
                                fieldLabel: '직급',
                                xtype: 'textfield',
                                anchor: '100%',
                                id: gu.id('position'),
                                name: 'position'
                            }, 
                            {
                                fieldLabel: '전화번호',
                                xtype: 'textfield',
                                anchor: '100%',
                                id: gu.id('tel_no'),
                                name: 'tel_no'
                            }, 
                            {
                                fieldLabel: '내선번호',
                                xtype: 'textfield',
                                anchor: '100%',
                                id: gu.id('extension_no'),
                                name: 'extension_no'
                            }, 
                            {
                                fieldLabel: '휴대폰',
                                xtype: 'textfield',
                                anchor: '100%',
                                id: gu.id('hp_no'),
                                name: 'hp_no'
                            },
                            {
                                fieldLabel: '팩스번호',
                                xtype: 'textfield',
                                anchor: '100%',
                                id: gu.id('fax_no'),
                                name: 'fax_no'
                            }, 
                            {
                                fieldLabel: 'E-Mail',
                                xtype: 'textfield',
                                anchor: '100%',
                                id: gu.id('email'),
                                name: 'email'
                            }, 
                            {
                                fieldLabel: '주소',
                                xtype: 'textfield',
                                anchor: '100%',
                                id: gu.id('address_1'),
                                name: 'address_1'
                            }, 
                            {
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
        } else {
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
        }
        

        var myWidth = 310;
        if(vCompanyReserved4 === 'BIOT01KR' || 'HSCT01KR') {
            var myHeight = 510;
        } else {
            var myHeight = 480;
        }
      

        switch (vCompanyReserved4) {
            case 'KWLM01KR':
                gu.getCmp('registration').add(
                    {
                        fieldLabel: '급여산출여부',
                        xtype: 'combo',
                        anchor: '100%',
                        store: this.ynStore,
                        id: gu.id('budget_admin_flag'),
                        name: 'budget_admin_flag',
                        displayField: 'code_name_kr',
                        valueField: 'system_code',
                        allowBlank: true,
                        value: 'Y',
                        listConfig: {
                            getInnerTpl: function () {
                                return '<div data-qtip="{system_code}">{code_name_kr}</div>';
                            }
                        }
                    }
                );
                myHeight += 45;
                break;
            case 'SJFB01KR' : 
                gu.getCmp('registration').add(
                    {
                        fieldLabel: '팀장권한',
                        xtype: 'combo',
                        anchor: '100%',
                        store: this.ynStore,
                        id: gu.id('sr_admin_flag'),
                        name: 'sr_admin_flag',
                        displayField: 'code_name_kr',
                        valueField: 'system_code',
                        allowBlank: true,
                        value: 'Y',
                        listConfig: {
                            getInnerTpl: function () {
                                return '<div data-qtip="{system_code}">{code_name_kr}</div>';
                            }
                        }
                    }
                );
                myHeight += 60;
            break;
            default:
                break;
        }

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

    modifyUserView: function () {
        var rec = gm.me().grid.getSelectionModel().getSelection()[0];
        console_logs('>>>>>rrr', rec);

        if(vCompanyReserved4 === 'BIOT01KR') {
            gm.me().comcstStore.load();

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
                            },
                            {
                                fieldLabel: 'Site',
                                xtype: 'combo',
                                anchor: '100%',
                                id: gu.id('unique_id_comcst'),
                                name: 'uid_comcst',
                                store: this.comcstStore,
                                value : rec.get('uid_comcst'),
                                displayField: 'division_code',
                                valueField: 'unique_id',
                                allowBlank: false,
                                innerTpl: "<div>[{dept_code}] {dept_code}</div>",
                                listeners: {
                                    select: function (grid, data) {
                                        gu.getCmp('comcst_code').setValue(data.get('division_code'));
                                        gm.me().deptStore.getProxy().setExtraParam('division_code_sel', data.get('division_code'));
                                        gm.me().deptStore.load();
                                        // gu.getCmp('dept_name').setValue(data.get('dept_name'));
    
                                    }
                                }
                            },  
                            {
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
        } else {
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
        }

        

        var myWidth = 310;
        if(vCompanyReserved4 === 'BIOT01KR') {
            var myHeight = 510;
        } else {
            var myHeight = 480;
        }

        switch (vCompanyReserved4) {
            case 'KWLM01KR':
                gu.getCmp('modification').add(
                    {
                        fieldLabel: '급여산출여부',
                        xtype: 'combo',
                        anchor: '100%',
                        store: this.ynStore,
                        id: gu.id('budget_admin_flag'),
                        name: 'budget_admin_flag',
                        displayField: 'code_name_kr',
                        valueField: 'system_code',
                        allowBlank: true,
                        value: rec.get('budget_admin_flag'),
                        listConfig: {
                            getInnerTpl: function () {
                                return '<div data-qtip="{system_code}">{code_name_kr}</div>';
                            }
                        }
                    }
                );
                myHeight += 45;
                break;
            case 'SJFB01KR' : 
                gu.getCmp('modification').add(
                    {
                        fieldLabel: '팀장권한',
                        xtype: 'combo',
                        anchor: '100%',
                        store: this.ynStore,
                        id: gu.id('sr_admin_flag'),
                        name: 'sr_admin_flag',
                        displayField: 'code_name_kr',
                        valueField: 'system_code',
                        allowBlank: true,
                        value: 'Y',
                        listConfig: {
                            getInnerTpl: function () {
                                return '<div data-qtip="{system_code}">{code_name_kr}</div>';
                            }
                        }
                    }
                );
                myHeight += 60;
            break;
            default:
                break;
        }

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

    deptStore: Ext.create('Mplm.store.DeptStore', {}),

    comcstStore: Ext.create('Mplm.store.ComCstStore', {}),

    roleCodeStore: Ext.create('Mplm.store.UserRoleCodeStore', {}),

    ynStore: Ext.create('Mplm.store.YesnoStore', {})
});