/**
 * Process Name Store
 */

Ext.define('Mplm.store.ProcessNameStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
//        	system_code: params.system_code
        });

    },
	fields : [ {
		name : 'system_code',
		type : "string"
		}, {
			name : 'codeName',
			type : "string"
		}, {
			name : 'codeNameEn',
			type : "string"
		}

	],
	hasNull: false,
	sorters: [{
        property: 'code_order',
        direction: 'ASC'
    }],
	proxy : {
		type : 'ajax',
		url : CONTEXT_PATH + '/production/pcsstd.do?method=pcsStdName',
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
						systemCode: '-1',
						codeName: '-없음-',
						codeNameEn: ''
					};
					
					this.add(blank);
			}

		},
		beforeload: function(){
//			this.getProxy().setExtraParam('system_code', this.system_code);
		}
}
});