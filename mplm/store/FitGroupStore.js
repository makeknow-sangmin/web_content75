/**
 * FitGroup Store
 */

Ext.define('Mplm.store.FitGroupStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });

    },
	fields : [ {
		name : 'user_id',
		type : "string"
		}
	],
	hasNull: false,
	sorters: [{
        property: 'user_id',
        direction: 'ASC'
    }],
	proxy : {
		type : 'ajax',
        url: CONTEXT_PATH + '/userMgmt/user.do?method=getFitGroup',
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
			
			console_log(records);
			
			if(this.hasNull) {
				
				var blank ={
		
					};
					
					this.add(blank);
			}

		},
		beforeload: function(){
		}
}
});