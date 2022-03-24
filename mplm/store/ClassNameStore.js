Ext.define('Mplm.store.ClassNameStore', {
	extend: 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        	class_name: params.class_name,
        });

    },
    fields: [     
     		{ name: 'class_name', type: "string" }
     		],
 	sorters: [{
         property: 'class_name',
         direction: 'ASC'
     }],
     proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/production/capa.do?method=selectClassName',
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
					this.getProxy().setExtraParam('class_name', this.class_name);
			},
			 load: function(store, records, successful,operation, options) {

			 }
		}//endoflistner
});