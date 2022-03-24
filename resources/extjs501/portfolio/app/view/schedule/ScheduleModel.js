Ext.define('ExecDashboard.view.schedule.ScheduleModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.schedule',

    requires: [
        'ExecDashboard.model.Schedule',
        'ExecDashboard.store.Schedule'
    ],

    data: {
        // This property is placed in the ViewModel by routing
        // scheduleCategory: null
    },

    stores: {
        scheduleMain: {
            type: 'schedule',
            autoLoad: true,
            filters: {
                property: 'category',
                value: '{scheduleCategory}'
            }
        }
    }
});
