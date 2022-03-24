var formPanel = null;
function okbutton(btn){
	lfn_gotoHome();
}

function createPanalForm(usrAst) {
	var check_pass = usrAst.get('check_pass');
	var new_pass = usrAst.get('new_pass');
	var con_password = usrAst.get('con_password');
	 
	formPanel = Ext.create('Ext.form.Panel', {
		id : 'formPanel',
        collapsible: true,
        multiSelect: true,
        stateId: 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
        autoScroll: true,
        autoHeight: true,
        bodyPadding: 15,
        height: getCenterPanelHeight(),

        defaults: {
            anchor: '30%',
            allowBlank: false,
            msgTarget: 'side',
            labelWidth: 100
        },
        items: [{
            xtype: 'hiddenfield',
            name: 'hidden1',
            value: 'Hidden field value'
        },{
        	xtype: 'textfield',
        	name: 'check_pass',
        	id: 'check_pass',
        	value: check_pass,
        	inputType: 'password',
        	fieldLabel: panelSRO1191
        },{
        	xtype: 'hiddenfield',
        	name: 'hidden1',
        	value: 'Hidden field value'
        },{
        	xtype: 'textfield',
        	name: 'new_pass',
        	id: 'new_pass',
        	value: new_pass,
        	inputType: 'password',
        	fieldLabel: panelSRO1189
        },{
        	xtype: 'hiddenfield',
        	name: 'hidden1',
        	value: 'Hidden field value'
        },{
        	xtype: 'textfield',
        	name: 'con_password',
        	value: con_password,
        	id: 'con_password',
        	inputType: 'password',
        	fieldLabel: panelSRO1190
        }],
        dockedItems: [{
     		dock: 'top',
            xtype: 'toolbar',
     		items: [
     		        changePasswd
     		        ]
     	}],
        title: getMenuTitle()//,
    });
	fLAYOUT_CONTENT(formPanel);
}
var changePasswd = Ext.create('Ext.Action', {
	iconCls:'save',
	text: CMD_OK,
	disabled: fPERM_DISABLING(),
	handler: function(){
		var form = Ext.getCmp('formPanel').getForm();
		if(form.isValid())
        {
	    	var new_pass = Ext.getCmp('new_pass').getValue(); 
			var con_password = Ext.getCmp('con_password').getValue();					
			var str = new_pass.length;
			var strp = con_password.length;
			
			if(new_pass==con_password && str==strp){ //值相同且长度相同
				Ext.Ajax.request({
					url: CONTEXT_PATH + '/userMgmt/user.do?method=changeMyPassword',				
					params:{
						check_pass : Ext.getCmp('check_pass').getValue(),
						new_pass : Ext.getCmp('new_pass').getValue(),
						con_pass : Ext.getCmp('con_password').getValue()
					},
					
					success : function(result, request) {
						var result = result.responseText;
						console_log('result:' + result);
						if(result == 'false'){
							Ext.MessageBox.alert('No','Different previous password.');
						}else{ //true...
							Ext.MessageBox.show({
								title:'Success',
					            msg: 'Success',
					            fn: okbutton,
					            buttons: Ext.MessageBox.YES
							 });
						}
					},
					failure: extjsUtil.failureMessage
				});
				
			}else{
				Ext.MessageBox.alert('No','Different password.');
			}
    	}
   }
});


Ext.onReady(function() {  
	
	Ext.define('UsrAst', {
		extend : 'Ext.data.Model',
		fields : gUserFields,
		proxy : {
			type : 'ajax',
			api: {
					read: CONTEXT_PATH + '/userMgmt/user.do?method=readMyinfo'
		        },
			reader : {
				type : 'json',
				root : 'datas',
				successProperty : 'success'
			},
			writer: {
	            type: 'singlepost',
	            writeAllFields: false,
	            root: 'datas'
	        } 
		}
	});
	
	UsrAst.load('', {
		success : function(usrAst) {
			createPanalForm(usrAst);
		}// endofsuccess
	});// load
	cenerFinishCallback();
});