Ext.define('Hanaro.view.setup.form.SetupFormcard01', {
    extend: 'Ext.form.Panel',
    xtype: 'rfx.setupForm1',
    frame:true,
    title: '(1/4) 사업자 번호 인증',
    bodyPadding: 10,
    scrollable:false,
    border: false,
    fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 115,
        msgTarget: 'side'
    },

    items: [
        {
            html:   '<p>시스템 설정을 시작합니다.</p><p>먼저 시스템을 사용할 기업의 사업자등록증을 준비해주세요.<br>' +
                    '수령한 Comast Uid(시스템 식별번호)와 사업자번호를 입력하세요.</p>'
        },
        {
            xtype: 'container',
            style: 'margin-top: 30px;',
                layout: 'column',
                bodyPadding: 5,

                defaults: {
                    bodyPadding: 15
                },
            

            items: [
                {
                    columnWidth: 0.84,
                    xtype: 'fieldset',
                    title: '회사 인증',
                    defaultType: 'textfield',
                    defaults: {
                        anchor: '100%'
                    },

                    items: [
                        { allowBlank:false, fieldLabel: 'Comast Uid', name: 'comast_uid', emptyText: '10자리 숫자',
                        minLength     : 10,  maxLength     : 10,
                        maskRe     : /[0-9]/i
                    },
                        { allowBlank:false, fieldLabel: '사업자번호', name: 'biz_no', emptyText: '- 없이 10자리 숫자',
                        minLength     : 10,  maxLength     : 10,
                        maskRe     : /[0-9]/i
                    }
                    ]
                },{
                    columnWidth: 0.16,
                    items: [ {
                        xtype: 'button',
                        iconCls: 'button-home-large',
                        text: CMD_OK,
                        scale: 'medium',
                        glyph: 'f00c@FontAwesome',
                        iconAlign: 'top',
                        handler: function() {
                            
                            var card0 = Ext.getCmp('card-0');
                            if(card0.isValid()) {
                                var values = card0.getValues();
                                console_logs('====> values', values);

                                var key = 'COMAST:' + values.comast_uid;
                                console_logs('====> key', key);
                                var setupForm = Ext.getCmp('setupForm');
                                setupForm.setLoading(true);

                                Ext.getCmp('f2_comast_uid').setValue(values.comast_uid);
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/hosuio.do?method=get',
                                    method: 'GET',
                                    //cors: true,
                                    // headers: {
                                    //     'Access-Control-Allow-Origin': '*'
                                    // },
                                    params: {
                                        key : key
                                    },
                                    success : function(result, request) {
                                        var o = Ext.util.JSON.decode(result.responseText); 
                                        console.log('result o', o);
                                        var status = o.status;

                                        var setInfoMEssage = function(msg) {
                                            var infoMEssage = Ext.getCmp('f1_infoMEssage');
                                            infoMEssage.setHtml('<P>' + msg + '</P>');
                                        };
                                        setupForm.down('#card-next').setDisabled(true);
                                        if(status==true) {
                                            var val = o.val;
                                            console_logs('val', val);
                                            //if(val!=null && val.length>0) {
                                            if(val!=null && val.length>0) {
                                                var arr = val.split(':');
                                                if(arr.length==0) {
                                                    setInfoMEssage('결과값 형식이 잘못되었습니다.');
                                                    
                                                } else {

                                                    var card0 = Ext.getCmp('card-0');
                                                    var values = card0.getValues();
                                                    var biz_no1 = values.biz_no;
                                           
                                                    var biz_no = arr[0];
                                                    var wa_code = arr[1];

                                                    Ext.getCmp('f2_biz_no').setValue(setupForm.bizNoFormatter(biz_no, 1));
                                                    Ext.getCmp('f2_wa_code').setValue(wa_code);
                                                    
                                                    if(biz_no==biz_no1) {
                                                        var msg = '정상 사용자로 인증되었습니다.<br> - 사업자번호 : ' + setupForm.bizNoFormatter(biz_no,1) + '<br> - 회사코드 : ' + wa_code
                                                        + '<br><br>[다음] 버튼을 누르세요.'
                                                        ;
                                                        setInfoMEssage(msg);
                                                        setupForm.down('#card-next').setDisabled(false);
                                                    } else {
                                                        setInfoMEssage('사업자번호를 확인해주세요.');
                                                    }
                                                }
                                            } else {
                                                setInfoMEssage('등록된 정보를 찾을 수 없습니다. Comast Uid를 다시한번 확인하세요.');
                                            }
                                        
                                        } else {
                                            setInfoMEssage('결과값이 false 입니다.');
                                        }
                                        setupForm.setLoading(false);
                                    },
                                    failure: function(val, action){
                                        Ext.Msg.alert('오류', '잘못된 시스템 호출입습니다.', function() {});
                                        setupForm.setLoading(false);
                                    }
                                });
                            }
                            
                        }
                    }]
                }
            ]
        },
        {
            id: 'f1_infoMEssage',
            style: 'margin-top: 30px;',
            html: '<p>(주의) 시스템에 기존 데이타가 있는 경우 경고없이 모두 삭제합니다.</p><p>계속하려면 확인 버튼을 누르세요.</p>'
        },
    ]

});