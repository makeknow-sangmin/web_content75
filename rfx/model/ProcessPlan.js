Ext.define('Rfx.model.ProcessPlan', {
	extend: 'Rfx.model.Base',
	proxy: {
		type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/design/bom.do?method=readEpc1', 					/*1recoed, search by cond, search */
            create: CONTEXT_PATH + '/design/bom.do?method=create', 			/*create record, update*/
            update: CONTEXT_PATH + '/design/bom.do?method=update',
            destroy: CONTEXT_PATH + '/design/bom.do?method=destroy' 			/*delete*/
        },
		reader: {
			type: 'json',
			root: 'datas',
			totalProperty: 'count',
			successProperty: 'success'
		},
		writer: {
            type: 'singlepost',
            writeAllFields: false,
            root: 'datas'
        } 
	}
});
