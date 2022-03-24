/**
 * MenuCodeStore
 */
Ext.define('Mplm.store.MenuCodeStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });

    },
	fields:[{ 
		name: 'child',
		type: "string"
		}
	],
	sorters: [{
	        property: 'display_name_ko',
	        direction: 'ASC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/admnMgmt/auth.do?method=read&limit=1000&menu_type=O',
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