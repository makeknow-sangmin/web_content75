Ext.Loader.setPath('MyApp', CONTEXT_PATH + '/statistics/gantt/app');
Ext.define("MyApp.model.Resource", {
    extend              : 'Gnt.model.Resource',

    fields : [
        { name : 'Type', defaultValue: 'Person' }
    ]
});
