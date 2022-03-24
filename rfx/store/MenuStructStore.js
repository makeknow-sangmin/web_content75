/**
 * GeneralCodeStore Store
 */

Ext.define('Rfx.store.MenuStructStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {

    },
    fields: [
      	    { name: 'menu_key', 	type: "string"    }           
             ,{ name: 'service_name', 		type: "string"    }
             ,{ name: 'menu_type', type: "string"    }
             ,{ name: 'displayName', type: "string"    }
			 ,{ name: 'linkPath', 	type: "string"    }
			 ,{ name: 'flag1', type: "string"  }
			 ,{ name: 'flag2', type: "string"  }
			 ,{ name: 'flag3', type: "string"  }
			 ,{ name: 'flag4', type: "string"  }
			 ,{ name: 'flag5', type: "string"  }
     ],

	proxy : {
		type : 'ajax',
        url: CONTEXT_PATH + '/admin/menu.do?method=readStruct',
		reader : {
			type : 'json',
			root : 'datas',
			totalProperty : 'count',
			successProperty : 'success'
		},
		autoLoad : false
	},
	listeners: {
		load: function(store, records, successful,operation, options) {
		

		},
		beforeload: function(){

		}
}
});