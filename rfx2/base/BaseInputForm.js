Ext.define('Rfx2.base.BaseInputForm', {
    extend: 'Ext.form.Panel',
	cls : 'rfx-panel',
	title: '입력 항목',
	
	bodyPadding: 10,
	fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 80,
        anchor: '100%',
        msgTarget: 'side'
    },
    initComponent: function(){
//        Ext.apply(this, {
//            buttons: [{
//                text: '초기화',
//                scope: this,
//                handler: this.onResetClick
//            }, {
//                text: '등록 확인',
//                scope: this,
//                handler: this.onSaveClick
//            }]
//        });
        
    	this.callParent(arguments);
    },
    onResetClick: function(){
    	console_logs('onResetClick', 'onResetClick');
        this.getForm().reset();
    },

    onSaveClick: function(){
    	console_logs('onSaveClick', 'onSaveClick');
        var form = this.getForm();
        if (form.isValid()) {
        	var val = form.getValues(false);
        	console_logs('val', val);
            Ext.MessageBox.alert('Submitted Values', val);
        } else {
        	Ext.MessageBox.alert('입력 오류', '필수 입력 필드를 확인하세요.');
        }
    }
});
