Ext.define('Rfx.model.ProductNewStock', {
 extend: 'Rfx.model.Base',
    proxy: {
		type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/sales/productStock.do?method=readbyproduct', /*1recoed, search by cond, search */
            create: CONTEXT_PATH + '/sales/productStock.do?method=create', /*create record, update*/
            update: CONTEXT_PATH + '/sales/productStock.do?method=update',
            destroy: CONTEXT_PATH + '/sales/productStock.do?method=destroy' /*delete*/
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