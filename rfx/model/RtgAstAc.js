Ext.define('Rfx.model.RtgAstAc', {
 extend: 'Rfx.model.Base',
 proxy: {
		type: 'ajax',
     api: {
     	read: CONTEXT_PATH + '/purchase/prch.do?method=readrtgast&rtg_type=AC'
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