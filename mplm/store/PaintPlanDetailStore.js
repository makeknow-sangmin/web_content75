/**
 * Product Store
 */
Ext.define('Mplm.store.PaintPlanDetailStore', {
    extend: 'Ext.data.Store',
initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
		 Ext.apply(this, {
	        });

    },
	fields:[     
	 	      { name: 'unique_id', type: "string" }
	 	     ,{ name: 'buyer_pj_code', type: "string"  }
	 	     ,{ name: 'paint_spec', type: "string"  }
	 	    ,{ name: 'lot_no', type: "string"  }
	 	   ,{ name: 'h_reserved46', type: "string"  }
	 	  ,{ name: 'h_reserved90', type: "string"  }
	 	 ,{ name: 'h_reserved73', type: "string"  }
	 	,{ name: 'h_reserved97', type: "string"  }
	 	 ,{ name: 'reserved_varchar2', type: "string"  }
	 	,{ name: 'h_reserved60', type: "string"  }
	 	,{ name: 'item_quan', type: "string"  }
	 	,{ name: 'reserved_double4', type: "string"  }
	 	,{ name: 'reserved_timestamp5', type: "string"  }
	 	,{ name: 'h_reserved103', type: "string"  }
	 	,{ name: 'h_reserved102', type: "string"  }
	 	,{ name: 'h_reserved105', type: "string"  }
	 	,{ name: 'quan', type: "string"  }
	 	,{ name: 'mass', type: "string"  }
	 	,{ name: 'specification', type: "string"  }
	 	  ],
	 	sorters: [{
	        property: 'h_reserved105',
	        direction: 'ASC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/production/schdule.do?method=heavy4Workorder',
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