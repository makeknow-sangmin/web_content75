/**
 * Process Name Store
 */

Ext.define('Mplm.store.ConditionComboStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {

    },
	fields : [ {
		name : 'label',
		type : "string"
		},{
			name : 'value',
			type : "string"
			},{
				name : 'order',
				type : "int"
				}
		
	],
	sorters: [{
        property: 'order',
        direction: 'ASC'
    }],
	proxy : {
		type : 'ajax',
        url: CONTEXT_PATH + '/index/generalData.do?method=getDistinctCombo',
		reader : {
			type : 'json',
			root : 'datas',
			totalProperty : 'count',
			successProperty : 'success'
		},
		autoLoad : false
	},
	listeners: {
		beforeload: function(){
			
		}
}
});