Ext.define('Rfx.model.AccountsPayable', {
 extend: 'Rfx.model.Base',
	 proxy: {
			type: 'ajax',
	     api: {
	         read: CONTEXT_PATH + '/purchase/prch.do?method=readGoodsReceipt&is_account=Y' /*1recoed, search by cond, search */
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