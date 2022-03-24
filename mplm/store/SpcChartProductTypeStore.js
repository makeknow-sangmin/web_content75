Ext.define('Mplm.store.SpcChartProductTypeStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });

    },
	fields : [ 'code', 'name'
	],
	hasNull: false,
	sorters: [{
        property: 'codeOrder',
        direction: 'ASC'
    }],
    data : [
        {"code":1, "name":"GW"},
        {"code":2, "name":"SW"},
        {"code":3, "name":"CW"},
        {"code":4, "name":"GW/SW"},
        {"code":5, "name":"SB"}
    ]
});