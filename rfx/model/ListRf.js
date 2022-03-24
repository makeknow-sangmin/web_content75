Ext.define('Rfx.model.ListRf', {
 extend: 'Rfx.model.Base',
 fields: /*(G)*/vCENTER_FIELDS,

 proxy: {
		type: 'ajax',
     api: {
    	 read: CONTEXT_PATH + '/purchase/prch.do?method=readListRf'
    	
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
	}
});