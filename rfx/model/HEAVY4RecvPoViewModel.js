Ext.define('Rfx.model.HEAVY4RecvPoViewModel', {
 extend: 'Rfx.model.Base',
    proxy: {
		type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/production/schdule.do?method=readAssyMap',
            create: CONTEXT_PATH + '/index/generalData.do?method=create',
            update: CONTEXT_PATH + '/purchase/material.do?method=edit'

        },
		reader: {
			type: 'json',
			root: 'datas',
			totalProperty: 'count',
			successProperty: 'success',
            excelPath: 'excelPath',
			sum1: 'sum1',
			sum2: 'sum2',
			sum3: 'sum3',
			sum4: 'sum4',
			sum5: 'sum5'
		},
		writer: {
            type: 'singlepost',
            writeAllFields: false,
            root: 'datas'
        } 
	}
});