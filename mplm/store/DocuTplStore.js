/**
 * DocuTpl Store
 */
Ext.define('Mplm.store.DocuTplStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {

    },
    fields: [     
     		{ name: 'unique_id', type: "string" }
     		,{ name: 'group_uid', type: "string"  }
     		,{ name: 'temp_name', type: "string"  }
     		,{ name: 'docu_auth', type: "string"  }
			,{ name: 'docu_type', type: "string"  }
			,{ name: 'delete_flag', type: "string"  }
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
         url: CONTEXT_PATH + '/document/manage.do?method=docuTplRead',
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