Ext.define('Rfx.model.DbMapping', {
 extend: 'Rfx.model.Base',
    proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/database/if.do?method=dbMappingRead', //&with_parent=T', 
	            create: CONTEXT_PATH + '', 
	            update: CONTEXT_PATH + '',
	            destroy: CONTEXT_PATH + ''
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