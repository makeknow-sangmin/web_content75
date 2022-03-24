Ext.define('ExecDashboard.view.goto.GotoController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.goto',

    init: function (view) {
    },

    onToggleGoto: function(button) {
    	console_log(button);
        if (button.pressed) {
            var view = this.getView();
            view.setActiveState(button.filter);
        }
    },

    updateActiveState: function (activeState) {
    	console_log(activeState);

    }
});
