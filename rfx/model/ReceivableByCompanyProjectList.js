Ext.define('Rfx.model.ReceivableByCompanyProjectList', {
	 extend: 'Rfx.model.Base',
		proxy: {
			type : 'ajax',
			api : {
				read : CONTEXT_PATH + '/account/arap.do?method=getReceivableByCompanyProjectList',
			},
			reader : {
				type : 'json',
				root : 'datas',
				 totalProperty: 'count',
				successProperty : 'success'
			},
			writer : {
				type : 'singlepost',
				writeAllFields : false,
				root : 'datas'
			}
		}
	});