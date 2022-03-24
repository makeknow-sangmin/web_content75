/**
 * Product Store
 */
Ext.define('Mplm.store.PurcahseRequestStore', {
    extend: 'Ext.data.Store',
initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
		 Ext.apply(this, {
	        });

    },
	fields:[     
	 	      { name: 'unique_id', type: "string" }
	 	     ,{ name: 'name', type: "string"  }
	 	     ,{ name: 'content', type: "string"  }
	 	    ,{ name: 'item_quan', type: "string"  }
	 	   ,{ name: 'buyer_name', type: "string"  }
	 	 ,{ name: 'po_no', type: "string"  }
	 	  ],
	 	sorters: [{
	        property: 'create_date',
	        direction: 'ASC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/purchase/prch.do?method=readrtgast&rtg_type=PR&state=ALL',
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
			}
		}
});