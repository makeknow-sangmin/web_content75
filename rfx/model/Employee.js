Ext.define('Rfx.model.Employee', {
	extend: 'Ext.data.Model',
    alias: 'rfxEmployee',
    fields: [
             'name',
             'email',
             { name: 'start', type: 'date', dateFormat: 'n/j/Y' },
             { name: 'salary', type: 'float' },
             { name: 'active', type: 'bool' }
         ]
});