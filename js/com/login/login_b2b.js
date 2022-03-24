Ext.require([
    'Ext.form.*',
    'Ext.window.Window'
]);

var expdate = new Date();
Ext.onReady(function() {
	expdate.setTime(expdate.getTime() + 1000 * 3600 * 24 * 30); // 30일
	var waCode = getCookie('waCode');
	var userId = getCookie('userId');
	
//	   	Ext.widget( 'button', Ext.apply({
//	        html : 'goto Public Forum',
//	        scale: 'large',
//	        style    : 'margin:15px; position:absolute; top:0px; left:0px;',
//	        renderTo : Ext.getBody(),//renderTo : 'buttonRange',
//	        handler : function () { 
//	        	goToPublic();
//	        }
//	   	}));
	   	
   	
	if(selectedLanguage=='ko') {
		languageName = '한국어';
	} else if(selectedLanguage=='zh') {
		languageName = '汉语';
	}else  {
		languageName = 'English';
	}
	
    function onItemClick(item){
        //alert('Change Language: ' + item.text);
        top.location.href= CONTEXT_PATH + '/index/login.do?method=loginForm&viewRange=private&selectedLanguage=' + item.id;
    }
    
    // functions to display feedback
    function onButtonClick(btn){
    	alert('onItemClick' + btn.text);
    }
    
	var langPanel = Ext.extend(Ext.Panel, {
        width    : 100,
        height   : 28,
        left : 100,
        style    : 'margin:15px; position:absolute; top:0px; left:0px;',
        bodyStyle: '',
        renderTo : Ext.getBody(),//renderTo : 'languageRange',
        html     : '',
        handler: onButtonClick,
        tooltip: {text:'Select your Language', title:'Language'},
        autoScroll: true
    });
   
    new langPanel({
        //title: pp_language,
        tbar: [{
            xtype:'splitbutton',
            text: languageName,
            iconCls: 'add16',
            menu: [{id:'ko', text: pp_korea, handler: onItemClick}
            ,{id:'zh', text: pp_china, handler: onItemClick}
            ,{id:'en', text: 'English', handler: onItemClick}]
        }]
    });
    
Ext.QuickTips.init();


// turn on validation errors beside the field globally
Ext.form.Field.prototype.msgTarget = 'side';

var loginForm = new Ext.form.FormPanel({
    url: CONTEXT_PATH + '/index/login.do?method=login',
    monitorValid: true,
    frame: true,
    title: pp_loginTitle,
    width: 250,
    defaultType: 'textfield',
    standardSubmit: true,
    defaults: { allowBlank: false },
    items: [{
        xtype: 'hiddenfield',
        name: 'viewRange',
        value: vVIEW_RANGE
    },{
            value:          waCode,
            fieldLabel:     pp_companyCode,
            id:				'waCode',
            name:           'waCode'
        },{
            fieldLabel: pp_id,
            name: 'userId',
            id: 'userId',
            value: userId,
            anchor:'100%'  // anchor width by percentage
        },{
            fieldLabel: pp_password,
            name: 'password',
            value: '',
            inputType: 'password',
            anchor: '100%'  // anchor width by percentage
 
            	,
            	listeners : {
	            		specialkey : function(field, e) {
	            		if (e.getKey() == Ext.EventObject.ENTER) {
	            			
	            			var wa_code = Ext.getCmp('waCode').getValue();
	            			var userId = Ext.getCmp('userId').getValue();
	            			setCookie('waCode', wa_code.toUpperCase(), expdate);
	            			setCookie('userId', userId, expdate);
	            			
	            			Ext.getCmp('enterBtn').disable();
	            			loginForm.setLoading(true);
	            			loginForm.getForm().submit();
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
			var wa_code = Ext.getCmp('waCode').getValue();
			var userId = Ext.getCmp('userId').getValue();
			setCookie('waCode', wa_code.toUpperCase(), expdate);
			setCookie('userId', userId, expdate);
	            			
			this.disable();
			loginForm.setLoading(true);
        	loginForm.getForm().submit();
        }
    }]

});

loginForm.render(Ext.get("bottom"));
loginForm.el.center();
});