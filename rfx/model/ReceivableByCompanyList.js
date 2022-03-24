Ext.define('Rfx.model.ReceivableByCompanyList', {
	 extend: 'Rfx.model.Base',
		proxy: {
			type : 'ajax',
			api : {
				read : CONTEXT_PATH + '/account/arap.do?method=getReceivableByCompanyList',
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