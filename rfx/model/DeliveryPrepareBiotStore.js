Ext.define('Rfx.model.DeliveryPrepareBiotStore', {
 extend: 'Rfx.model.Base',
    proxy: {
		type: 'ajax',
        api: {
        	read: CONTEXT_PATH + '/sales/delivery.do?method=readDoByCartmap',
        	create: CONTEXT_PATH + '/sales/delivery.do?method=create',
            update: CONTEXT_PATH + '/sales/delivery.do?method=create',
            destroy: CONTEXT_PATH + '/sales/delivery.do?method=destroy'
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