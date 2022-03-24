/**
 * IsComplished Store
 */

Ext.define('Mplm.store.SearchDatetypeStore', {
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
        property: 'systemCode',
        direction: 'ASC'
    }],
	proxy : {
		type : 'ajax',
        url: CONTEXT_PATH + '/code.do?method=read&parentCode=SEARCH_DATETYPE',
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
			
			console_logs('this.hasNull', this.hasNull);
			
			if(this.hasNull) {
				
				var blank ={
						systemCode: '',
						codeName: '-미지정-',
						codeNameEn: '-not defined-'
					};
					
					this.add(blank);
					console_logs('state', 'added');
			}

		},
		beforeload: function(){
		}
}
});