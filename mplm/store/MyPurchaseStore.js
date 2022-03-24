/**
 * Buyer Store
 */
console_log('loading Mplm.store.MyPurchaseStore....');

Ext.define('Mplm.store.MyPurchaseStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
		
        // !! here may be some calculations and params alteration !!
//        Ext.apply(this, {
//        	trayType: params.trayType
//        });

    },
	fields:[     
	 	     { name: 'unique_id', type: "string" }
	 	     ,{ name: 'id', type: "int" }
	 	     ,{ name: 'unique_id_long', type: "int" }
	 	     ,{ name: 'name', type: "string"  }
	 	     ,{ name: 'content', type: "string"  }
	 	     ,{ name: 'user_name', type: "string"  }
	 	     ,{ name: 'create_date', type: "date"  }
	 	     
	 	  ],
	 	queryMode: 'remote',
	 	sorters: [{
	        property: 'create_date',
	        direction: 'ASC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/purchase/prch.do?method=read',
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
				console_log('Mplm.store.MyPurchaseStore - load');
				console_log(records);
			},
			beforeload: function(){
				console_log('Mplm.store.MyPurchaseStore - beforeload');
			}//endofbeforeload
		}//endoflistener
});