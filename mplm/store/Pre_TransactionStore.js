/**
 * Process Name Store
 */

Ext.define('Mplm.store.CommonCodeExStore', {
	extend : 'Ext.data.Store',
	autoLoad : true,
	initComponent: function(params) {
        Ext.apply(this, {
        	// hasNull: params.hasNull,
        	// parentCode: params.parentCode,
			// cmpName: params.cmpName
			account_uid:params.account_uid
        });

    },
	proxy: {
		type: 'ajax',
		url: CONTEXT_PATH + '/account/arap.do?method=PreTransaction',
		
			reader : {
				type : 'json',
				root : 'datas',
				totalProperty : 'count',
				successProperty : 'success'
			},
		},
		reader: {
			type: 'json',
			root: 'datas',
			totalProperty: 'count',
			successProperty: 'success',
			excelPath: 'excelPath'
		},
		writer: {
			type: 'singlepost',
			writeAllFields: false,
			root: 'datas'
		},
	
});