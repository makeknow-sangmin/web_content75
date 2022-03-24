/**
 * ProjectStore Store
 */
Ext.define('Mplm.store.complishedProjectStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
		
		console_log('complishedProjectStore.initComponent');
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
	 	     ,{ name: 'total_cost', type: "string"  }
	 	     ,{ name: 'reserved_double5', type: "string"  }
	 	     //등록서
	 	     ,{ name: 'newmodcont', type: "string"  }
	 	     ,{ name: 'previouscont', type: "string"  }
	 	     ,{ name: 'selfdevelopment', type: "string"  }
	 	     ,{ name: 'wa_name', type: "string"  }
	 	     ,{ name: 'regist_date', type: "string"  }
	 	     ,{ name: 'selling_price', type: "string"  }
	 	     ,{ name: 'delivery_plan', type: "string"  }
	 	     ,{ name: 'reserved_timestamp1', type: "string"  }
	 	     ,{ name: 'end_plan', type: "string"  }
	 	     ,{ name: 'reserved_timestamp4', type: "string"  }
	 	     ,{ name: 'reserved_timestamp5', type: "string"  }
	 	     ,{ name: 'delivery_plan', type: "string"  }
	 	     ,{ name: 'reserved_timestamp7', type: "string"  }
	 	     ,{ name: 'reserved_timestamp8', type: "string"  }
	 	     ,{ name: 'reserved_double7', type: "string"  }
	 	     ,{ name: 'reserved_double8', type: "string"  }
	 	     ,{ name: 'reserved_double1', type: "string"  }
	 	     ,{ name: 'human_plan', type: "string"  }
	 	     ,{ name: 'reserved_double9', type: "string"  }
	 	     ,{ name: 'purchase_plan', type: "string"  }
	 	     ,{ name: 'reserved_doublec', type: "string"  }
	 	     ,{ name: 'reserved_doubled', type: "string"  }
	 	     ,{ name: 'total_cost_add', type: "string"  }
	 	     
	 	     //완료
	 	    ,{ name: 'total_cost_end', type: "string"  }
	 	    ,{ name: 'reserved_doublee', type: "string"  }
	 	    ,{ name: 'reserved_doubleb', type: "string"  }
	 	    ,{ name: 'reserved_doublea', type: "string"  }
	 	    ,{ name: 'purchase_cost', type: "string"  }
	 	    ,{ name: 'reserved_doublef', type: "string"  }
	 	    ,{ name: 'reserved_timestampa', type: "string"  }
	 	    ,{ name: 'reserved_timestamp9', type: "string"  }
	 	    ,{ name: 'delivery_date', type: "string"  }
	 	    ,{ name: 'reserved_timestamp3', type: "string"  }
	 	    ,{ name: 'reserved_timestamp6', type: "string"  }
	 	    ,{ name: 'reserved_timestampb', type: "string"  }
	 	    ,{ name: 'reserved_timestamp2', type: "string"  }
	 	  ],
	 	 hasNull: false,
	 	sorters: [{
	        property: 'pj_name',
	        direction: 'ASC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/sales/poreceipt.do?method=cloudbomquery&is_complished=Y', /*1recoed, search by cond, search */
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