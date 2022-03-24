Ext.define('Rfx.model.MyCartLineSrcahd', {
 extend: 'Rfx.model.Base',
    proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/purchase/request.do?method=readMycart', //&with_parent=T', 
	            destroy: CONTEXT_PATH + '/design/bom.do?method=destroyMycart'
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