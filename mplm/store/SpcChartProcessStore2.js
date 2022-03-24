Ext.define('Mplm.store.SpcChartProcessStore2', {
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
    data : 
    vCompanyReserved4 != 'KMCA01KR' ?
        [
            {"code":1, "name":"수입검사"},
            {"code":2, "name":"최종검사"},
            {"code":3, "name":"출하검사"}
        ]
        :
        [
            // {"code":1, "name":"수입검사"},
            // {"code":2, "name":"최종검사"},
            {"code":3, "name":"출하검사"}
        ]
});