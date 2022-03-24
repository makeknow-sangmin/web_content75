/**
 * Product Store
 */
Ext.define('Mplm.store.BomExcelLogStore', {
    extend: 'Ext.data.Store',
initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
		 Ext.apply(this, {
			 class_code: params.class_code,
			 cmpName: params.cmpName
	        });

    },
	fields:[     
	 	      { name: 'unique_id', type: "string" }
			  ,{ name: 'fileName', type: "string"  }
			  ,{ name: 'item_code', type: "string"  }
			  ,{ name: 'object_name', type: "string"  }
	 	     ,{ name: 'create_date', type: "string"  }
	 	  ],
	 	sorters: [{
	        property: 'create_date',
	        direction: 'DESC'
	    }],
	    queryMode: 'remote',
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/design/bom.do?method=getBOMExcelLogs&change_reason=EXCEL_LOG',
	         //url: CONTEXT_PATH + '/sales/poreceipt.do?method=getBomProduct',
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
