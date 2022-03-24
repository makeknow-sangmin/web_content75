/**
 * Process Name Store
 */

Ext.define('Mplm.store.RemoveItemNameStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {

    },
	fields : [ {
		name : 'item_name',
		type : "string"
		},{
		name : 'unique_id',
		type : "string"
		},{
		name : 'id',
		type : "int"
		}
	],
	hasNull: true,
	sorters: [{
        property: 'item_name',
        direction: 'ASC'
    }],
	proxy : {
		type : 'ajax',
        url: CONTEXT_PATH + '/production/schdule.do?method=heavyReadAssyTopPlan&standard_flag=A&group_by=item_name',
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

		}
}
});