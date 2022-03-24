/**
 *Print Label Store
 */

Ext.define('Mplm.store.PrintLabelStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });

    },
	fields : [ {
		name : 'system_code',
		type : "string"
		}, {
			name : 'code_name_kr',
			type : "string"
		}, {
			name : 'description',
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
		url : CONTEXT_PATH + '/code.do?method=read&parentCode=PRINT_LABEL',
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