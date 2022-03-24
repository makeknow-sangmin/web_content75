Ext.define('Rfx.model.Series', {
 extend: 'Rfx.model.Base',
	fields: /*(G)*/vCENTER_FIELDS,
	proxy: {
		type: 'ajax',
		api: {
			read: CONTEXT_PATH + '/admin/Series.do?method=readSeriesList', /* 시리즈 가져오기 */
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


