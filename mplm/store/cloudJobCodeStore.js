/**
 * ProjectStore Store
 */
Ext.define('Mplm.store.cloudJobCodeStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
		
		console_log('cloudJobCodeStore.initComponent');
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });

    },
	fields:[     
	        { name: 'id', type: "int" },
	 	     { name: 'unique_id', type: "string" }
	 	     ,{ name: 'job_code', type: "string"  }
	 	     ,{ name: 'job_name', type: "string"  }
	 	     ,{ name: 'job_level', type: "string"  }
//	 	     ,{ name: 'order_com_unique', type: "string"  }
	 	     ,{ name: 'description', type: "string"  }
		     
	 	  ],
	 	 hasNull: false,
	 	sorters: [{
	        property: 'job_code',
	        direction: 'ASC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/userMgmt/jobcode.do?method=cloudjobquery&job_type=X', /*1recoed, search by cond, search */
//	         params:{
//	        	 jobcode : 'X%'
//	         },
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