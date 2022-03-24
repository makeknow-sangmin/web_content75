
/**
 * 일반적인 Partline store
 */
Ext.define('Mplm.store.PartLineGeneralStore', {
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
	 	     ,{ name: 'specification', type: "string"  }
	 	     ,{ name: 'item_name', type: "string"  }
	 	     ,{ name: 'standard_flag', type: "string"  }
		 	 ,{ name: 'class_code', type: "string"  }
			 ,{ name: 'description', type: "string"  }
			 ,{ name: 'model_no', type: "string"  }
			 ,{ name: 'comment', type: "string"  }
			 ,{ name: 'maker_name', type: "string"  }
			 ,{ name: 'unit_code', type: "string"  }
			 ,{ name: 'currency', type: "string"  }
			 ,{ name: 'sales_price', type: "float"  }
	 	  ],
	         extraParams : {
	        	 rtgType: 'PR', //PR,PO,GR,RF
	        	 rtgast_uid: '-1'
	         },
	         
	 	 hasNull: true,
	 	 sorters: [{
	         property: 'item_name',
	         direction: 'DESC'
   	     }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/design/bom.do?method=cloudread&BOM=T',
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

			    },
			    beforeload: function(){
				}
		}
});