/**
 * DocuTpl Store
 */
Ext.define('Mplm.store.DBColSetStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {

    },
    fields: [     
     		{ name: 'unique_id', type: "string" }
             ,{ name: 'column_name', type: "string"  }
             ,{ name: 'column_comment', type: "string"  }
             ,{ name: 'ordinal_position', type: "string"  }
             ,{ name: 'column_default', type: "string"  }
             ,{ name: 'is_nullvalue', type: "string"  }
             ,{ name: 'data_type', type: "string"  }
             ,{ name: 'character_maximum_length', type: "string"  }     		
     		],
 	sorters: [{
         property: 'create_date',
         direction: 'DESC'
     }],
     proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/database/if.do?method=dBColSetStore',
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
		}//endoflistner
});