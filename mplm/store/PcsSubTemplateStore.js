/**
 * Process Name Store
 */

Ext.define('Mplm.store.PcsSubTemplateStore', {
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
			name : 'codeNameEn',
			type : "string"
		}, {
			name: "unique_id",
			type: "int"
		}

	],
	hasNull: false,
	proxy : {
		type : 'ajax',
        url: CONTEXT_PATH + '/code.do?method=read&parentCode=PROCESS_TEMPLATE',
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