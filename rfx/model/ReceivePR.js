Ext.define('Rfx.model.ReceivePR', {
 extend: 'Rfx.model.Base',
	 fields: /*(G)*/vCENTER_FIELDS,
	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/purchase/material.do?method=readMypart', /*1recoed, search by cond, search */
		            create: CONTEXT_PATH + '/purchase/material.do?method=createMypart', /*create record, update*/
		            destroy: CONTEXT_PATH + '/purchase/material.do?method=destroyMypart' /*delete*/
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