Ext.define('Rfx.model.HEAVY4WorkOrder_CHNG', {
 extend: 'Rfx.model.Base',
	 fields: /*(G)*/vCENTER_FIELDS,
	 proxy: {
					type: 'ajax',
			        api: {
			        	 read: CONTEXT_PATH + '/production/schdule.do?method=heavy4Workorder&rtg_type=OD&req_flag=G'
			        },
					reader: {
						type: 'json',
						root: 'datas',	
						totalProperty: 'count',
						successProperty: 'success'
					},
		            writer: {
		                type: "json",
		                encode: true,
		                writeAllFields: true,
		                rootProperty: "datas"
		            }
	 }
});