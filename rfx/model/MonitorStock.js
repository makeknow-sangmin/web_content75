Ext.define('Rfx.model.MonitorStock', {
 extend: 'Rfx.model.Base',
    proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/stock/position.do?method=read',
	            //create: CONTEXT_PATH + '/index/generalData.do?method=create',
	            create: CONTEXT_PATH + '/stock/position.do?method=create',
	            update: CONTEXT_PATH + '/stock/position.do?method=create',
	            destroy: CONTEXT_PATH + '/stock/position.do?method=destroy'
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
//            writer: {
//                type: 'singlepost',
//                writeAllFields: false,
//                root: 'datas'
//            }
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