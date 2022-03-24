Ext.require([
    'Ext.form.*',
    'Ext.window.Window'
]);

var targetForm = 0;
var supplierCode = '';
var expdate = new Date();
Ext.onReady(function() {
	expdate.setTime(expdate.getTime() + 1000 * 3600 * 24 * 30); // 30일
	var user_type = getCookie('PLM_USER_TYPE');
	supplierCode = getCookie('waCode1');
	if(user_type == 'partner' && supplierCode != null){
		targetForm = 1;
	}else{
		targetForm = 0;
	}
	if(selectedLanguage=='ko') {
		languageName = '한국어';
		company_title='Company';
		partner_titile='Partner';
	} else if(selectedLanguage=='zh') {
		languageName = '中文';
		company_title='公司';
		partner_titile='供应商';
	}else  {
		languageName = 'English';
		company_title='Company';
		partner_titile='Partner';
	}
	
    function onItemClick(item){
        //alert('Change Language: ' + item.text);
        top.location.href= CONTEXT_PATH + '/index/login.do?method=loginForm&selectedLanguage=' + item.id;
    }
    
    // functions to display feedback
    function onButtonClick(btn){
    	alert('onItemClick' + btn.text);
    }
    
	var langPanel = Ext.extend(Ext.Panel, {
        width    : 250,
        height   : 28,
        left : 100,
        style    : 'margin-top:15px',
        bodyStyle: '',
        renderTo :'lang',
        html     : '',
        handler: onButtonClick,
        tooltip: {text:selectedLanguage, title: pp_language},
        autoScroll: true
    });
   
    new langPanel({
        //title: pp_language,
        tbar: [
               pp_language,
               '->',
               {
            xtype:'splitbutton',
            text: languageName,
            iconCls: 'add16',
            menu: [{id:'ko', text: pp_korea, handler: onItemClick}
            ,{id:'zh', text: pp_china, handler: onItemClick}
            ,{id:'en', text: pp_english, handler: onItemClick}]
        }]
    });
    
Ext.QuickTips.init();


// turn on validation errors beside the field globally
Ext.form.Field.prototype.msgTarget = 'side';

var loginFormInner = new Ext.form.FormPanel({
	id:'loginFormInner',
    url: CONTEXT_PATH + '/index/login.do?method=login',
    monitorValid: true,
    frame: true,
    defaultType: 'textfield',
    standardSubmit: true,
    defaults: {
    	allowBlank: false,
    	bodyPadding: 10
    },
    items: [
        {
	        xtype: 'hiddenfield',
	        name: 'viewRange',
	        value: vVIEW_RANGE
	    },{
            xtype:          'combo',
            mode:           'local',
            value:          'JS0000CN',
            triggerAction:  'all',
            forceSelection: true,
            editable:       false,
            fieldLabel:     pp_companyCode,
            name:           'waCode',
            displayField:   'name',
            valueField:     'value',
            queryMode: 'local',
            anchor:'100%',
            store:          Ext.create('Ext.data.Store', {
                fields : ['name', 'value'],
                data   : [
                    {name : pp_firstBu,   value: 'JS0000CN'}
                    //,{name : pp_secondBu,   value: 'BBBB'}
                    //,{name : pp_thirdBu,   value: 'CCCC'}
                ]
            })
        },{
            fieldLabel: pp_id,
            id: 'userId',
            name: 'userId',
            anchor:'100%'  // anchor width by percentage
        },{
            fieldLabel: pp_password,
            id: 'password',
            name: 'password',
            inputType: 'password',
            anchor: '100%'  // anchor width by percentage
 
            	,
            	listeners : {
	            		specialkey : function(field, e) {
	            		if (e.getKey() == Ext.EventObject.ENTER) {
	            			setCookie('PLM_USER_TYPE', 'company', expdate);
	            			Ext.getCmp('enterBtn').disable();
	            			loginFormInner.setLoading(true);
	            			loginFormInner.getForm().submit();
	            		}
	            	}
            	}            	
        }],

    buttons:
    [{
        text: pp_ok,
        formBind: true,
        id: 'enterBtn',
        handler: function (btn, evt) {
        	setCookie('PLM_USER_TYPE', 'company', expdate);
			this.disable();
			loginFormInner.setLoading(true);
        	loginFormInner.getForm().submit();
        }
    }]

});


var loginFormPartner = new Ext.form.FormPanel({
	id:'loginFormPartner',
    url: CONTEXT_PATH + '/index/login.do?method=login',
    monitorValid: true,
    frame: true,
    defaultType: 'textfield',
    standardSubmit: true,
    defaults: {
    	allowBlank: false,
    	bodyPadding: 10
    },
    items: [
        {
	        xtype: 'hiddenfield',
	        name: 'viewRange',
	        value: vVIEW_RANGE
	    },{
	        xtype: 'hiddenfield',
	        name: 'isSupplier',
	        value: 'Y'
	    },{
            fieldLabel:     login_company_code,
            id: 'waCode1',
            name: 'waCode1',
            value : supplierCode,
                anchor:'100%'
        },{
            fieldLabel: 'e-Mail',
            id: 'userId1',
            name: 'userId1',
            anchor:'100%'  // anchor width by percentage
        },
        
        
//        new Ext.form.Hidden({
//	           name: 'waCode'
//        }),
//        new Ext.form.Hidden({
//	           name: 'password'
//     }),
//     new Ext.form.Hidden({
//         name: 'userId'
//  }),
        
        {
            fieldLabel: pp_password,
            id: 'password1',
            name: 'password1',
            inputType: 'password',
            anchor: '100%'  // anchor width by percentage
 
            	,
            	listeners : {
	            		specialkey : function(field, e) {
	            		if (e.getKey() == Ext.EventObject.ENTER) {
	            			
	            			
	            			var wa_code = Ext.getCmp('waCode1').getValue();
//	            			var user_id =  Ext.getCmp('userId1').getValue();
//	            			var pass =  Ext.getCmp('password1').getValue();
	            			
//	            			Ext.getCmp('waCode').setValue(wa_code);
//	            			Ext.getCmp('userId').setValue(user_id);
//	            			Ext.getCmp('password').setValue(pass);
	            			
	            			setCookie('PLM_USER_TYPE', 'partner', expdate);
	            			setCookie('waCode1', wa_code, expdate);
	            			

	            			
	            			Ext.getCmp('enterBtn').disable();
	            			loginFormPartner.setLoading(true);
	            			loginFormPartner.getForm().submit();
	            		}
	            	}
            	}            	
        }],

    buttons:
    [{
        text: pp_ok,
        formBind: true,
        id: 'enterBtn1',
        handler: function (btn, evt) {
        	
			var wa_code = Ext.getCmp('waCode1').getValue();
//			var user_id =  Ext.getCmp('userId1').getValue();
//			var pass =  Ext.getCmp('password1').getValue();
			
//			Ext.getCmp('waCode').setValue(wa_code);
//			Ext.getCmp('userId').setValue(user_id);
//			Ext.getCmp('password').setValue(pass);
			
        	setCookie('PLM_USER_TYPE', 'partner', expdate);
        	setCookie('waCode1', wa_code, expdate);
			this.disable();
			loginFormPartner.setLoading(true);
        	loginFormPartner.getForm().submit();
        }
    }]

});

	var tabs = Ext.widget('tabpanel', {
	    width: 250,
		renderTo : 'tabs1',
	    activeTab: targetForm,
	    defaults :{
	        bodyPadding: 0
	    },
	    items: [{
	        title: company_title,
	        items:[loginFormInner]
	    },{
	        title: partner_titile,
	        items:[loginFormPartner]
	    }]
	});
/*
loginForm.render(Ext.get("backImage"));
loginForm.el.center();
Ext.getCmp('userId').focus(false, 200);
*/

//tabs.render(Ext.get("backImage"));
//tabs.el.center();

Ext.getCmp('userId').focus(false, 200);

});