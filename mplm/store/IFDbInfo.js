/**
 * DocuTpl Store
 */
Ext.define('Mplm.store.IFDbInfo', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {

    },
    fields: [     
     		{ name: 'unique_id', type: "string" }
             ,{ name: 'if_name', type: "string"  }
             ,{ name: 'direct', type: "string"  }
             ,{ name: 'cron_name', type: "string"  }
             ,{ name: 'select_type', type: "string"  }
             ,{ name: 'update_field', type: "string"  }
             ,{ name: 'creator', type: "string"  }
             ,{ name: 'create_date', type: "string"  }
             ,{ name: 'changer', type: "string"  }
             ,{ name: 'change_date', type: "string"  }
     		
     		],
 	sorters: [{
         property: 'create_date',
         direction: 'DESC'
     }],
     proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/database/if.do?method=dbIfInfoRead',
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