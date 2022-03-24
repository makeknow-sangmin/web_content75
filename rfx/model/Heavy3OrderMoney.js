Ext.define('Rfx.model.Heavy3OrderMoney', {
	extend: 'Rfx.model.Base',
	    proxy: {
			type: 'ajax',
	        api: {
	        	read: CONTEXT_PATH + '/purchase/prch.do?method=readOrderMoney'
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
	        } 
	}
});