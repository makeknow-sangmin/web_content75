Ext.define('Rfx.model.PendingBox', {
 extend: 'Rfx.model.Base',
    proxy: {
			type: 'ajax',
	        api: {
                read: CONTEXT_PATH + '/purchase/prch.do?method=readrtgast&rtg_type=A'
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