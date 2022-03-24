Ext.define('Rfx.model.RackRegistration', {
 extend: 'Rfx.model.Base',
    proxy: {
		type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/admin/stdClass.do?method=readMaterial&identification_code=RC',
            create: CONTEXT_PATH + '/admin/stdClass.do?method=create',
            update: CONTEXT_PATH + '/admin/stdClass.do?method=create',
            destroy: CONTEXT_PATH + '/admin/stdClass.do?method=destroy'
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