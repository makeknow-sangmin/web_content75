/**
 * Buyer Store
 */
console_log('loading Mplm.store.MyProcessStore....');

Ext.define('Mplm.store.MyProcessStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
		
        // !! here may be some calculations and params alteration !!
//        Ext.apply(this, {
//        	trayType: params.trayType
//        });

    },
	fields:[     
	 	     { name: 'unique_id', type: "string" }
	 	     ,{ name: 'pj_code', type: "string"  }
	 	     ,{ name: 'item_code', type: "string"  }
	 	     ,{ name: 'item_name', type: "string"  }     
	 	  ],
	 	queryMode: 'remote',
	 	sorters: [{
	        property: 'create_date',
	        direction: 'ASC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/production/pcsstart.do?method=read&has_pcsstd=Y',
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
				console_log('Mplm.store.MyProcessStore - load');
				console_log(records);
			},
			beforeload: function(){
				console_log('Mplm.store.MyProcessStore - beforeload');
			}//endofbeforeload
		}//endoflistener
});