/**
 * CMM_CODE Store
 */
Ext.define('Mplm.store.YearMonthStore', {
	extend : 'Ext.data.Store',
	initComponent: function() {
    },
	fields : [ 
	    {
			name : 'first',
			type : "string"
		}, {
			name : 'second',
			type : "string"
		}
	],
	parentCode: '',
	hasNull: true,
	sorters: [{
        property: 'first',
        direction: 'ASC'
    }],
	proxy : {
		type : 'ajax',
        url: CONTEXT_PATH + '/code.do?method=getYearMonthList',
		reader : {
			type : 'json',
			root : 'datas',
			totalProperty : 'count',
			successProperty : 'success'
		},
		autoLoad : false
	},
	listeners: {
		load: function(store, records, successful,operation, options) {
			console_logs('records', records);
		},
		beforeload: function(){
		}
}
});
