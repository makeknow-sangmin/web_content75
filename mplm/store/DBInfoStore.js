/**
 * DocuTpl Store
 */
Ext.define('Mplm.store.DBInfoStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {

    },
    fields: [     
     		{ name: 'unique_id', type: "string" }
             ,{ name: 'server_name', type: "string"  }
             ,{ name: 'url', type: "string"  }
             ,{ name: 'port', type: "string"  }
             ,{ name: 'db_name', type: "string"  }
             ,{ name: 'db_type', type: "string"  }
             ,{ name: 'direct', type: "string"  }
     		],

     proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/database/if.do?method=distinctDBInfo',
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