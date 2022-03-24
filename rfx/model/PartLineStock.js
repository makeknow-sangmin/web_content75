Ext.define('Rfx.model.PartLineStock', {
 extend: 'Rfx.model.Base',
    proxy: {
			type: 'ajax',
	        api: {
	        	 read: CONTEXT_PATH + '/design/bom.do?method=cloudread&stock_qty_useful_not_zero=true&only_goodsout_quan=true',
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