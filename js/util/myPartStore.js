console_log('loading myPartStore....');
/**
 * Item Store MyPartStore
 */
var myPartStore = new Ext.create('Ext.data.Store', {
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
			 ,{ name: 'sg_code', type: "string"  }
	 	  ],
	 	 sorters: [{
	         property: 'item_code',
	         direction: 'DESC'
   	     }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/purchase/material.do?method=readMypart',
	         reader: {
	         	type:'json',
	             root: 'datas',
	             totalProperty: 'count',
	             successProperty: 'success'
	         }
	         ,autoLoad: false
	     }
});