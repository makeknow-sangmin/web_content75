Ext.define('Rfx2.model.company.chmr.ProduceWorkOrder', {
 extend: 'Rfx.model.Base',
	 fields: /*(G)*/vCENTER_FIELDS,
	 proxy: {
		type: 'ajax',
		api: {
			 read: CONTEXT_PATH + '/production/schdule.do?method=workorderwithpr&rtg_type=OP&not_pj_type=WH'
		},
		reader: {
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