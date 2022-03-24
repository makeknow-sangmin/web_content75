Ext.define('ExecDashboard.store.Schedule', {
    extend: 'Ext.data.Store',
    alias: 'store.schedule',

    model: 'ExecDashboard.model.Schedule',
    remoteFilter: true,

    proxy: {
        type: 'memory',
        reader: 'array',

        data: [
                
       					        ['P010']
					        	,['P020']
					        	,['P030']
					        	,['P040']
					        	,['P050']
        ]
    }
});
