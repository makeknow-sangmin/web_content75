/**
 * Buyer Store
 */

Ext.define('Mplm.store.MaterialDetailSearchStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
        console_logs('params 111', params);

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
        }, {
            name: 'bm_quan',
            type: "number"
        }
        ,
        
        // {
        //     name: 'notifyFlag',
        //     type: "string"
        // }
	 	  ],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/purchase/material.do?method=readHeavy&not_standard_flag=A',
	         reader: {
	         	type:'json',
	             root: 'datas',
	             totalProperty: 'count',
                 successProperty: 'success'
                 //, param : 'notifyFlag'
	         }
             ,autoLoad: true
	     },
		listeners: {
			
			load: function(store, records, successful,operation, options) {
                console_logs('load records', records);
           

			},
				beforeload: function(records){
                    console_logs('beforeload', 'beforeload');
                    console_log('MaterialDetailSearchStore beforeload  >>>>');
                 
				}
		}
});