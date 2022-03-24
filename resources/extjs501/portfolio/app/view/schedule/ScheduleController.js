Ext.define('ExecDashboard.view.schedule.ScheduleController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.schedule',

    init: function (view) {
        // We provide the updater for the activeState config of our View.
        view.updateActiveState = this.updateActiveState.bind(this);
        view.initView();

    },

    onToggleSchedule: function(button) {
        if (button.pressed) {
            var view = this.getView();
            view.setActiveState(button.filter);
        }
    },

    updateActiveState: function (activeState) {
        var refs = this.getReferences();
        var viewModel = this.getViewModel();

        //refs[activeState].setPressed(true);
        viewModel.set('scheduleCategory', activeState);

        this.fireEvent('changeroute', this, 'schedule/' + activeState);
    }
});
