Ext.define('DEMO.controller.Gantt', {
    extend	: 'Ext.app.Controller',

    models	: [
        'Task'
    ],

    stores		: [
		'Tasks'
    ],

    views		: [
		'Gantt'
    ]
});