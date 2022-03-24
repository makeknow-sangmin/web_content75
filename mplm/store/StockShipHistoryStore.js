/**
 * Buyer Store
 */

Ext.define('Mplm.store.StockShipHistoryStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
    },
    sorters: [{
        property: 'do_date',
        direction: 'DESC'
    }],
	fields:[     
		{
            name: 'unique_id',
            type: "string"
        }, {
            name: 'do_date',
            type: "string"
        }, {
            name: 'dl_date',
            type: "string"
        }, {
            name: 'ship_state',
            type: "string"
        }, {
            name: 'do_qty',
            type: "string"
        }, {
            name: 'dl_qty',
            type: "string"
        }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/sales/productStock.do?method=stockShipHistory&is_def=C',
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