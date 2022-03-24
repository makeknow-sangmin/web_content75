var addAction =	 Ext.create('Ext.Action', {
	iconCls:'add',
    text: '이미지변경',
    disabled: fPERM_DISABLING(),
    handler: function(widget, event) {


    	var form = Ext.create('Ext.form.Panel', {
    		id: 'formPanel',
            
            defaultType: 'textfield',
            border: false,
            bodyPadding: 15,
            defaults: {
                anchor: '100%',
                allowBlank: false,
                msgTarget: 'side',
                labelWidth: 100
            },
             items: [ 
            {
            	xtype: 'filefield',
            	emptyText: panelSRO1149,
            	buttonText: 'upload',
                allowBlank: true,
                buttonConfig: {
                    iconCls: 'upload-icon'
                },
                anchor: '100%'
            	
            }
    		
    		
            ]
        });

        var win = Ext.create('ModalWindow', {
            title: '회사로고' + ' :: ' + ' 이미지변경',
            width: 700,
            height: 350,
            minWidth: 250,
            minHeight: 180,
            layout: 'fit',
            plain:true,
            items: form,
            buttons: [{
                text: CMD_OK,
            	handler: function(){
                    var form = Ext.getCmp('formPanel').getForm();
                    if(form.isValid())
                    {
                	var val = form.getValues(false);
            		//저장 수정
                   	pcsmcfix.save({
                		success : function() {
                           	if(win) 
                           	{
                           		win.close();
                           		store.load(function() {});
                           	}   	
                		} 
                	 });
                	 
                       	if(win) 
                       	{
                       		win.close();
                       	} 
                    } else {
                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                    }

                  }
            },{
                text: CMD_CANCEL,
            	handler: function(){
            		if(win) {win.close();} }
            }]
        });
		win.show(this, function() {
		});
     }
});


Ext.onReady(function() {  fDEF_CONTENT();

	var myHtml = '<img src =http://www.magicplm.com/jman21/company_logo/RFXS00KR_logo.jpg>';

    var obj = Ext.widget( 'component', Ext.apply({
		html : myHtml,

		pressed: false,
	    handler : function (){
	    	console_log(this.value);
	    }//endofhandler
	    ,
	    listeners: {
	        render: function() {
		    	}
		    }
		})
	);
	var form1 = Ext.create('Ext.form.Panel', {
		id: 'formPanel1',
		title: getMenuTitle(),
        defaultType: 'textfield',
        border: false,
        bodyPadding: 15,
        defaults: {
            anchor: '100%',
            allowBlank: false,
            msgTarget: 'side',
            labelWidth: 100
        },
        dockedItems: [{
        	//검색추가 삭제바.
            dock: 'top',
            xtype: 'toolbar',
            items: addAction 
            }
        
        ],
        html:obj
		
		
  
    });
	
	
	
	fLAYOUT_CONTENT(form1);


});