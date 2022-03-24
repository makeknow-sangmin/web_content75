
/**
 * UnassignedPalletStore
 */
Ext.define('Rfx.store.SeriesItemStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
			hasNull: params.hasNull
        });

    },
	fields : [ {
			name : 'item_code',
			type : "string",
		}
	],
	sorters: [{
        property: 'unique_id',
        direction: 'ASC'
    }],
	proxy : {
		type : 'ajax',
		url : CONTEXT_PATH + '/admin/Series.do?method=readSeriesSrcahd',
		reader : {
			type : 'json',
			root : 'datas',
			totalProperty : 'count',
			successProperty : 'success'
		},
		autoLoad : true
	},
	listeners: {
		load: function(store, records, successful,operation, options) {
			if(this.hasNull) {
				var blank ={
					systemCode: ''
					};
					
					this.add(blank);
				}

		},
		beforeload: function(){
		
		}
}
});