Ext.define('Rfx.model.BusinessQuarterAnal', {
 extend: 'Rfx.model.Base',
	 proxy: {
			type: 'ajax',
	     api: {
	         read: CONTEXT_PATH + '/manageInfo/manageInfo.do?method=readQuarter' /*1recoed, search by cond, search */
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