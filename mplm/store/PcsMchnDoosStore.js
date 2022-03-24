/**
 * Process Name Store
 */

Ext.define('Mplm.store.PcsMchnDoosStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });

    },
	fields : [ {
		name : 'mchn_code',
		type : "string"
		}, {
			name : 'name_ko',
			type : "string"
		}, {
			name : 'unique_id',
			type : "string"
		}, {
			name : 'mchn_uid',
			type : "string"
		}
	],
	hasNull: false,
	sorters: [{
        property: 'unique_id',
        direction: 'ASC'
    }],
	proxy : {
		type : 'ajax',
		url : CONTEXT_PATH + '/production/machine.do?method=read&mchn_type=EQ',
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
						systemCode: '',
						codeName: '',
						codeNameEn: ''
					};
					
					this.add(blank);
			}

		},
		beforeload: function(){
		}
}
});