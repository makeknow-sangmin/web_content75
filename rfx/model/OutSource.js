Ext.define('Rfx.model.OutSource', {
 extend: 'Rfx.model.Base',
 
    proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/purchase/request.do?method=readHistoryView', //&with_parent=T', 
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