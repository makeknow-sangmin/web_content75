Ext.define('Mplm.store.LabelSizeStore', {
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
		}
	],
	hasNull: false,
	sorters: [{
        property: 'code_name_kr',
        direction: 'DESC'
    }],
    proxy: {
        type: 'ajax',
        url: CONTEXT_PATH + '/admin/codeStructure.do?method=readLabelSize&parent_system_code=PRINT_LABEL',
        reader: {
            type:'json',
            root: 'datas',
            totalProperty: 'count',
            successProperty: 'success'
        }
        ,autoLoad: false
    }
});