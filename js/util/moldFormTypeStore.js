console_log('loading moldFormTypeStore....');
var moldFormTypeStore = new Ext.create('Ext.data.Store', {
	fields : [ {
		name : 'systemCode',
		type : "string"
		}, {
			name : 'codeName',
			type : "string"
		}, {
			name : 'codeNameEn',
			type : "string"
		}
	],
	sorters: [{
        property: 'systemCode',
        direction: 'ASC'
    }],
	proxy : {
		type : 'ajax',
		url : CONTEXT_PATH + '/sales/poreceipt.do?method=moldFormTypeCode',
		reader : {
			type : 'json',
			root : 'datas',
			totalProperty : 'count',
			successProperty : 'success'
		},
		autoLoad : false
	}
});