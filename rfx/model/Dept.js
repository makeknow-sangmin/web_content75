Ext.define('Rfx.model.Dept', {
 extend: 'Rfx.model.Base',
 proxy: {
		type: 'ajax',
     api: {
         read: CONTEXT_PATH + '/admin/comdst.do?method=read',
         create: CONTEXT_PATH + '/admin/comdst.do?method=create',
         update: CONTEXT_PATH + '/admin/comdst.do?method=update',
         destroy: CONTEXT_PATH + '/admin/comdst.do?method=destroy'
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