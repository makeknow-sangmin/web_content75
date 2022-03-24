Ext.define('Rfx.model.PcsStdTemplete', {
	extend: 'Rfx.model.Base',
		proxy: {
			type: 'ajax',
			api: {
		         read: CONTEXT_PATH + '/admin/mescode.do?method=readCode&parent_system_code=PCSSTD_TEMPLETE_MGMT', /*1recoed, search by cond, search */
		         create: CONTEXT_PATH + '/admin/mescode.do?method=create', /*create record, update*/
		         update: CONTEXT_PATH + '/admin/mescode.do?method=create',
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