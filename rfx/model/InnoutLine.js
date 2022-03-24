Ext.define('Rfx.model.InnoutLine', {
	 extend: 'Rfx.model.Base',
	 proxy: {
		 type: 'ajax',
	        api: {
	        	read: CONTEXT_PATH + '/purchase/prch.do?method=readHistory'
	        },
			reader: {
				type: 'json',
				root: 'datas',
				rootProperty: 'datas',
				totalProperty: 'count',
				successProperty: 'success',
				excelPath: 'excelPath'
			}
	 	}
	});