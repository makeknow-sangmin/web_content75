Ext.define('Rfx.model.HEAVY4CreatePo', {
 extend: 'Rfx.model.Base',
 proxy: {
		type: 'ajax',
     api: {
     	read: CONTEXT_PATH + '/purchase/request.do?method=readHeavy&route_type=P',
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
		writer: {
         type: 'singlepost',
         writeAllFields: false,
         root: 'datas'
     } 
	}
});