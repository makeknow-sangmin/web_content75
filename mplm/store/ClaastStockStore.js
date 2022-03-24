/**
 * Claast Store
 */
//console_log('loading Mplm.store.SupastStore....');
Ext.define('Mplm.store.ClaastStockStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
        

    },
    fields: [     
     		{ name: 'level1', type: "string" }
     		,{ name: 'identification_code', type: "string"  }
     		,{ name: 'parent_class_code', type: "string"  }
     		,{ name: 'class_name', type: "string"  }
     		,{ name: 'class_code', type: "string"  }
     		,{ name: 'class_type', type: "string"  }
     		],
 	sorters: [{
         property: 'level1',
         direction: 'ASC'
     }],
     proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/b2b/cadnpart.do?method=getclaast',
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
            if(records == null) {
                this.removeAt(0);
			}
            this.add({
                label: '<span>전체</span>',
                value: '',
                order: -3
            });
            
		},
		}//endoflistner
});