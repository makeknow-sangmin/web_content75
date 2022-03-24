
Ext.define('Mplm.store.GoodsPjStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {

    },
	hasNull: false,
	proxy: {
	type: 'ajax',
		url: CONTEXT_PATH + '/production/schdule.do?method=readAssyTopOnlyOrder&not_restart=Y&pl_no=---',
		reader: {
			type:'json',
			root: 'datas',
			totalProperty: 'count',
			successProperty: 'success'
		},
		autoLoad: true
	},
		listeners: {
		load: function(store, records, successful,operation, options) {
			// console_logs('>>>???', store.getProxy().getReader().rawData);
		}
	}
});