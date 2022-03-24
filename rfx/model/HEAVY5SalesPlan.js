Ext.define('Rfx.model.HEAVY5SalesPlan', {
 extend: 'Rfx.model.Base',
    proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/production/schdule.do?method=readSalePlan',
            // read: CONTEXT_PATH + '/production/schdule.do?method=readAssyMap&status=BM',
            create: CONTEXT_PATH + '/index/generalData.do?method=create',
            update: CONTEXT_PATH + '/purchase/material.do?method=edit'
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