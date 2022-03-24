Ext.define('Mplm.store.PrdTypeStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        	hasNull: params.hasNull
        });
    },
	fields:[     
	        // { name: 'id', type: "int" },
	 	    //  { name: 'unique_id', type: "string" }
	 	    //  ,{ name: 'pj_code', type: "string"  }
	 	    //  ,{ name: 'pj_name', type: "string"  }
	 	    //  ,{ name: 'uid_srcahd', type: "string"  }
	 	    //  ,{ name: 'order_com_unique', type: "string"  }
	 	    //  ,{ name: 'description', type: "string"  }
		 	//  ,{ name: 'cav_no', type: "string"  }
			//  ,{ name: 'regist_date', type: "string"  }
		    //  ,{ name: 'delivery_plan', type: "string"  }
		    //  ,{ name: 'pj_type', type: "string"  }
		    //  ,{ name: 'model_name', type: "string"  }
		    //  ,{ name: 'pm_id', type: "string"  }
		    //  ,{ name: 'is_complished', type: "string"  }
		    //  ,{ name: 'selling_price', type: "string"  }
		    //  ,{ name: 'reserved_double5', type: "string"  }
		     
	 	  ],
	 	 hasNull: false,
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/production/schdule.do?method=getPrdFormType',
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