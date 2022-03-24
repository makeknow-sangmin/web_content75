Ext.define('Rfx.model.GeneralCode', {
 extend: 'Rfx.model.Base',
	   proxy: {
			type: 'ajax',
	        api: {
				// read: CONTEXT_PATH + '/gencode.do?method=read',
				read: CONTEXT_PATH + '/admin/codeStructure.do?method=readAmc1&parent_system_code=TOP',
				create: CONTEXT_PATH + '/index/generalData.do?method=create', /*create record, update*/
	            update: CONTEXT_PATH + '/admin/codeStructure.do?method=create',
	            destroy: CONTEXT_PATH + '/admin/codeStructure.do?method=destroy' /*delete*/
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