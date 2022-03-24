Ext.define('Rfx.model.WarehousingCancelState', {
 extend: 'Rfx.model.Base',
    proxy: {
		type: 'ajax',
        api: {
        	read: CONTEXT_PATH + '/quality/wgrast.do?method=readCancel'
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