Ext.define('Mplm.store.WorkDivisionStore', {
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
        {"work_division":"사무직"},
        {"work_division":"생산직"},
        {"work_division":"외국인"}
    ]
});