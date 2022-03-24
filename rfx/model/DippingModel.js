Ext.define('Rfx.model.DippingModel', {
        extend: 'Rfx.model.Base',
	   	 fields: /*(G)*/vCENTER_FIELDS,
	   	    proxy: {
					type: 'ajax',
			        api: {
			        	read: CONTEXT_PATH + '/quality/qualitymgmt.do?method=dippingHistory'
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
