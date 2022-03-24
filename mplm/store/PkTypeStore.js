
Ext.define('Mplm.store.PkTypeStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
		
		console_log('ProjectGroup.initComponent');
        // !! here may be some calculations and params alteration !!
		Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });
    },
    data : [
        {"pk_type":"10", "name":"GW"},
        {"pk_type":"11", "name":"LV"},
        {"pk_type":"13", "name":"PC"},
        {"pk_type":"14", "name":"SW"},
        {"pk_type":"15", "name":"AP"}
    ],
	fields:['pk_type']
});