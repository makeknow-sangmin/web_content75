/**
 * GeneralCodeDetailStore Store
 */

Ext.define('Mplm.store.GeneralCodeDetailStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });

    },
	fields:[{ 
		name: 'system_code',
		type: "string"
		}
	],
	sorters: [{
	        property: 'code_order',
	        direction: 'ASC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/admin/codeStructure.do?method=readAmc1',
	         reader: {
	         	type:'json',
	             root: 'datas',
	             totalProperty: 'count',
	             successProperty: 'success'
	         }
	         ,autoLoad: false
	     },
	 	listeners: {
			load: function(store, records, successful,operation, options) {
				
				if(this.hasNull) {
					
					var blank ={
						systemCode: ''
						};
						
						this.add(blank);
				}

			},
			beforeload: function(){
			}
	}
});