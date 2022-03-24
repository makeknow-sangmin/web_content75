/**
 * MtrlSubStore
 */
Ext.define('Mplm.store.MtrlSubStore', {
    extend: 'Ext.data.Store',
initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
		 Ext.apply(this, {
			 class_code: params.class_code
	        });

    },
	fields:[     
	 	      { name: 'unique_id', type: "string" }
	 	     ,{ name: 'specification', type: "string"  }
	 	     ,{ name: 'class_code', type: "string"  }
	 	    ,{ name: 'item_code', type: "string"  }
	 	   ,{ name: 'description', type: "string"  }
	 	  ,{ name: 'model_no', type: "string"  }
	 	 ,{ name: 'standard_flag', type: "string"  }
	 	,{ name: 'sg_code', type: "string"  }
	 	,{ name: 'item_code', type: "string"  }
	 	,{ name: 'item_name2', type: "string"  }
	 	,{ name: 'maker_name', type: "string"  }
	 	,{ name: 'description', type: "string"  }
	 	,{ name: 'unit_code', type: "string"  }
	 	,{ name: 'sales_price', type: "string"  }
	 	,{ name: 'stock_qty', type: "string"  } 	 
	 	  ],
	 	sorters: [{
	        property: 'unique_id',
	        direction: 'DESC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/purchase/material.do?method=readHeavy',
	         reader: {
	         	type:'json',
	             root: 'datas',
	             totalProperty: 'count',
	             successProperty: 'success'
	         }
	         ,autoLoad: true
	     },
		listeners: {
			beforeload: function(){
					this.getProxy().setExtraParam('class_code2', this.class_code);
			}
		}
});