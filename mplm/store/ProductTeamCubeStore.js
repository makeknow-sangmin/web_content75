/**
 * ProjectStore Store
 */
Ext.define('Mplm.store.ProductTeamCubeStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
		
		console_log('ProductTeamCubeStore.initComponent');
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });

    },
	fields:[     
	        { name: 'id', type: "int" },
	 	     { name: 'unique_id', type: "string" }
	 	     ,{ name: 'item_name', type: "string"  }
	 	     ,{ name: 'description', type: "string"  }
	 	     ,{ name: 'specification', type: "string"  }
//	 	    
		     
	 	  ],
	 	 hasNull: false,
	 	sorters: [{
	        property: 'unique_id',
	        direction: 'ASC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/sales/product.do?method=teamcubequery', /*1recoed, search by cond, search */

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
				if(this.hasNull) {
					var blank ={
							unique_id: '',
							pj_code: ' ',
							pj_name: ''
					};
					
					this.add(blank);
				}

			    },
			beforeload: function(){
				
			}
		}
});