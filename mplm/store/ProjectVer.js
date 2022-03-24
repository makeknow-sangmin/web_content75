/**
 * ProjectVer Store
 */
Ext.define('Mplm.store.ProjectVer', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
		
		console_log('ProjectVer.initComponent');
        // !! here may be some calculations and params alteration !!
		Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });
    },
	fields:[     
	        { name: 'id', type: "int" }
	 	     ,{ name: 'unique_id', type: "string" }
	 	     ,{ name: 'pj_code', type: "string"  }
	 	     ,{ name: 'pj_name', type: "string"  }
	 	     ,{ name: 'ac_uid', type: "string"  }
	 	     ,{ name: 'order_com_unique', type: "string"  }
	 	     ,{ name: 'description', type: "string"  }
		 	 ,{ name: 'cav_no', type: "string"  }
			 ,{ name: 'regist_date', type: "string"  }
		     ,{ name: 'delivery_plan', type: "string"  }
		     ,{ name: 'pj_type', type: "string"  }
		     ,{ name: 'model_name', type: "string"  }
		     ,{ name: 'pm_id', type: "string"  }
		     ,{ name: 'uid_srcahd', type: "string"  }
		     
	 	  ],
	 	sorters: [{
	        property: 'unique_id',
	        direction: 'DESC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/sales/poreceipt.do?method=pjgroup', /*1recoed, search by cond, search */
	         reader: {
	         	type:'json',
	             root: 'datas',
	             totalProperty: 'count',
	             successProperty: 'success'
	         }
	         ,autoLoad: true
	     }
});