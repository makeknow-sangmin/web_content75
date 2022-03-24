/**
 * UnassignedPalletStore
 */
Ext.define('Rfx.store.StockMtrlStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        });

    },
	fields : [ {
			name : 'item_code',
			type : "string",
		},
		{
			name: 'item_name',
			type : "string"
		}
	],
	sorters: [{
        property: 'po_no',
        direction: 'ASC'
    }],
    autoLoad: true,
	proxy : {
		type : 'ajax',
		url : CONTEXT_PATH + '/inventory/prchStock.do?method=readStock',
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
		

		},
		beforeload: function(){
		}
}
});