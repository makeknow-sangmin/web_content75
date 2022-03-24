Ext.define('Mplm.store.SalSystemLocalStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });

    },
    fields : [ 'h_reserved102', 'h_reserved103'
    ],
	hasNull: false,
	sorters: [{
        property: 'codeOrder',
        direction: 'ASC'
    }],
    data : [
        {"sal_system_kr":"월급제"},
        {"sal_system_kr":"일당제"},
        {"sal_system_kr":"일용직"}
    ]
});