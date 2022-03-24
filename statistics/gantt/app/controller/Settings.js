Ext.Loader.setPath('MyApp', CONTEXT_PATH + '/statistics/gantt/app');
Ext.define("MyApp.controller.Settings", {
    extend : 'Ext.app.Controller',
    views  : ['Settings'],

    refs : [
        { ref : "gantt", selector : 'gantt' }
    ],

    init : function() {
        this.control({
            settings : {
                'row-height-change' : this.onRowHeightChange,
                'bg-color-change'   : this.onBgColorChange,
                'progress-color-change'   : this.onProgressbarColorChange,
                'dependency-color-change'   : this.onDependencyColorChange
            }
        })
    },

    onRowHeightChange : function(field, height) {
        var view = this.getGantt().getSchedulingView();

        Ext.util.CSS.updateRule('.sch-ganttpanel .x-grid-cell', 'height', height+'px');

        view.getDependencyView().setRowHeight(height, true);
        view.setRowHeight(height);
    },

    onBgColorChange : function(picker, color) {
        Ext.util.CSS.updateRule('.sch-gantt-task-bar', 'background', color);
        Ext.util.CSS.updateRule('.sch-gantt-milestone-diamond', 'border-left-color', color);
    },

    onProgressbarColorChange : function(picker, color) {
        Ext.util.CSS.updateRule('.sch-gantt-progress-bar', 'background-color', color);
    },

    onDependencyColorChange : function(picker, color) {
        Ext.util.CSS.updateRule('.sch-dependency-line', 'border-color', color);
        Ext.util.CSS.updateRule('.sch-dependency-arrow', 'border-color', color);
    }
});