Ext.define('Rfx.view.form.LoginFormPlace', {
    extend: 'Ext.form.Panel',
    xtype: 'rfx.loginForm',
    title: '관리자 로그인',
    frame:true,
    width: 320,
    bodyPadding: 10,
    url: CONTEXT_PATH + '/index/login.do?method=login&isAjax=1',
    waitMsg: '실행중...',
    method: 'POST',
    defaultType: 'textfield',
    
    items: [{
        xtype: 'hiddenfield',
        name: 'viewRange',
        value: 'private'
    },
    {
        xtype: 'hiddenfield',
        name: 'hashLink'//,
        //value: vHashLink
    },{
    	xtype: 'hiddenfield',
        id:				'waCode',
        name: 'waCode'
    }, {
        allowBlank: false,
        fieldLabel: '사용자아이디',
        name: 'userId',
        id: 'userId',
        emptyText: 'user id'
    }, {
        allowBlank: false,
        fieldLabel: '패스워드',
        name: 'password',
        id: 'password',
        emptyText: 'password',
        inputType: 'password',
    	listeners : {
    		specialkey : function(field, e) {
    		if (e.getKey() == Ext.EventObject.ENTER) {
            	//loginForm.setLoading(true);
            	Ext.getBody().mask('잠시만 기다려주세요.'); 
            	Ext.getCmp('enterBtn').disable();
				loginForm.getForm().submit({
					onSuccess: function( pResponse){
						console_log(pResponse);
																            			
            			var msg = pResponse['responseText'];
            			
            			if( msg == "OK") {
	            			var wa_code = Ext.getCmp('waCode').getValue();
	            			var userId = Ext.getCmp('userId').getValue();
	            			
	            			var rememberme_chk = Ext.getCmp('rememberme_chk').getValue();
	            			setCookie('waCode', wa_code.toUpperCase(), expdate);
	            			if(rememberme_chk==true) {
		            			setCookie('userId', userId, expdate);	
	            			} else {
	            				setCookie('userId', '', expdate);	
	            			}
	            			
            				lfn_gotoMain();
            			} else {
            				
            				Ext.getCmp('enterBtn').enable();
	            			loginForm.setLoading(false);
            				Ext.MessageBox.alert('로그인 실패', msg,
            						function()
            						{
	            					Ext.getCmp('userId').focus(false, 200);
	            					});
            				Ext.getBody().unmask();		
            			}
            			
            			//
					},
	                failure: function (formPanel, action) {
	                	Ext.getBody().unmask();		
						Ext.getCmp('enterBtn').enable();
            			loginForm.setLoading(false);
	                    var data = Ext.decode(action.response.responseText);
	                    console_log("Failure: " + data.msg);
	                    Ext.MessageBox.alert('오류',  data.msg,
        						function()
        						{
            					Ext.getCmp('userId').focus(false, 200);
            					});
	                }
				});
    		}
    	}
	} 
},{
	xtype: 'hiddenfield',
	name: 'isSupplier',
	value: 'N'
}, {
        xtype:'checkbox',
        fieldLabel: '저장',
        id: 'rememberme_chk',
        name: 'rememberme_chk'
    }],
    
    buttons: [
//        { text:'Register' },
        { 
        	id: 'enterBtn',
        	text:'로그인',
        	handler: function() {
            	//loginForm.setLoading(true);
            	Ext.getBody().mask('잠시만 기다려주세요.'); 
            	Ext.getCmp('enterBtn').disable();
				loginForm.getForm().submit({
					onSuccess: function( pResponse){
						console_log(pResponse);	
						loginForm.setLoading(false);
            			var msg = pResponse['responseText'];
            			
            			if( msg == "OK") {
	            			var wa_code = Ext.getCmp('waCode').getValue();
	            			var userId = Ext.getCmp('userId').getValue();
	            			
	            			var rememberme_chk = Ext.getCmp('rememberme_chk').getValue();

	            			setCookie('waCode', wa_code.toUpperCase(), expdate);
	            			if(rememberme_chk==true) {
		            			setCookie('userId', userId, expdate);	
	            			} else {
	            				setCookie('userId', '', expdate);	
	            			}
	            			
            				lfn_gotoMain();
            			} else {
            				
            				Ext.getCmp('enterBtn').enable();
	            			loginForm.setLoading(false);
            				Ext.MessageBox.alert('로그인 실패', msg, 
        						function()
        						{
            					Ext.getCmp('userId').focus(false, 200);
            					
            					});
            				Ext.getBody().unmask();	
            			}
						
            			//
					},
	                failure: function (formPanel, action) {
						Ext.getCmp('enterBtn').enable();
						Ext.getBody().unmask();		
            			loginForm.setLoading(false);
	                    var data = Ext.decode(action.response.responseText);
	                    console_log("Failure: " + data.msg);
	                    Ext.getBody().unmask();
	                    Ext.MessageBox.alert('오류',  data.msg,
        						function()
        						{

            					Ext.getCmp('userId').focus(false, 200);
            					});
	                }
				});
            }
        
        }
    ],
    
    initComponent: function() {
        this.defaults = {
            anchor: '100%',
            labelWidth: 120
        };

        this.callParent();
    }
});