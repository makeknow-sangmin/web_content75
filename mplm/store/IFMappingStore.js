/**
 * DocuTpl Store
 */
Ext.define('Mplm.store.IFMappingStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {

    },
    fields: [     
     		{ name: 'unique_id', type: "string" }
             ,{ name: 'dbif_uid', type: "string"  }
             ,{ name: 'to_uid', type: "string"  }
             ,{ name: 'from_uid', type: "string"  }
             ,{ name: 'is_fromkey', type: "string"  }
             ,{ name: 'to_columnName', type: "string"  }
             ,{ name: 'to_table', type: "string"  }
             ,{ name: 'to_dbName', type: "string"  }
             ,{ name: 'to_comment', type: "string"  }
             ,{ name: 'from_columnName', type: "string"  }
             ,{ name: 'from_table', type: "string"  }
             ,{ name: 'from_dbName', type: "string"  }     		
             ,{ name: 'from_comment', type: "string"  }
     		],
 	sorters: [{
         property: 'create_date',
         direction: 'DESC'
     }],
     proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/database/if.do?method=dbMappingRead',
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