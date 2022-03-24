Ext.define('Rfx.model.RtgAstAr', {
 extend: 'Rfx.model.Base',
 proxy: {
		type: 'ajax',
     api: {
     	read: CONTEXT_PATH + '/purchase/prch.do?method=readrtgast&rtg_type=AR'
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