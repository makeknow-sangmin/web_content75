/**
 * MaterialStore
 */
Ext.define('Mplm.store.RtgAstApStore', {
    extend: 'Ext.data.Store',
initComponent: function(params) {

    },
	fields:[     
	 	      { name: 'content', type: "string" }
	 	     ,{ name: 'name', type: "string"  }
	 	     ,{ name: 'po_no', type: "string"  }
			 ,{ name: 'reserved_varchar2', type: "string"  }
			 ,{ name: 'rtg_type', type: "string"  }
			 ,{ name: 'total_price', type: "number"  }
			 ,{ name: 'unique_id_long', type: "number"  }
			 ,{ name: 'state', type: "string"  }
			 ,{ name: 'division_name', type: "string"  }
	 	  ],
	 	sorters: [{
	        property: 'regist_date',
	        direction: 'ASC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/purchase/prch.do?method=readrtgast&rtg_type=AP',
	         reader: {
	         	type:'json',
	             root: 'datas',
	             totalProperty: 'count',
	             successProperty: 'success'
	         }
	         ,autoLoad: false
	     },
		listeners: {
			beforeload: function(){
				//this.getProxy().setExtraParam('order_com_unique', this.order_com_unique);

			}
		}
});