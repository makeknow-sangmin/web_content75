/**
 * Buyer Store
 */

Ext.define('Mplm.store.StockPjHistoryStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
			hasNull: params.hasNull,
			product_uid: params.product_uid
        });
    },
    sorters: [{
        property: 'regist_date',
        direction: 'DESC'
    }],
     queryMode: 'remote',
     pageSize: 500,
     hasNull: false,
     hasOwn: false,
	fields:[     
		{
            name: 'unique_id',
            type: "string"
        }, {
            name: 'pj_name',
            type: "string"
        }, {
            name: 'regist_date',
            type: "string"
        }, {
            name: 'quan',
            type: "string"
        }, {
            name: 'selling_price',
            type: "string"
        }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/sales/productStock.do?method=stockPjHistory',
	         reader: {
	         	type:'json',
	             root: 'datas',
	             totalProperty: 'count',
	             successProperty: 'success'
	         }
	         ,autoLoad: true
	     },
		listeners: {
			load: function(store, records, successful,operation, options) {
				console_logs('>>>rrrr', records);

			},//endofload
			beforeload: function(){

			}
		}
});