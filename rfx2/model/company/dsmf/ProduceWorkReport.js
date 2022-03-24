Ext.define('Rfx2.model.company.dsmf.ProduceWorkReport', {
 extend: 'Rfx.model.Base',
	 fields: /*(G)*/vCENTER_FIELDS,
	 proxy: {
		type: 'ajax',
		api: {
				read: CONTEXT_PATH + '/production/schdule.do?method=getProductWorkResultReport'
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