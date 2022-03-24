Ext.define('Mplm.store.SpcChartTypeStore2', {
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
        {"code":1, "name":"OK/NG"},
        {"code":2, "name":"수치측정"}
    ]
});