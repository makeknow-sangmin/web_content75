/**
 * Buyer Store
 */

Ext.define('Mplm.store.StockPrdHistoryStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
    },
	fields:[     
		{
            name: 'unique_id',
            type: "string"
        }, {
            name: 'status',
            type: "string"
        }, {
            name: 'request_date',
            type: "string"
        }, {
            name: 'quan',
            type: "string"
        }, {
            name: 'item_name',
            type: "string"
        },{
            name: 'do_state',
            type: "string"
        },{
            name: 'dl_state',
            type: "string"
        }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/sales/productStock.do?method=stockPrdHistory&is_def=C',
	         reader: {
	         	type:'json',
	             root: 'datas',
	             totalProperty: 'count',
	             successProperty: 'success'
	         }
	         ,autoLoad: false
	     },
		listeners: {
			load: function(store, records, successful,operation, options) {
				console_logs('load records', records);
			},
            beforeload: function(){
                console_logs('beforeload', 'beforeload');
            }
		}
});