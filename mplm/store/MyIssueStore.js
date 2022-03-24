/**
 * Buyer Store
 */
console_log('loading Mplm.store.MyIssueStore....');

Ext.define('Mplm.store.MyIssueStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
		
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	trayType: params.trayType
        });

    },
	fields:[     
	 	     { name: 'unique_id', type: "string" }
	 	     ,{ name: 'id', type: "int" }
	 	     ,{ name: 'unique_id_long', type: "int" }
	 	     ,{ name: 'rqst_title', type: "string"  }
	 	     ,{ name: 'rqst_content', type: "string"  }
	 	     ,{ name: 'user_name', type: "string"  }
	 	     ,{ name: 'create_date', type: "date"  }
	 	     
	 	  ],
	 	queryMode: 'remote',
	 	trayType: 'PENDING',
	 	sorters: [{
	        property: 'create_date',
	        direction: 'ASC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/collab/svcqst.do?method=read',
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
				console_log('Mplm.store.MyIssueStore - load');
				console_log(records);
			},
			beforeload: function(){
				console_log('Mplm.store.MyIssueStore - beforeload');
			}//endofbeforeload
		}//endoflistener
});