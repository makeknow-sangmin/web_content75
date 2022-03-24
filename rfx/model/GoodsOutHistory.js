Ext.define('Rfx.model.GoodsOutHistory', {
 extend: 'Rfx.model.Base',
 proxy: {
		type: 'ajax',
     api: {
     	read: CONTEXT_PATH + '/purchase/request.do?method=readHeavy&route_type=G&status=G',
         create: CONTEXT_PATH + '/purchase/request.do?method=create',
         update: CONTEXT_PATH + '/purchase/request.do?method=update',
         destroy: CONTEXT_PATH + '/purchase/request.do?method=destroy'
     },
		reader: {
			type: 'json',
			root: 'datas',
			totalProperty: 'count',
			successProperty: 'success',
			excelPath: 'excelPath'
		},
		sorters: [{
			_property: 'pr_no',
			_direction: 'asc'
		}],
		writer: {
         type: 'singlepost',
         writeAllFields: false,
         root: 'datas'
     } 
	}
});