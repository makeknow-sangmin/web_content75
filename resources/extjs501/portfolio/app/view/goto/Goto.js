/**
 * This view is the primary, KPI (Key Performance Indicators) view.
 */
Ext.define('ExecDashboard.view.goto.Goto', {
    extend: 'Ext.panel.Panel',
    xtype: 'goto',

    cls: 'kpi-main',

    requires: [
        'Ext.chart.axis.Numeric',
        'Ext.chart.axis.Category',
        'Ext.chart.series.Area',
        'Ext.chart.series.Pie',
        'Ext.chart.interactions.PanZoom',
        'Ext.chart.interactions.Rotate'
    ],

    config: {
        activeState: null,
        defaultActiveState: 'clicks'
    },

    controller: 'goto',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    overflowY: 'auto',
    minWidth: 600,
    initView: function() {
    	
    },

    items: [ ],//endofpanelitems:vbox

    validStates: {
        clicks: 1,
        redemption: 1,
        sales: 1,
        goalsmet: 1
    },

    isValidState: function (state) {
        return state in this.validStates;
    }
});
