/**
 * Product Store
 */
Ext.define('Mplm.store.ProductStoreDS', {
    extend: 'Ext.data.Store',
initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
		 Ext.apply(this, {
			 //class_code: params.class_code,
			 area_code: params.area_code
			 
	      });
    },
	fields:[     
	 	      { name: 'unique_id', type: "string" }
	 	     ,{ name: 'specification', type: "string"  }
	 	     ,{ name: 'class_code', type: "string"  }
	 	    ,{ name: 'item_code', type: "string"  }
	 	   ,{ name: 'description', type: "string"  }
	 	  ,{ name: 'model_no', type: "string"  }
	 	  ,{ name: 'area_code', type: "string" }
	 	  ],
	 	sorters: [{
	        property: 'class_code',
	        direction: 'DESC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/purchase/material.do?method=readHeavy&standard_flag=A',
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
				
					//this.getProxy().setExtraParam('class_code2', this.class_code);
					//this.getProxy().setExtraParam('area_code', this.area_code);
			}
		}
});