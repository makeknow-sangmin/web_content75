Ext.define('Rfx.model.ProcessCodeSub2', {
 extend: 'Rfx.model.Base',
	 proxy: {
			type: 'ajax',
	     api: {
	         read: CONTEXT_PATH + '/production/pcstpl.do?method=read', /*1recoed, search by cond, search */
	         create: CONTEXT_PATH + '/admin/mesSubcode.do?method=create', /*create record, update*/
	         update: CONTEXT_PATH + '/admin/mesSubcode.do?method=create',
	         destroy: CONTEXT_PATH + '/admin/mesSubcode.do?method=destroy' /*delete*/
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