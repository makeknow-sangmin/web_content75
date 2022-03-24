Ext.define('Rfx.model.WthDrawMgmtInType', {
	extend: 'Rfx.model.Base',
	proxy: {
		type: 'ajax',
		api: {
			read: CONTEXT_PATH + '/account/arap.do?method=readWithdrawList&type=I' /*1recoed, search by cond, search */
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