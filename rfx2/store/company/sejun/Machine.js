//자이솜속성값들고오기
Ext.define('Rfx2.store.company.sejun.Machine', {
	 extend: 'Rfx.model.Base',
		proxy: {
			type : 'ajax',
			api : {
				read : CONTEXT_PATH + '/production/machine.do?method=readEfiast',
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