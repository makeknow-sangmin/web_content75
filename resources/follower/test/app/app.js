Ext.Loader.setConfig({
    disableCaching : true,
	enabled:true,
    paths:{
         DEMO:'app'
	}
});

Ext.application({
    name: 'DEMO',
    appFolder: 'app',
    controllers: [
		'Gantt'
    ],
    autoCreateViewport	: false,

    launch: function() {
        Ext.create('Ext.container.Viewport', {
            layout  : 'border',
            items   : [
			    {   xtype     : 'Gantt', 
			    	startDate : new Date(2014, 8),
			        endDate   : Sch.util.Date.add(new Date(2014, 8), Sch.util.Date.MONTH, 5)
			    }
            ]
        });
    }
});