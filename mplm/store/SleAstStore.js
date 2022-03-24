
Ext.define('Mplm.store.SleAstStore', {
    extend: 'Ext.data.Store',

	initComponent: function(params) {
		
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	cmpName: params.cmpName
            // some else customization
        });

    },
	fields:[     
	 	     { name: 'unique_id', type: "string" }
	 	     ,{ name: 'id', type: "int" }
	 	     ,{ name: 'unique_id_long', type: "int" }
	 	     ,{ name: 'sub_cur_estimated_price', type: "string"  }
	 	     ,{ name: 'sub_estimated_price', type: "string"  }
			 ,{ name: 'sub_month', type: "string"  }
			 ,{ name: 'sub_percent', type: "string"  }
			 ,{ name: 'sub_po_price', type: "string"  }
			 ,{ name: 'sub_wa_name', type: "string"  }
	 	  ],
	 	defaultVal: '-1',
	 	defaultDisp: '',
	 	queryMode: 'remote',
	 	 hasNull: false,
	 	sorters: [{
	        property: 'sl_code',
	        direction: 'ASC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/production/schdule.do?method=getDetailSleAst&order_com_unique=79070000033',
	         reader: {
	         	type:'json',
	             root: 'datas',
	             totalProperty: 'count',
	             successProperty: 'success'
	         }
	         ,autoLoad: true
	     }
});