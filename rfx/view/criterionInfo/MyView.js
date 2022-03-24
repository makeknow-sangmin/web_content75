Ext.define('Rfx.view.criterionInfo.MyView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'my-view',
    //items: [{html: 'Rfx.view.criterionInfo.CompanyView'}],
    initComponent: function () {
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        console_logs('this.fields', this.fields);
        var loadUrl = CONTEXT_PATH + '/userMgmt/user.do?method=readMyinfo';
        console_logs('loadUrl', loadUrl);

        this.store = new Ext.data.Store({
            pageSize: 100,
            fields: this.fields,
            proxy: {
                type: 'ajax',
                url: loadUrl,
                reader: {
                    type: 'json',
                    root: 'datas',
                    successProperty: 'success'
                },
                autoLoad: false
            }
        });

        this.PwChangeAction = Ext.create('Ext.Action', {
            text: this.getMC('mes_amy2_btn_change_pass', '암호 변경'),
            iconCls: 'af-lock',
            tooltip: '사용자 암호를 변경합니다.',
            disabled: false,
            handler: function () {
                //var selections = /*gMain.selPanel.grid.getSelectionModel().getSelection();*/
                var rec = gm.me().store.getAt(0);
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
                            text: gm.me().getMC('mes_amy2_msg_combination2',
                                "암호는 6자리 이상으로 문자, 숫자, 특수문자 1개 이상의 조합으로 입력하세요."),
                            anchor: '100%'
                        },
                        {
                            fieldLabel: '종전암호',
                            name: 'cur_password',
                            allowBlank: false,
                            xtype: 'textfield',
                            id: 'cur_password',
                            inputType: 'password',
                            value: "",
                            //height: 30,
                            anchor: '100%',
                            margin: '10 0 10 0'
                        }, {
                            fieldLabel: '새 암호',
                            name: 'new_password',
                            id: 'new_password',
                            allowBlank: false,
                            xtype: 'textfield',
                            inputType: 'password',
                            value: "",
                            //height: 30,
                            anchor: '100%',
                            margin: '10 0 10 0'
                        }, {
                            fieldLabel: '암호 확인',
                            name: 'new_password_2T',
                            id: 'new_password_2T',
                            allowBlank: false,
                            xtype: 'textfield',
                            inputType: 'password',
                            value: "",
                            //height: 30,
                            anchor: '100%'
                        }
                    ]
                });

                var win = Ext.create('ModalWindow', {
                    title: '암호변경',
                    width: 500,
                    height: 220,
                    items: pwChangeForm,
                    buttons: [{
                        text: CMD_OK,
                        handler: function () {

                            win.setLoading(true);

                            var form = Ext.getCmp('pwChangeForm').getForm();
                            if (form.isValid()) {
                                var val = form.getValues(false);
                                var cur_passwordT = val['cur_password'];
                                var new_passwordT = val['new_password'];
                                var new_password2T = val['new_password_2T'];

                                var new_pass = new_passwordT;
                                var con_password = new_password2T;
                                var check_pass = cur_passwordT;
                                var check = /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*+=-])(?=.*[0-9]).{6,16}$/;
                                if (new_pass.length < 6) {
                                    win.setLoading(false);
                                    Ext.MessageBox.alert(gm.me().getMC('mes_header_notice', '알림'),
                                        gm.me().getMC('mes_amy2_msg_short', '비밀번호는 6자리 이상 입력하세요.'));
                                    form.reset();
                                    return;
                                }
                                if (!check.test(new_pass)) {
                                    win.setLoading(false);
                                    Ext.MessageBox.alert(gm.me().getMC('mes_header_notice', '알림'),
                                        gm.me().getMC('mes_amy2_msg_combination',
                                            '비밀번호는 문자, 숫자, 특수문자 1개 이상의 조합으로 입력하세요.'));
                                    form.reset();
                                    return;
                                }
                                var str = new_pass.length;
                                var strp = con_password.length;
                                if (new_pass == con_password && str == strp) {
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/userMgmt/user.do?method=changeMyPassword',
                                        params: {
                                            check_pass: check_pass,
                                            new_pass: new_pass,
                                            con_pass: con_password
                                        },
                                        success: function (result, request) {
                                            var result = result.responseText;
                                            console_logs('result:', result);
                                            if (result == 'false') {
                                                Ext.MessageBox.alert(gm.me().getMC('mes_header_error', '오류'),
                                                    gm.me().getMC('mes_amy2_msg_mismatch', '종전 암호가 정확하지 않습니다.'));
                                            } else {
                                                gm.me().doCreateCore();
                                                win.setLoading(false);
                                                Ext.MessageBox.show({
                                                    title: gm.me().getMC('mes_header_notice', '알림'),
                                                    msg: gm.me().getMC('mes_common_msg_modify_complete', '수정 되었습니다.'),
                                                    buttons: Ext.MessageBox.YES
                                                });
                                                if (win) {
                                                    win.close();
                                                }
                                            }
                                        },
                                        failure: function(val, action){
                                            Ext.MessageBox.show({
                                                title: gm.me().getMC('mes_header_notice', '알림'),
                                                msg: gm.me().getMC('mes_common_msg_modify_fail', '수정을 실패하였습니다.'),
                                                buttons: Ext.MessageBox.YES
                                            });
                                            if (win) {
                                                win.close();
                                            }
                                        }
                                    });
                                } else {
                                    win.setLoading(false);
                                    Ext.MessageBox.alert(gm.me().getMC('mes_header_guidance', '안내'),
                                        gm.me().getMC('mes_amy2_msg_mismatch2', '입력한 암호가 일치하지 않습니다.'));
                                }
                                return false;
                            } else {
                                win.setLoading(false);
                                Ext.MessageBox.alert(gm.me().getMC('mes_amy2_msg_exactly', '오류'),
                                    '해당 란을 정확히 입력하세요.');
                            }
                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function () {
                            if (win) {
                                win.close();
                            }
                        }
                    }]
                });
                win.show();
            }
        });
        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 0 || index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        this.modifyUserButton = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-edit',
            text: this.getMC('mes_header_modify', '수정'),
            tooltip: this.getMC('mes_tooltip_modify', '수정하기'),
            disabled: false,
            handler: function() {
                gm.me().deptStore.load();
                gm.me().roleCodeStore.load();
                gm.me().modifyUserView();
            }
        });

        buttonToolbar.insert(0, this.modifyUserButton);
        buttonToolbar.insert(0, this.PwChangeAction);

        //grid 생성.
        this.createGrid(buttonToolbar);
        this.createCrudTab('my-view');

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.callParent(arguments);

        this.setGridOnCallback(function (selections) {
            console_logs('>>>>>>> callback datas', selections);
        });

        this.preCreateCallback = function () {
            console_logs('this.crudMode;', this.crudMode);

            //공정복사
            if (this.crudMode == 'EDIT') {
                var cur_passwordT = gMain.selPanel.getInputTarget('cur_password');
                var new_passwordT = gMain.selPanel.getInputTarget('new_password');
                var new_password2T = gMain.selPanel.getInputTarget('new_password2');


                var new_pass = new_passwordT.getValue();
                var con_password = new_password2T.getValue();
                var check_pass = cur_passwordT.getValue();
                var check = /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*+=-])(?=.*[0-9]).{8,16}$/;

                if (new_pass.length < 6) {
                    Ext.MessageBox.alert(gm.me().getMC('mes_header_notice', '알림'),
                        gm.me().getMC('mes_amy2_msg_short', '비밀번호는 6자리 이상 입력하세요.'));
                    new_passwordT.setValue('');
                    new_password2T.setValue('');
                    return;
                }

                if (!check.test(new_pass)) {
                    Ext.MessageBox.alert(gm.me().getMC('mes_header_notice', '알림'),
                        gm.me().getMC('mes_amy2_msg_combination',
                            '비밀번호는 문자, 숫자, 특수문자 1개 이상의 조합으로 입력하세요.'));
                    new_passwordT.setValue('');
                    new_password2T.setValue('');
                    return;
                }

                var str = new_pass.length;
                var strp = con_password.length;

                if (new_pass == con_password && str == strp) {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/userMgmt/user.do?method=changeMyPassword',
                        params: {
                            check_pass: check_pass,
                            new_pass: new_pass,
                            con_pass: con_password
                        },

                        success: function (result, request) {
                            var result = result.responseText;
                            console_logs('result:', result);
                            if (result == 'false') {
                                Ext.MessageBox.alert(gm.me().getMC('mes_header_error', '오류'),
                                    gm.me().getMC('mes_amy2_msg_mismatch', '종전 암호가 정확하지 않습니다.'));
                            } else { //true...
                                gm.me().doCreateCore();
                                new_passwordT.setValue('');
                                new_password2T.setValue('');
                                cur_passwordT.setValue('');
                                Ext.MessageBox.show({
                                    title: '결과',
                                    msg: '수정되었습니다.',
                                    buttons: Ext.MessageBox.YES
                                });
                            }
                        },
                        failure: extjsUtil.failureMessage
                    });

                } else {
                    Ext.MessageBox.alert(gm.me().getMC('mes_header_guidance', '안내'),
                        gm.me().getMC('mes_amy2_msg_mismatch2', '입력한 암호가 일치하지 않습니다.'));
                }
                return false;
            } else {
                gm.me().doCreateCore();
                return true;
            }

        }
        gMain.setCenterLoading(false);
        this.store.load(function (records) {
            if (records != null && records.length > 0) {
                var rec = records[0];
                gMain.selPanel.grid.getSelectionModel().select(rec);
                //gMain.selPanel.setActiveCrudPanel('EDIT');
            }
        });
    },
    items: [],

    modifyUserView: function () {

        var rec = /*gm.me().grid.getSelectionModel().getSelection()[0];*/ gm.me().store.getAt(0);
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
                            value: vCUR_USER_UID
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
                            fieldLabel: '사용자ID',
                            xtype: 'textfield',
                            anchor: '100%',
                            readOnly:true,
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            id:'user_id',
                            name:'user_id',
                            hidden: true,
                            value:rec.get('user_id')
                        },{
                            fieldLabel: '이름',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: false,
                            id:'user_name',
                            name:'user_name',
                            hidden: true,
                            value:rec.get('user_name')
                        },{
                            fieldLabel: '사번',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            id:'emp_no',
                            name:'emp_no',
                            hidden: true,
                            value:rec.get('emp_no')
                        },{
                            fieldLabel: '부서',
                            xtype: 'combo',
                            anchor: '100%',
                            id:'unique_id_comdst',
                            name:'unique_id_comdst',
                            store: gm.me().deptStore,
                            displayField:'dept_name',
                            valueField: 'unique_id',
                            allowBlank: true,
                            value:rec.get('unique_id_comdst'),
                            listConfig: {
                                getInnerTpl: function() {
                                    return '<div data-qtip="{dept_code}">{dept_name}</div>';
                                }
                            },
                            // innerTpl: "<div>[{dept_code}] {dept_name}</div>",
                            listeners: {
                                select: function(grid, data) {
                                    Ext.getCmp('dept_code').setValue(data.get('dept_code'));
                                    Ext.getCmp('dept_name').setValue(data.get('dept_name'));

                                }
                            }
                        }, {
                            fieldLabel: '직급',
                            xtype: 'textfield',
                            anchor: '100%',
                            id:'position',
                            name:'position',
                            value:rec.get('position')
                        },{
                            fieldLabel: '전화번호',
                            xtype: 'textfield',
                            anchor: '100%',
                            id:'tel_no',
                            name:'tel_no',
                            value:rec.get('tel_no')
                        },{
                            fieldLabel: '내선번호',
                            xtype: 'textfield',
                            anchor: '100%',
                            id:'extension_no',
                            name:'extension_no',
                            hidden: true,
                            value:rec.get('extension_no')
                        },{
                            fieldLabel: '휴대폰',
                            xtype: 'textfield',
                            anchor: '100%',
                            id:'hp_no',
                            name:'hp_no',
                            value:rec.get('hp_no')
                        },{
                            fieldLabel: 'E-Mail',
                            xtype: 'textfield',
                            anchor: '100%',
                            id:'email',
                            name:'email',
                            value:rec.get('email')
                        },{
                            fieldLabel: '주소',
                            xtype: 'textfield',
                            anchor: '100%',
                            id:'address_1',
                            name:'address_1',
                            value:rec.get('address_1')
                        },{
                            fieldLabel: '보안등급',
                            xtype: 'textfield',
                            anchor: '100%',
                            id:'user_grade',
                            name:'user_grade',
                            hidden: true,
                            value: rec.get('user_grade')
                        }
                    ]
                },

            ]
        });

        var myWidth = 310;
        var myHeight = 280;

        switch (vCompanyReserved4) {
            case 'KWLM01KR':
                gu.getCmp('modification').add(
                    {
                        fieldLabel: '급여산출여부',
                        xtype: 'combo',
                        anchor: '100%',
                        store: this.ynStore,
                        id: 'budget_admin_flag',
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
            var combo = Ext.getCmp('unique_id_comdst');
            var val = combo.getValue();
            var record = combo.findRecordByValue(val);
            if (record != null) {
                combo.select(record);
            }

        });
    },

    deptStore: Ext.create('Mplm.store.DeptStore', {}),

    roleCodeStore: Ext.create('Mplm.store.UserRoleCodeStore', {})
});