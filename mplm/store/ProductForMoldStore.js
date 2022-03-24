/**
 * Buyer Store
 */

Ext.define('Mplm.store.ProductForMoldStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
    },
	fields:[     
		{
            name: 'unique_id',
            type: "string"
        }, {
            name: 'item_code',
            type: "string"
        }, {
            name: 'item_name',
            type: "string"
        }, {
            name: 'specification',
            type: "string"
        }, {
            name: 'maker_name',
            type: "string"
        }, {
            name: 'model_no',
            type: "string"
        }, {
            name: 'description',
            type: "string"
        }, {
            name: 'specification_query',
            type: "string"
        }
	 	  ],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/purchase/material.do?method=readExtendSrcahdWithBomVer&not_standard_flag=SH', /*1recoed, search by cond, search */
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
				console_logs('load records', records);

			},
				beforeload: function(){
					console_logs('beforeload', 'beforeload');
				}
		}
});