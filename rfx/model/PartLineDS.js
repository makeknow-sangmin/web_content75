Ext.define('Rfx.model.PartLineDS', {
 extend: 'Rfx.model.Base',
    proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/design/bom.do?method=cloudread&BOM=T&use_pj_leftjoin=Y', //&with_parent=T', 
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