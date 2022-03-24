Ext.define('Rfx.model.DeliveryPerform', {
 extend: 'Rfx.model.Base',
    proxy: {
		type: 'ajax',
        api: {
        	read: CONTEXT_PATH + '/design/project.do?method=delInfoList',
            create: CONTEXT_PATH + '/design/project.do?method=create',
            update: CONTEXT_PATH + '/design/project.do?method=create',
            destroy: CONTEXT_PATH + '/design/project.do?method=destroy'
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