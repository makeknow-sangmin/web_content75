Ext.define('Rfx.model.ProjectMgmt', {
	 extend: 'Rfx.model.Base',
	    proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/sales/poreceipt.do?method=cloudread&menu_code=EPJ2', /*1recoed, search by cond, search */
//				create: CONTEXT_PATH + '/sales/poreceipt.do?method=create', /*create record, update*/
	            create: CONTEXT_PATH + '/sales/poreceipt.do?method=cloudcreateroute&simpleRegistProject='+ vSimpleRegistProject, 
	            update: CONTEXT_PATH + '/sales/poreceipt.do?method=update',
	            destroy: CONTEXT_PATH + '/sales/poreceipt.do?method=destroy' /*delete*/
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