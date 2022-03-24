/**
 * Process Name Store
 */

Ext.define('Mplm.store.ParentMenuCodelineStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });

    },
	fields : [ {
		name : 'systemCode',
		type : "string"
		}, {
			name : 'codeName',
			type : "string"
		}, {
			name : 'code_name_kr',
			type : "string"
		}, {
			name : 'parent_system_code',
			type : "string"
		}

	],
 	sorters: [{
        property: 'parent_system_code',
        direction: 'ASC'
    }],
	hasNull: false,
	proxy : {
		type : 'ajax',
		url : CONTEXT_PATH + '/code.do?method=getListParentMenuCodeLine',
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