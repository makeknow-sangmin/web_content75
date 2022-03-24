Ext.define('Rfx.model.MenuWigt', {
 extend: 'Rfx.model.Base',
	   proxy: {
			type: 'ajax',
	        api: {
				read: CONTEXT_PATH + '/workflow/menu.do?method=get',
				//create: CONTEXT_PATH + '/workflow/menu.do?method=create',
	            // update: ,
	            // destroy:,
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