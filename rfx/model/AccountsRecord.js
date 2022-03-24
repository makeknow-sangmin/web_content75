Ext.define('Rfx.model.AccountsRecord', {
 extend: 'Rfx.model.Base',
	 proxy: {
			type: 'ajax',
	     api: {
	         read: CONTEXT_PATH + '/account/arap.do?method=accountRecord'
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