Ext.define('Rfx.model.RtgTypeAd', {
	 extend: 'Rfx.model.Base',
		proxy: {
			type : 'ajax',
			api : {
				read : CONTEXT_PATH + '/account/arap.do?method=readAccountAdList',
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