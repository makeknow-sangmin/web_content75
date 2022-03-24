/**
 * InTypeStore Store
 */
Ext.define('Mplm.store.InTypeStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {

    },
    fields: [     
     		{ name: 'requestor', type: "string" }
     		,{ name: 'request_date', type: "sdate"  }
     		,{ name: 'price', type: "number"  }
     		,{ name: 'description', type: "string"  }
     		],
 	sorters: [{
         property: 'create_date',
         direction: 'DESC'
     }],
     proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/account/arap.do?method=readWithdrawList&type=I',
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