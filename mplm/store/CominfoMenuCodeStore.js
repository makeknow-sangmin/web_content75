/**
 * MenuCodeStore
 */
Ext.define('Mplm.store.CominfoMenuCodeStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });

    },
	fields:[{ 
		name: 'menu_code',
		type: "string"
		}
	],
	sorters: [{
	        property: 'menu_code',
	        direction: 'ASC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/DynaHanaro/view/criterionInfo/ComInfoView.do?method=readMenucode',
	         reader: {
	         	type:'json',
	             root: 'datas',
	             totalProperty: 'count',
	             successProperty: 'success'
	         }
	         ,autoLoad: false
	     },
	 	listeners: {
			load: function(menu_code) {
				value: 'menu_code'
				//console_logs("111111111111111111111111111111111111111111111");

			},
			beforeload: function(){
				
			}
	}
});