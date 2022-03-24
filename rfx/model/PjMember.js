Ext.define('Rfx.model.PjMember', {
	extend: 'Rfx.model.Base',
	proxy: {
		type: 'ajax',
		api: {
			
			read: CONTEXT_PATH + '/production/schdule.do?method=readPjMember', /*1recoed, search by cond, search */
//			update: CONTEXT_PATH + '/production/schdule.do?method=update',
			destroy: CONTEXT_PATH + '/production/schdule.do?method=pjdestroy'
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