Ext.define('Hanaro.model.PartLineHanaro', {
 extend: 'Rfx.model.Base',
    proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/design/bom.do?method=cloudhanaroread&BOM=T', //&with_parent=T', 
	            create: CONTEXT_PATH + '/design/bom.do?method=createNew', 
	            update: CONTEXT_PATH + '/design/bom.do?method=createNew',
	            destroy: CONTEXT_PATH + '/design/bom.do?method=destroy'
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