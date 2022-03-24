Ext.define('Rfx.view.form.LoginForm8', {
    extend: 'Ext.form.Panel',
    xtype: 'rfx.loginForm',
    cls: 'myForm',
    frame: false,
    width: 400,
    // height: 280,
    bodyPadding: 0,
    url: CONTEXT_PATH + '/index/login.do?method=login&isAjax=1',
    waitMsg: '실행중...',
    method: 'POST',
    defaultType: 'textfield',
    items: [
        {
            xtype: 'hiddenfield',
            name: 'viewRange',
            value: 'private'
        },
        {
            xtype: 'hiddenfield',
            name: 'hashLink'
        },
        {
            xtype: 'hiddenfield',
            id: 'waCode',
            name: 'waCode',
            value: vCompanyReserved4,
        },
        {
            allowBlank: false,
            name: 'userId',
            id: 'userId',
            fieldCls: 'myTextField',
            cls: 'test',
            emptyText: '아이디',
            margin: '15',
            height: 40
        },
        {
            allowBlank: false,
            name: 'password',
            id: 'password',
            emptyText: '비밀번호',
            cls: 'myTextField',
            fieldCls: 'myTextField',
            inputType: 'password',
            enableKeyEvents: true,
            margin: '15',
            height: 40,
            listeners: {
                render: function () {
                    this.capsWarningTooltip = new Ext.ToolTip({
                        target: this.id,
                        anchor: 'top',
                        align: 'center',
                        style: 'background-color: #fCf9A2;',
                        anchor: 'top',
                        width: 200,
                        height: 30,
                        autoHide: true,
                        mustShow: false,
                        html: '<div class="ux-auth-warning"><font color="black"><b>Caps Lock이 켜져있습니다.</b></font></div><br/>',
                        listeners: {
                            beforeshow: function () {
                                return this.mustShow;
                            }
                        }
                    });
                },
                keypress: {
                    fn: function (field, e) {
                        var charCode = e.getCharCode();
                        if ((e.shiftKey && charCode >= 97 && charCode <= 122) ||
                            (!e.shiftKey && charCode >= 65 && charCode <= 90)) {
                            field.capsWarningTooltip.mustShow = true;
                            field.capsWarningTooltip.show();
                        } else {
                            if (field.capsWarningTooltip.hidden == false) {
                                field.capsWarningTooltip.mustShow = false;
                                field.capsWarningTooltip.hide();
                            }
                        }
                    },
                    scope: this
                },
                blur: function (field) {
                    if (this.capsWarningTooltip.hidden == false) {
                        this.capsWarningTooltip.hide();
                    }
                },
                specialkey: function (field, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        Ext.getBody().mask('잠시만 기다려주세요.');
                        Ext.getCmp('enterBtn').disable();
                        loginForm.getForm().submit({
                            onSuccess: function (pResponse) {
                                console_log(pResponse);
                                var msg = pResponse['responseText'];
                                if (msg == "OK") {
                                    var wa_code = Ext.getCmp('waCode').getValue();
                                    var userId = Ext.getCmp('userId').getValue();
                                    var rememberme_chk = Ext.getCmp('rememberme_chk').getValue();
                                    setCookie('waCode', wa_code.toUpperCase(), expdate);
                                    if (rememberme_chk == true) {
                                        setCookie('userId', userId, expdate);
                                    } else {
                                        setCookie('userId', '', expdate);
                                    }
                                    lfn_gotoMain();
                                } else {
                                    Ext.getCmp('enterBtn').enable();
                                    loginForm.setLoading(false);
                                    Ext.MessageBox.alert('로그인 실패', msg,
                                        function () {
                                            Ext.getCmp('userId').focus(false, 200);
                                        });
                                    Ext.getBody().unmask();
                                }
                            },
                            failure: function (formPanel, action) {
                                Ext.getBody().unmask();
                                Ext.getCmp('enterBtn').enable();
                                loginForm.setLoading(false);
                                var data = Ext.decode(action.response.responseText);
                                console_log("Failure: " + data.msg);
                                Ext.MessageBox.alert('오류', data.msg,
                                    function () {
                                        Ext.getCmp('userId').focus(false, 200);
                                    });
                            }
                        });
                    }
                }
            }
        }, {
            xtype: 'hiddenfield',
            name: 'isSupplier',
            value: 'N'
        }, {
            xtype: 'checkbox',
            id: 'rememberme_chk',
            margin: '0 0 0 15',
            name: 'rememberme_chk',
            itemCls: 'rememberme_chk',
            boxLabel: '아이디 저장'
        },
        {
            id: 'enterBtn',
            xtype: 'button',
            text: '로그인',
            scale: 'large',
            cls: 'loginBtn',
            fieldCls: 'loginBtn',
            margin: 15,
            handler: function () {
                Ext.getBody().mask('잠시만 기다려주세요.');
                Ext.getCmp('enterBtn').disable();
                loginForm.getForm().submit({
                    onSuccess: function (pResponse) {
                        console_log(pResponse);
                        loginForm.setLoading(false);
                        var msg = pResponse['responseText'];

                        if (msg == "OK") {
                            var wa_code = Ext.getCmp('waCode').getValue();
                            var userId = Ext.getCmp('userId').getValue();
                            var rememberme_chk = Ext.getCmp('rememberme_chk').getValue();

                            setCookie('waCode', wa_code.toUpperCase(), expdate);
                            if (rememberme_chk == true) {
                                setCookie('userId', userId, expdate);
                            } else {
                                setCookie('userId', '', expdate);
                            }

                            lfn_gotoMain();
                        } else {

                            Ext.getCmp('enterBtn').enable();
                            loginForm.setLoading(false);
                            Ext.MessageBox.alert('로그인 실패', msg,
                                function () {
                                    Ext.getCmp('userId').focus(false, 200);

                                });
                            Ext.getBody().unmask();
                        }
                    },
                    failure: function (formPanel, action) {
                        Ext.getCmp('enterBtn').enable();
                        Ext.getBody().unmask();
                        loginForm.setLoading(false);
                        var data = Ext.decode(action.response.responseText);
                        console_log("Failure: " + data.msg);
                        Ext.getBody().unmask();
                        Ext.MessageBox.alert('오류', data.msg,
                            function () {
                                Ext.getCmp('userId').focus(false, 200);
                            });
                    }
                });
            }
        },
        {
            id: 'groupwareBtn',
            xtype: 'button',
            hidden: true,
            text: '그룹웨어로 로그인',
            scale: 'large',
            cls: 'groupwareBtn',
            fieldCls: 'groupwareBtn',
            margin: '5 15 15 15',
            handler: function () {
                lfn_gotoGroupware();
            }
        }
    ],
    initComponent: function () {
        this.defaults = {
            anchor: '100%',
            labelWidth: 120
        };
        this.callParent();

        var code = this.getAllUrlParams(window.location.href).code;
    },

    getAllUrlParams: function(url) {

    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // set parameter name and value (use 'true' if empty)
            var paramName = a[0];
            var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

            // (optional) keep case consistent
            paramName = paramName.toLowerCase();
            if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

            // if the paramName ends with square brackets, e.g. colors[] or colors[2]
            if (paramName.match(/\[(\d+)?\]$/)) {

                // create key if it doesn't exist
                var key = paramName.replace(/\[(\d+)?\]/, '');
                if (!obj[key]) obj[key] = [];

                // if it's an indexed array e.g. colors[2]
                if (paramName.match(/\[\d+\]$/)) {
                    // get the index value and add the entry at the appropriate position
                    var index = /\[(\d+)\]/.exec(paramName)[1];
                    obj[key][index] = paramValue;
                } else {
                    // otherwise add the value to the end of the array
                    obj[key].push(paramValue);
                }
            } else {
                // we're dealing with a string
                if (!obj[paramName]) {
                    // if it doesn't exist, create property
                    obj[paramName] = paramValue;
                } else if (obj[paramName] && typeof obj[paramName] === 'string'){
                    // if property does exist and it's a string, convert it to an array
                    obj[paramName] = [obj[paramName]];
                    obj[paramName].push(paramValue);
                } else {
                    // otherwise add the property
                    obj[paramName].push(paramValue);
                }
            }
        }
    }

    return obj;
}
});