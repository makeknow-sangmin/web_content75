//고객사 관리 메뉴
Ext.define('Rfx2.view.company.sejun.salesDelivery.SalespersonListView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'constructor-list-view',
    initComponent: function(){

        //검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField({
            type: 'combo'
            , field_id: 'wa_code'
            , store: "ComcstGubunSelStore"
            , displayField: 'codeName'
            , valueField: 'systemCode'
            , innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
        });

        this.addSearchField('president_name');

        //this.addSearchField('division_name');
        this.initReadonlyField();
        this.addReadonlyField('unique_id');

        this.crateSalePerson = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus-circle',
            text: '신규등록',
            tooltip: '신규등록',
            handler: function () {
                gm.me().addSalePerson();
            }
        });

        this.editSalePerson = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-edit',
            text: gm.getMC('CMD_MODIFY', '수정'),
            disabled: true,
            tooltip: '수정',
            handler: function () {
                var selection = gm.me().grid.getSelectionModel().getSelection();
                var rec = selection[0];
                gm.me().editSalePersonWin(rec);
            }
        });

        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: [
                'REGIST', 'EDIT', 'COPY'
            ],
        });

        buttonToolbar.insert(1, this.crateSalePerson);
        buttonToolbar.insert(2, this.editSalePerson);

       

        console_logs('this.fields', this.fields);

        this.createStore('Rfx2.model.company.hanjung.SalesPersonList', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gMain.pageSize/*pageSize*/,{}
            ,['comcst']
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
        //grid 생성.
        this.createGrid(searchToolbar, buttonToolbar);

        this.setGridOnCallback(function (selections) {
            console_logs('>>>>>>> callback datas', selections);
            if(selections.length > 0) {
                var rec = selections[0];
                this.editSalePerson.enable();
            } else {
                this.editSalePerson.disable();
            }
        });

        this.createCrudTab('buyer-list-view');

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });


        this.callParent(arguments);

        //디폴트 로드
        this.store.getProxy().setExtraParam('exist_company_name', 'Y');
        this.store.load(function(records){});
    },

    addSalePerson: function () {
        var npForm = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            tabBarPosition: 'top',
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
            items: [{
                items: [{
                    xtype: 'fieldset',
                    frame: false,
                    title: '영업사원 정보 등록',
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        width: '49%',
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            layout: {
                                type: 'fit',
                                align: 'left'
                            }
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '성명',
                            allowBlank: true,
                            anchor: '100%',
                            width: '99%',
                            name: 'president_name'
                        }, 
                        {
                            xtype: 'textfield',
                            fieldLabel: '전화번호',
                            allowBlank: false,
                            anchor: '100%',
                            width: '99%',
                            name: 'divison_name'
                        }, 
                        {
                            xtype: 'textfield',
                            fieldLabel: '주민번호',
                            allowBlank: false,
                            anchor: '100%',
                            width: '99%',
                            name: 'ba_code'
                        }, 
                        {
                            xtype: 'textfield',
                            fieldLabel: '계좌번호',
                            allowBlank: false,
                            anchor: '100%',
                            width: '99%',
                            name: 'bracket'
                        }, 
                        {
                            xtype: 'textfield',
                            fieldLabel: 'FAX',
                            anchor: '100%',
                            width: '99%',
                            name: 'fax_no'
                        }
                    ]
                }]
            }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '신규등록',
            width: 500,
            height: 270,
            plain: true,
            items: npForm,
            buttons: [{
                text: gm.getMC('CMD_Enrollment', '등록'),
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (npForm.isValid()) {
                            var val = npForm.getValues(false);
                            npForm.submit({
                                url: CONTEXT_PATH + '/sales/buyer.do?method=addSalePerson',
                                waitMsg: '등록 중 입니다.',
                                success: function (val, action) {
                                    if (prWin) {
                                        prWin.close();
                                    }
                                    Ext.MessageBox.alert('확인', '저장 되었습니다.');
                                    gm.me().store.load();
                                },
                                failure: function (val, action) {
                                    if (prWin) {
                                        console_log('failure');
                                        Ext.MessageBox.alert(error_msg_prompt, '등록 실패! 같은 증상이 반복되면 시스템 관리자에게 문의하세요.');
                                    }
                                }
                            });
                        } else {
                            Ext.MessageBox.alert(error_msg_prompt, '필수 입력 항목이 입력되지 않았습니다.');
                        }
                    }
                }
            }
                , {
                    text: '취소',
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

    editSalePersonWin: function (rec) {
        var npForm = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            tabBarPosition: 'top',
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
            items: [{
                items: [{
                    xtype: 'fieldset',
                    frame: false,
                    title: '영업사원 정보 수정',
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        width: '49%',
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            layout: {
                                type: 'fit',
                                align: 'left'
                            }
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '성명',
                            allowBlank: true,
                            anchor: '100%',
                            width: '99%',
                            value : rec.get('president_name'),
                            name: 'president_name'
                        }, 
                        {
                            xtype: 'textfield',
                            fieldLabel: '전화번호',
                            allowBlank: false,
                            anchor: '100%',
                            width: '99%',
                            value : rec.get('division_name'),
                            name: 'divison_name'
                        }, 
                        {
                            xtype: 'textfield',
                            fieldLabel: '주민번호',
                            allowBlank: false,
                            anchor: '100%',
                            width: '99%',
                            value : rec.get('ba_code'),
                            name: 'ba_code'
                        }, 
                        {
                            xtype: 'textfield',
                            fieldLabel: '계좌번호',
                            allowBlank: false,
                            anchor: '100%',
                            width: '99%',
                            value : rec.get('bracket'),
                            name: 'bracket'
                        }, 
                        {
                            xtype: 'textfield',
                            fieldLabel: 'FAX',
                            anchor: '100%',
                            width: '99%',
                            value : rec.get('fax_no'),
                            name: 'fax_no'
                        }
                    ]
                }]
            }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '수정',
            width: 500,
            height: 270,
            plain: true,
            items: npForm,
            buttons: [{
                text: gm.getMC('CMD_Enrollment', '등록'),
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (npForm.isValid()) {
                            var val = npForm.getValues(false);
                            npForm.submit({
                                url: CONTEXT_PATH + '/sales/buyer.do?method=editSalePerson',
                                waitMsg: '등록 중 입니다.',
                                params: {
                                    unique_id: rec.get('unique_id')
                                },
                                success: function (val, action) {
                                    if (prWin) {
                                        prWin.close();
                                    }
                                    Ext.MessageBox.alert('확인', '수정 되었습니다.');
                                    gm.me().store.load();
                                },
                                failure: function (val, action) {
                                    if (prWin) {
                                        console_log('failure');
                                        Ext.MessageBox.alert(error_msg_prompt, '수정 실패! 같은 증상이 반복되면 시스템 관리자에게 문의하세요.');
                                    }
                                }
                            });
                        } else {
                            Ext.MessageBox.alert(error_msg_prompt, '필수 입력 항목이 입력되지 않았습니다.');
                        }
                    }
                }
            }
                , {
                    text: '취소',
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
    items : []
});
