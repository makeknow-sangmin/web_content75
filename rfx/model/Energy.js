Ext.define('Rfx.model.Energy', {
 extend: 'Rfx.model.Base',
    proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/energy/usage.do?method=read'
	            // create: CONTEXT_PATH + '/userMgmt/user.do?method=create',
	            // update: CONTEXT_PATH + '/userMgmt/user.do?method=edit',
	            // destroy: CONTEXT_PATH + '/userMgmt/user.do?method=destroy'
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
