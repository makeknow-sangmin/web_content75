Ext.define('Rfx.model.HEAVY4SEWProducePlan', {
 extend: 'Rfx.model.Base',
    proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/production/schdule.do?method=heavyReadAssyTopPlan&mtr_type=PRD'},
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