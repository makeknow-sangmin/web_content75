Ext.define('Rfx.model.WorkGroup', {
 extend: 'Rfx.model.Base',
	fields: /*(G)*/vCENTER_FIELDS,
	proxy: {
		type: 'ajax',
		api: {
			read: CONTEXT_PATH + '/production/schdule.do?method=readPcsMember', /*1recoed, search by cond, search */
			update: CONTEXT_PATH + '/production/schdule.do?method=update',
			destroy: CONTEXT_PATH + '/production/schdule.do?method=destroy'
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


