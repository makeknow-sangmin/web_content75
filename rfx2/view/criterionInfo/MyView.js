Ext.define('Rfx2.view.criterionInfo.MyView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'my-view',
    initComponent: function () {
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        var loadUrl = CONTEXT_PATH + '/userMgmt/user.do?method=readMyinfo';
        console_logs('loadUrl', loadUrl);

        // remove the items
        (buttonToolbar.items).each(function (item, index) {
            if (index === 0 || index === 1 || index === 3 || index === 4 || index === 5 || index === 11) {
                buttonToolbar.items.remove(item);
            }
        });

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

        //grid 생성.
        this.createGrid(buttonToolbar);

        this.createCrudTab('my-view');

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.callParent(arguments);

        this.preCreateCallback = function () {
            console_logs('this.crudMode;', this.crudMode);

            if (this.crudMode === 'EDIT') {

                var cur_passwordT = gMain.selPanel.getInputTarget('cur_password');
                var new_passwordT = gMain.selPanel.getInputTarget('new_password');
                var new_password2T = gMain.selPanel.getInputTarget('new_password2');


                var new_pass = new_passwordT.getValue();
                var con_password = new_password2T.getValue();
                var check_pass = cur_passwordT.getValue();

                var str = new_pass.length;
                var strp = con_password.length;
                var check = /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*+=-])(?=.*[0-9]).{6,16}$/;

                if (new_pass.length < 8) {
                    Ext.MessageBox.alert('알림','비밀번호는 8자리 이상 입력하세요.')
                    // Ext.MessageBox.alert(gm.me().getMC('mes_header_notice', '알림'),
                    //     // gm.me().getMC('mes_amy2_msg_short', '비밀번호는 6자리 이상 입력하세요.'));
                    form.reset();
                    return;
                }
                if (!check.test(new_pass)) {
                    Ext.MessageBox.alert(gm.me().getMC('mes_header_notice', '알림'),
                            '비밀번호는 문자, 숫자 + 특수문자 1개 이상의 조합으로 입력하세요.');
                    form.reset();
                    return;
                }

                

                if (new_pass === con_password && str === strp) {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/userMgmt/user.do?method=changeMyPassword',
                        params: {
                            check_pass: check_pass,
                            new_pass: new_pass,
                            con_pass: con_password
                        },

                        success: function (result) {
                            var resultText = result.responseText;
                            console_logs('result:', resultText);
                            if (resultText === 'false') {
                                Ext.MessageBox.alert('오류', '종전 암호가 정확하지 않습니다.');
                            } else { //true...
                                gm.me().doCreateCore();
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
                    Ext.MessageBox.alert('안내', '입력한 암호가 일치하지 않습니다.');
                }
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
            }
        });
    }
});