Ext.define('Rfx.model.HEAVY4WorkOrder', {
 extend: 'Rfx.model.Base',
	 fields: /*(G)*/vCENTER_FIELDS,
	 proxy: {
					type: 'ajax',
			        api: {
			        	 read: CONTEXT_PATH + '/production/schdule.do?method=heavy4Workorder&rtg_type=OD&po_type=RAP'
			        },
					reader: {
						type: 'json',
						type: 'json',
						root: 'datas',
						totalProperty: 'count',
						successProperty: 'success'
					},
		            writer: {
		                type: 'json',
		                encode: true,
		                writeAllFields: true,
		                rootProperty: "datas"
		            }
	 }
});