Ext.define('Mplm.store.PointCodeStore', {
    extend : 'Ext.data.Store',
    initComponent: function(params) {
        Ext.apply(this, {
        	
        });

    },
    fields : [],
    proxy : {
		type : 'ajax',
        url: CONTEXT_PATH + '/rfid.do?method=getPointCode',
		reader : {
			type : 'json',
			root : 'datas',
			totalProperty : 'count',
			successProperty : 'success'
		},
		autoLoad : false
	},
});
