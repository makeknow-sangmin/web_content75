Ext.define('Rfx.model.UsrAst', {
 extend: 'Rfx.model.Base',
    proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/userMgmt/user.do?method=read',
	            create: CONTEXT_PATH + '/userMgmt/user.do?method=create',
	            update: CONTEXT_PATH + '/userMgmt/user.do?method=edit',
	            destroy: CONTEXT_PATH + '/userMgmt/user.do?method=destroy'
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
            },
		}
});
