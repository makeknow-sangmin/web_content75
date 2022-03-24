/**
 * Process Name Store
 */

Ext.define('Mplm.store.LotDetailStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {},
	fields : [ {
		name : 'unique_id',
		type : "string"
		}, {
			name : 'pj_name',
			type : "string"
		}, {
			name : 'item_name',
			type : "string"
		}, {
			name : 'specification',
			type : "string"
		}, {
			name : 'alter_item_code',
			type : "string"
		}, {
			name : 'item_code',
			type : "string"
		}

	],
	sorters: [{
         property: 'item_code',
         direction: 'ASC'
     }],
	proxy : {
		type : 'ajax',
        url: CONTEXT_PATH + '/production/pcsstd.do?method=readLotDetail',
		reader : {
			type : 'json',
			root : 'datas',
			totalProperty : 'count',
			successProperty : 'success'
		},
		autoLoad : true
		
	}
});