Ext.define('Rfx.model.Curing', {
	 extend: 'Rfx.model.Base',
		proxy: {
			type : 'ajax',
			api : {
				read : CONTEXT_PATH + '/production/machine.do?method=read&mchn_type=LINE',
				create : CONTEXT_PATH + '/production/machine.do?method=create',
				update : CONTEXT_PATH + '/production/machine.do?method=update',
				destroy : CONTEXT_PATH + '/production/machine.do?method=destroy'
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