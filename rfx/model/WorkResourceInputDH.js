Ext.define('Rfx.model.WorkResourceInputDH', {
 extend: 'Rfx.model.Base',
	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/production/schdule.do?method=getWorkresourceInput&rtg_type=OD'
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