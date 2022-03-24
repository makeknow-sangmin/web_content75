Ext.define('Hanaro.view.setup.form.SetupFormcard02', {
    extend: 'Ext.form.Panel',
    xtype: 'rfx.setupForm2',
    frame:true,
    title: '(2/4) 회사정보 / ROOT 사용자 입력',
    bodyPadding: 10,
    scrollable:false,
    border: false,
    fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 115,
        msgTarget: 'side'
    },
    initComponent:  function(){
        console_logs('Hanaro.view.setup.form.SetupFormcard02', 'initComponent');
        this.callParent(arguments);
    },
    items: [
        {
            xtype: 'fieldset',
            title: '회사 정보',
            defaultType: 'textfield',
            defaults: {
                anchor: '100%'
            },
            items: [
                {
                    id: 'f2_comast_uid', 
                    xtype: 'hiddenfield',
                    name: 'comast_uid'
                },
                {
                    xtype : 'container',
                    layout : 'hbox',
                    pack : 'start',
                    align : 'stretch',
                    style: 'margin-bottom: 5px;margin-left:1px;;margin-top: 5px;',
                    items : [
                        { allowBlank:false, xtype : 'textfield', fieldLabel: '할당 회사코드', id: 'f2_wa_code', name: 'wa_code', readOnly:true, fieldStyle: 'overflow:scroll ;overflow-x:hidden; background-color: #F0F0F0; background-image: none;' },
                        { allowBlank:false, xtype : 'textfield', fieldLabel: '사업자번호', id: 'f2_biz_no', name: 'biz_no', readOnly:true, fieldStyle: 'background-color: #F0F0F0; background-image: none;'  }
                    ]
                },
                {
                    xtype : 'container',
                    layout : 'hbox',
                    pack : 'start',
                    align : 'stretch',
                    style: 'margin-bottom: 5px;margin-left:1px;',
                    items : [
                        { allowBlank:false, xtype : 'textfield', fieldLabel: '회사명',name: 'wa_name'  },
                        { allowBlank:false, xtype : 'textfield', fieldLabel: '대표자', name: 'president_name'  }
                    ]
                },
                {
                    xtype : 'container',
                    layout : 'hbox',
                    pack : 'start',
                    align : 'stretch',
                    style: 'margin-bottom: 5px;margin-left:1px;',
                    items : [
                        { allowBlank:false, xtype : 'datefield', fieldLabel: '개업연월일', name: 'reg_date' ,
                            format : 'Y-m-d',
                            dateFormat : 'Y-m-d',
                            submitFormat : 'Y-m-d' 
                        },
                        { allowBlank:false, xtype : 'textfield', fieldLabel: '법인등록번호', name: 'company_code'  }
                    ]
                },
                { allowBlank:false, xtype : 'textfield', fieldLabel: '사업장소재지', name: 'address_1', style: 'margin-right: 25px;'},
                { allowBlank:false, xtype : 'textfield', fieldLabel: '업태', name: 'biz_condition', style: 'margin-right: 25px;'  },
                { allowBlank:false, xtype : 'textfield', fieldLabel: '종목', name: 'biz_category', style: 'margin-right: 25px;'  },
                { allowBlank:true, xtype : 'textfield', fieldLabel: '회사 슬로건', emptyText: '예) 고객비전의 실현', name: 'slogan', style: 'margin-right: 25px;margin-bottom: 15px;'  }
            ]
        },
        {
            xtype: 'fieldset',
            style: 'margin-top: 30px;',
            title: 'root 사용자 (시스템에 대한 통제권을 갖는 사용자)',
            defaultType: 'textfield',
            defaults: {
                anchor: '100%'
            },
            items: [
                {
                    xtype : 'container',
                    layout : 'hbox',
                    pack : 'start',
                    align : 'stretch',
                    style: 'margin-bottom: 5px;margin-left:1px;margin-top: 10px;',
                    items : [
                        { allowBlank:false, xtype : 'textfield', fieldLabel: '아이디', name: 'user_id', readOnly:true, value:'root', fieldStyle: 'overflow:scroll ;overflow-x:hidden; background-color: #F0F0F0; background-image: none;' },
                        , {xtype:'component', html: '&nbsp;&nbsp;(고정된 아이디 root를 기억하세요.)'}
                    ]
                },
                {
                    xtype : 'container',
                    layout : 'hbox',
                    pack : 'start',
                    align : 'stretch',
                    style: 'margin-bottom: 5px;margin-left:1px;margin-bottom: 10px;',
                    items : [
                        { allowBlank:false, xtype : 'textfield', fieldLabel: '이름',name: 'user_name'  },
                        { allowBlank:false, xtype : 'textfield', fieldLabel: 'e메일', name: 'email' ,vtype: 'email' }
                    ]
                },
                {
                    xtype : 'container',
                    layout : 'hbox',
                    pack : 'start',
                    align : 'stretch',
                    style: 'margin-bottom: 5px;margin-left:1px;margin-top: 10px;margin-bottom: 15px;',
                    items : [
                        { allowBlank:false, xtype : 'textfield', inputType: 'password', fieldLabel: '암호', name: 'password', emptyText: '최소6자리', minLength : 6},
                        { allowBlank:false, xtype : 'textfield', inputType: 'password', fieldLabel: '암호 확인', name: 'password1', emptyText: '최소6자리', minLength : 6}
                    ]
                }
            ]
        }
    ]
   
   

});