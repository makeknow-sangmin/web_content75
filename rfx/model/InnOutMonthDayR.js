Ext.define('Rfx.model.InnOutMonthDayR', {
	
 extend: 'Rfx.model.Base',
    proxy: {
		type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/inventory/prchStock.do?method=readInnoutMonthDay&standard_flag=RO'
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
