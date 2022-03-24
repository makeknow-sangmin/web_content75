Ext.define('Rfx.model.ListPo', {
 extend: 'Rfx.model.Base',
 fields: /*(G)*/vCENTER_FIELDS,

 proxy: {
		type: 'ajax',
     api: {
    	 read: CONTEXT_PATH + '/purchase/prch.do?method=readListPo'
    	// read: CONTEXT_PATH + '/purchase/prch.do?method=readListPoMes'
        /* create: CONTEXT_PATH + '/sales/delivery.do?method=create',
         update: CONTEXT_PATH + '/sales/delivery.do?method=create',
         destroy: CONTEXT_PATH + '/sales/delivery.do?method=destroy'*/
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
//		writer: {
//         type: 'singlepost',
//         writeAllFields: false,
//         root: 'datas'
//     } 
	}
//		,validators: {
//			age: 'presence',
//			name: { type: 'length', min: 2 },
//			gender: { type: 'inclusion', list: ['Male', 'Female'] },
//			username: [
//			{ type: 'exclusion', list: ['Admin', 'Operator'] },
//			{ type: 'format', matcher: /([a-z]+)[0-9]{2,3}/i }
//			]
//		}
});