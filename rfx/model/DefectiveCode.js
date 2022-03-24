Ext.define('Rfx.model.DefectiveCode', {
 extend: 'Rfx.model.Base',
	 proxy: {
			type: 'ajax',
	     api: {
	         read: CONTEXT_PATH + '/admin/mescode.do?method=readdefectivecode', /*1recoed, search by cond, search */
	         create: CONTEXT_PATH + '/admin/mescode.do?method=createDefective', /*create record, update*/
	         update: CONTEXT_PATH + '/admin/mescode.do?method=updateDefective',
	         destroy: CONTEXT_PATH + '/admin/mescode.do?method=destroy' /*delete*/
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