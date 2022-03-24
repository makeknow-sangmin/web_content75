Ext.define('Rfx.store.EmployeeStore', {
	 extend: 'Ext.data.ArrayStore',
    constructor: function(config) {
    	console_logs('config', config);
    	Ext.applyIf(this, {
        	model: config.model
            // some else customization
        });

    }, 
    autoDestroy: true,
    model: Ext.ModelManager.getModel('Rfx.model.Employee'),
    proxy: {
        type: 'memory'
    },
    sorters: [{
        property: 'start',
        direction: 'DESC'
    }]
});
