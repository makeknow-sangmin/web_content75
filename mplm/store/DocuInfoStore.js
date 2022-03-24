/**
 * DocuTpl Store
 */
Ext.define('Mplm.store.DocuInfoStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {

    },
    fields: [     
     		{ name: 'unique_id', type: "string" }
     		,{ name: 'fid', type: "string"  }
     		,{ name: 'parent', type: "string"  }
     		,{ name: 'rpinfo_uid', type: "string"  }
			,{ name: 'rpinfo_fid', type: "string"  }
			,{ name: 'rpinfo_parent', type: "string"  }
			,{ name: 'rpinfo_create_date', type: "string"  }
			,{ name: 'rpinfo_creator', type: "string"  }
			,{ name: 'rpinfo_changer', type: "string"  }
            ,{ name: 'rpinfo_change_date', type: "string"  }
            ,{ name: 'paper_type', type: "string"  }
            ,{ name: 'token_uid', type: "string"  }
            ,{ name: 'create_date', type: "string"  }
            ,{ name: 'change_date', type: "string"  }
            ,{ name: 'major', type: "string"  }
            ,{ name: 'minor', type: "string"  }
            ,{ name: 'fname', type: "string"  }
     		],
 	sorters: [{
         property: 'create_date',
         direction: 'DESC'
     }],
     proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/document/manage.do?method=rpFileInfoRead',
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