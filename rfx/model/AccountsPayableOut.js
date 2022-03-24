Ext.define('Rfx.model.AccountsPayableOut', {
 extend: 'Rfx.model.Base',
	 proxy: {
			type: 'ajax',
	     api: {
	         read: CONTEXT_PATH + '/account/arap.do?method=readDeliveryItem' /*1recoed, search by cond, search */
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