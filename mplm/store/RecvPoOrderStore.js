/**
 * Buyer Store
 */

Ext.define('Mplm.store.RecvPoOrderStore', {
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
            name: 'description',
            type: "string"
        }, {
            name: 'specification_query',
            type: "string"
        }, {
            name: 'class_name',
            type: "string"
        }
	 	  ],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/production/schdule.do?method=readAssyTopVer&not_restart=Y&sortCond=p.pj_code DESC',
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