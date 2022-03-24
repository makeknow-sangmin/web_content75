Ext.define('Mplm.store.SubclassStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        	sg_code: params.sg_code,
        });

    },
    fields: [     
     		{ name: 'sg_code', type: "string" }
     		],
 	sorters: [{
         property: 'sg_code',
         direction: 'ASC'
     }],
     proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/production/capa.do?method=selectSubClass',
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
				//this.getProxy().setExtraParam('pcs_code', this.pcs_code);

					this.getProxy().setExtraParam('sg_code', this.sg_code);
			},
			 load: function(store, records, successful,operation, options) {

			 }
		}//endoflistner
});