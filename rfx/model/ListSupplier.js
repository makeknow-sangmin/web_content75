Ext.define('Rfx.model.ListSupplier', {
 extend: 'Rfx.model.Base',
	 proxy: {
			type: 'ajax',
		    api: {
		         read: CONTEXT_PATH + '/purchase/supplier.do?method=read&orderBy=supplier_name ASC',
		         create: CONTEXT_PATH + '/purchase/supplier.do?method=create',
		         update: CONTEXT_PATH + '/purchase/supplier.do?method=create',
		         destroy: CONTEXT_PATH + '/purchase/supplier.do?method=destroy'
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