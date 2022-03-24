/**
 * ProjectStore Store
 */
var approve = '';
if(vCUR_MENU_CODE == 'DBM8'){
	approve = 'N';
}
Ext.define('Mplm.store.ProjectStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
		
		console_log('ProjectStore.initComponent');
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });

    },
	fields:[     
	        { name: 'id', type: "int" },
	 	     { name: 'unique_id', type: "string" }
	 	     ,{ name: 'pj_code', type: "string"  }
	 	     ,{ name: 'pj_name', type: "string"  }
	 	     ,{ name: 'uid_srcahd', type: "string"  }
	 	     ,{ name: 'order_com_unique', type: "string"  }
	 	     ,{ name: 'description', type: "string"  }
		 	 ,{ name: 'cav_no', type: "string"  }
			 ,{ name: 'regist_date', type: "string"  }
		     ,{ name: 'delivery_plan', type: "string"  }
		     ,{ name: 'pj_type', type: "string"  }
		     ,{ name: 'model_name', type: "string"  }
		     ,{ name: 'pm_id', type: "string"  }
		     ,{ name: 'is_complished', type: "string"  }
		     ,{ name: 'selling_price', type: "string"  }
		     ,{ name: 'reserved_double5', type: "string"  }
		     
	 	  ],
	 	 hasNull: false,
	 	sorters: [{
	        property: 'pj_code',
	        direction: 'ASC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/sales/poreceipt.do?method=bomquery&approve='+approve, /*1recoed, search by cond, search */
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
							unique_id: '-1',
							pj_code: '*',
							pj_name: ''
					};
					
					this.add(blank);
				}

			    },
			beforeload: function(){
				
			}
		}
});