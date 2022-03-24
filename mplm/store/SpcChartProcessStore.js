Ext.define('Mplm.store.SpcChartProcessStore', {
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
        {"code":1, "name":"용해"},
        {"code":2, "name":"도금"},
        {"code":3, "name":"단독"},
        {"code":4, "name":"신선"},
        {"code":5, "name":"열처리"},
        {"code":6, "name":"권선"},
        {"code":7, "name":"Bare"},
        {"code":8, "name":"합금"},
        {"code":9, "name":"제조"},
        {"code":10, "name":"코팅"},
        {"code":11, "name":"선별(Sorting)"},
        {"code":12, "name":"선별(Upper)"},
        {"code":13, "name":"선별(Lower)"},
        {"code":14, "name":"검사"}
    ]
});