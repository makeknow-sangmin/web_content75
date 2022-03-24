/**
 * Process Name Store
 */

Ext.define('Mplm.store.MakePlanStore', {
	extend : 'Ext.data.Store',
	
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });
    },
	fields : [ {
		name : 'class_code',
		type : "string"
		}, {
			name : 'reserved_varchar1',
			type : "string"
		}, {
			name : 'reserved_varchar2',
			type : "string"
		}, {
			name : 'reserved_varchar3',
			type : "string"
		}, {
			name : 'reserved_varchar4',
			type : "string"
		}, {
			name: "unique_id",
			type: "int"
		}

	],
	hasNull: false,
	proxy : {
		type : 'ajax',
        url: CONTEXT_PATH + '/production/schdule.do?method=workorderwithpr&rtg_type=OD',
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
	},
});