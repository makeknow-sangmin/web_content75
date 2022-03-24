Ext.define('Rfx.model.SMSHistory', {
 extend: 'Rfx.model.Base',
	 fields: /*(G)*/vCENTER_FIELDS,
	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/collab/mail.do?method=read'
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