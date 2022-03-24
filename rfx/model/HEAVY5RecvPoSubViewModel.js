Ext.define('Rfx.model.HEAVY5RecvPoSubViewModel', {
 extend: 'Rfx.model.Base',
    proxy: {
		type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/production/schdule.do?method=readAssyEditMap',
            create: CONTEXT_PATH + '/index/generalData.do?method=create',
            update: CONTEXT_PATH + '/purchase/material.do?method=edit'

        },
        extraParams: {
        	DH_H5 : 'DH_H5'
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