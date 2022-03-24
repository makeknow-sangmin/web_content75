Ext.define('Rfx.model.AttachedFile', {
 extend: 'Rfx.model.Base',
    proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/fileObject.do?method=readFileList'
	            // create: CONTEXT_PATH + '/production/pcsstd.do?method=createOnlyStd',
	            // update: CONTEXT_PATH + '/production/pcsstd.do?method=createOnlyStd',
	            // destroy: CONTEXT_PATH + '/production/pcsstd.do?method=destroyOnlyStd'
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