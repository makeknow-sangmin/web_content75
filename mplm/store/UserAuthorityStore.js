/**
 * Process Name Store
 */

Ext.define('Mplm.store.UserAuthorityStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
//        	hasNull: params.hasNull,
//        	useYn: params.useYn
            // some else customization
        });

    },
	fields : [ {
		name : 'unique_id',
		type : "string"
		}, {
			name : 'role_code',
			type : "string"
		}, {
			name : 'role_name',
			type : "string"
		}

	],
//	hasNull: false,
	useYn: '',
	sorters: [{
        property: 'code_order',
        direction: 'ASC'
    }],
	proxy : {
		type : 'ajax',
        url: CONTEXT_PATH + '/admnMgmt/auth.do?method=authread',
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
						unique_id: '',
						role_code: '',
						role_name: ''
					};
					
					this.add(blank);
			}

		},
		beforeload: function(){
			
		}
}
});