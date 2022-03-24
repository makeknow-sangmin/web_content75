/**
 * Process Name Store
 */
Ext.define('Rfx.store.CartVersionStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        });

	},
	fields : [ {
		name : 'item_name',    //납품기준일 project
		type : "string"
	}, 
	{
		name : 'quan',    
		type : "string"
	},
	{
		name : 'h_reserved3',    
		type : "string"
	},
	{
		name : 'quan',    
		type : "string"
	},
	{
		name : 'sales_price',    
		type : "string"
	},
],
	hasNull: false,
	sorters: [{
        property: 'unique_id',
        direction: 'DESC'
    }],
	proxy : {
		type : 'ajax',
		url: CONTEXT_PATH + '/purchase/request.do?method=readCartVersionByRtgast',
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


		},
		beforeload: function(){
		}
}
});