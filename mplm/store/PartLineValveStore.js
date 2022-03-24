
/**
 * 일반적인 Partline store
 */
Ext.define('Mplm.store.PartLineValveStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
		
		console_log('MyPartStore.initComponent');
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });
    },
	fields:[     
	 	      { name: 'unique_id_long', type: "int" }
	 	     ,{ name: 'unique_id', type: "string" }
	 	     ,{ name: 'item_code', type: "string"  }
	 	     ,{ name: 'bm_quan', type: "int"  }
			  ,{ name: 'reserved1', type: "string"  }
			  ,{ name: 'reserved2', type: "string"  }
			 ,{name:'reserved3',type:"string"}
	 	     
	 	  ],
	         
	         
	 	 hasNull: true,
	 	 sorters: [{
	         property: 'item_code',
	         direction: 'ASC'
   	     }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/design/bom.do?method=valveread',
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
					console_logs("valve Stroe records    ====>   ", records);
			    },
			    beforeload: function(){
				}
		}
});