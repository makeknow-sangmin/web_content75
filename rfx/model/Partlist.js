Ext.define('Rfx.model.Partlist', {
 extend: 'Rfx.model.Base',
    proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/production/partlist.do?method=read',
	            create: CONTEXT_PATH + '/production/pcsstd.do?method=createOnlyStd',
	            update: CONTEXT_PATH + '/production/pcsstd.do?method=createOnlyStd',
	            destroy: CONTEXT_PATH + '/production/pcsstd.do?method=destroyOnlyStd'
	        },
			reader: {
				type: 'json',
				root: 'datas',
				totalProperty: 'count',
				successProperty: 'success',
				excelPath: 'excelPath'
			},
            writer: {
                type: "json",
                encode: true,
                writeAllFields: true,
                rootProperty: "datas"
            }
		}
});