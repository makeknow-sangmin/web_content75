/**
 * Process Name Store
 */

Ext.define('Mplm.store.SortByStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });

    },
	fields : [ {
		name : 'systemCode',
		type : "string"
		}
	],
 	sorters: [{
        property: 'systemCode',
        direction: 'ASC'
    }],
	hasNull: false,
	proxy : {
		type : 'ajax',
		url : CONTEXT_PATH + '/code.do?method=getListParentCode',
		reader : {
			type : 'json',
			root : 'datas',
			totalProperty : 'count',
			successProperty : 'success'
		},
		autoLoad : false
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