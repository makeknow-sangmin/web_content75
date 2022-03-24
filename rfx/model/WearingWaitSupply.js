Ext.define('Rfx.model.WearingWaitSupply', {
        extend: 'Rfx.model.Base',
	   	 fields: /*(G)*/vCENTER_FIELDS,
	   	    proxy: {
					type: 'ajax',
			        api: {
			        	read: CONTEXT_PATH + '/purchase/prch.do?method=readDetailHeavy&isPoqtyZero='+true+'&supastuid='+vCUR_LOGIN_ID
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
