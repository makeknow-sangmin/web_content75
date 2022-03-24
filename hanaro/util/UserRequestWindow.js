Ext.define('Hanaro.util.UserRequestWindow', {
    extend: 'Ext.window.Window',
    xtype: 'form-user-request-window',


    title: 'R/PIMS 다이렉트 요청',
    minWidth: 300,
    minHeight: 380,
    layout: 'fit',
    resizable: true,
    modal: true,
    defaultFocus: 'firstName',
    closeAction: 'destroy',
    file_name: '',
    file_url: '',
    width: 600,
    height: 600,

    items: [{
        xtype: 'form',
        id: 'userRqstForm',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        border: false,
        bodyPadding: 10,

        fieldDefaults: {
            msgTarget: 'side',
            labelAlign: 'top',
            labelWidth: 100,
            labelStyle: 'font-weight:bold'
        },

        items: [
            {
                xtype: 'component',
                html: '<div style="background:#FFFFCC; padding: 12px; font-size:13px;font-weight:bold;">R/PIMS에 요청사항을 전송하면 처리 과정을 실시간으로 파악할 수 있습니다.</div>',
                margin: '0 0 15 0'
            },
            {
            xtype: 'fieldcontainer',
            //fieldLabel: '요청자',
            labelStyle: 'font-weight:bold;padding:0;',
            layout: 'hbox',
            defaultType: 'textfield',

            fieldDefaults: {
                labelAlign: 'left'
            },
            hidden: true,
            items: [{
                width: 160,
                labelWidth: 60,
                labelAlign: 'right',
                name: 'user_name',
                itemId: 'user_name',
                fieldLabel: '이름',
                allowBlank: false,
                hidden: true,
                labelStyle: 'font-weight:normal;padding:0;',
                fieldStyle: 'overflow:scroll ;overflow-x:hidden; background-color: #F0F0F0; background-image: none;',
                readOnly: true,
                value: vCUR_USER_NAME
            }, {
                width: 160,
                labelWidth: 60,
                labelAlign: 'right',
                name: 'wa_code',
                fieldLabel: '회사코드',
                hidden: true,
                margin: '0 0 0 5',
                labelStyle: 'font-weight:normal;padding:0;',
                fieldStyle: 'overflow:scroll ;overflow-x:hidden; background-color: #F0F0F0; background-image: none;',
                readOnly: true,
                value: vCompanyReserved4
            }, {
                flex: 1,
                labelWidth: 60,
                labelAlign: 'right',
                name: 'wa_name',
                fieldLabel: '회사명',
                hidden: true,
                allowBlank: false,
                margin: '0 0 0 5',
                labelStyle: 'font-weight:normal;padding:0;',
                fieldStyle: 'overflow:scroll ;overflow-x:hidden; background-color: #F0F0F0; background-image: none;',
                readOnly: true,
                value: vCompanyBrand
            }]
        },{
            xtype: 'fieldcontainer',
            //fieldLabel: '요청자',
            labelStyle: 'font-weight:bold;padding:0;',
            layout: 'hbox',
            defaultType: 'textfield',

            fieldDefaults: {
                labelAlign: 'left'
            },

            items: [{
                width: 160,
                labelWidth: 60,
                labelAlign: 'right',
                name: 'user_uid',
                itemId: 'user_uid',
                fieldLabel: '사용자UID',
                hidden: true,
                allowBlank: false,
                labelStyle: 'font-weight:normal;padding:0;',
                fieldStyle: 'overflow:scroll ;overflow-x:hidden; background-color: #F0F0F0; background-image: none;',
                readOnly: true,
                value: vCUR_USER_UID 
            }, {
                width: 160,
                labelWidth: 60,
                labelAlign: 'right',
                name: 'user_id',
                fieldLabel: '아이디',
                hidden: true,
                margin: '0 0 0 5',
                labelStyle: 'font-weight:normal;padding:0;',
                fieldStyle: 'overflow:scroll ;overflow-x:hidden; background-color: #F0F0F0; background-image: none;',
                readOnly: true,
                value: vCUR_USER_ID
            }, {
                flex: 1,
                labelWidth: 60,
                labelAlign: 'right',
                id: 'reqt_win_disp_name',
                name: 'disp_name',
                fieldLabel: '화면이름',
                hidden: true,
                allowBlank: false,
                margin: '0 0 0 5',
                labelStyle: 'font-weight:normal;padding:0;',
                fieldStyle: 'overflow:scroll ;overflow-x:hidden; background-color: #F0F0F0; background-image: none;',
                readOnly: true
            }]
        }/*, {
        xtype : 'component',
        html: '<hr />'
    }*/, {
            xtype: 'textfield',
            labelAlign: 'top',
            name: 'email',
            hidden: true,
            fieldLabel: 'e메일',
            afterLabelTextTpl: [
                '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'
            ],
            vtype: 'email',
            allowBlank: false,
            value: vCUR_EMAIL
        }, {
            xtype: 'radiogroup',
            name: 'rqstType',
            labelAlign: 'left',
            fieldLabel: '요청구분',
            defaults: {
                margin: '0 15 0 0'
            },
            items: [{
                boxLabel: '결함',
                inputValue: '1',
                checked: true
            }, {
                boxLabel: '새 기능',
                inputValue: '2'
            }, {
                boxLabel: '지원',
                inputValue: '3'
            }]
        }, {
            xtype: 'textfield',
            labelAlign: 'top',
            name: 'title',
            fieldLabel: '제목',
            //id: 'reqt_win_title',
            afterLabelTextTpl: [
                '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'
            ],
            allowBlank: false
        }, {
            xtype: 'textareafield',
            labelAlign: 'top',
            name: 'content',
            fieldLabel: '내용',
            //id: 'reqt_win_content',
            flex: 1,
            margin: '0 0 0 0',
            afterLabelTextTpl: [
                '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'
            ],
            allowBlank: false
        }, {
            xtype : 'component',
            html: '<hr />'
        }, {
            xtype : 'checkboxfield',
            name: 'sendDump',
            labelAlign: 'left',
            labelWidth: 300,
            labelStyle: 'font-weight:bold;color:red;',
            fieldLabel: '보안사항을 확인하였으며 화면덤프 전송을 승인합니다',
            checked: true
        }, {
            xtype : 'component',
            flex: 2,
            id: 'reqt_win_dump_url',
            html: ''
        }]
    }]
});