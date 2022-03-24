/**
 * Buyer Store
 */

Ext.define('Mplm.store.NonStandardDetailStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	// group_code: params.group_code
        });

    },
	fields:[     
	    //     { name: 'id', type: "int" }
	    //     ,{ name: 'unique_id', type: "string" }
	 	//      ,{ name: 'group_code', type: "string"  }
	 	//      ,{ name: 'file_path', type: "string"  }
	 	//     ,{ name: 'file_size', type: "string"  }
	 	//     ,{ name: 'fileobject_uid', type: "string"  }
	 	//    ,{ name: 'object_name', type: "string"  }
		//    ,{ name: 'file_ext', type: "string"  }
	 	  ],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/production/schdule.do?method=getNonStandardDetail',
	         reader: {
	         	type:'json',
	             root: 'datas',
	             totalProperty: 'count',
	             successProperty: 'success'
	         }
	         ,autoLoad: true
	     },
		 listeners: {
			
			load: function(store, records, successful,operation, options) {

			},
			beforeload: function(){

			}
		}
});