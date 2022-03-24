/**
 * IsComplished Store
 */

Ext.define('Mplm.store.MenuObjectLineStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });

    },
	fields : [ 
		{
			name : 'menu_key',
			type : "string"
		}, {
			name : 'display_name_ko',
			type : "string"
		}

	],
	hasNull: true,
	sorters: [{
        property: 'display_name_ko',
        direction: 'ASC'
    }],
	proxy : {
		type : 'ajax',
        url: CONTEXT_PATH + '/admin/menu.do?method=readObject',
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