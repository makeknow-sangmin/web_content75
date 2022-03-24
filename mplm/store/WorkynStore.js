Ext.define('Mplm.store.WorkynStore', {
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
        {"work_yn":"재직"},
        {"work_yn":"퇴사"}
    ]
});