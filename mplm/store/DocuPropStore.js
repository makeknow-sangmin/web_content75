/**
 * DocuTpl Store
 */
Ext.define('Mplm.store.DocuPropStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {

    },
    fields: [     
     		{ name: 'unique_id', type: "string" }
     		,{ name: 'system_code', type: "string"  }
     		,{ name: 'code_name', type: "string"  }
     		,{ name: 'code_order', type: "string"  }
            ,{ name: 'code_length', type: "string"  }
            ,{ name: 'code_heigth', type: "string"  }
			,{ name: 'code_type', type: "string"  }
			,{ name: 'creator', type: "string"  }
			,{ name: 'create_date', type: "string"  }
			,{ name: 'changer', type: "string"  }
            ,{ name: 'change_date', type: "string"  }
            ,{ name: 'docuTpl_uid', type: "string"  }
            ,{ name: 'standard_flag', type: "string"  }
     		],
 	sorters: [{
         property: 'unique_id',
         direction: 'ASC'
     }],
     proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/document/manage.do?method=docuPropRead',
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