
/**
 * 일반적인 Partline store
 */
Ext.define('Mplm.store.CompareVersionStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
		
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
		 ,{ name: 'change_type', type: "string"  }
	 	     
	 	  ],
	         
	         
	 	 hasNull: true,
	 	 sorters: [{
	         property: 'pl_no',
	         direction: 'ASC'
   	     }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/design/bom.do?method=versionCompareByVer',
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
					console_logs("CompareVersionStore    ====>   ", records);
			    },
			    beforeload: function(){
				}
		}
});