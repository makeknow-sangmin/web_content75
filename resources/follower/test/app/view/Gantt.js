Ext.define("DEMO.view.Gantt", {
    extend : "Gnt.panel.Gantt",
    requires : [
        'Gnt.plugin.TaskContextMenu',
        'Gnt.column.StartDate',
        'Gnt.column.EndDate',
        'Gnt.column.Duration',
        'Gnt.column.PercentDone',
        'Sch.plugin.TreeCellEditing',
        'Sch.plugin.Pan'
    ],
    alias : 'widget.Gantt',
    title: 'Java Gantt',
    region : 'center',
    viewPreset: 'weekAndDayLetter',
    taskStore : 'Tasks',

    initComponent : function() {
        var me = this;
        
        Ext.apply(me, {   
            columns: [
                {
                    xtype : 'namecolumn',
                    width : 200
                }
            ],
            plugins: [
                Ext.create("Sch.plugin.Pan"),
                Ext.create("Gnt.plugin.TaskContextMenu"),
                Ext.create('Sch.plugin.TreeCellEditing', { clicksToEdit: 2 })        
            ]
        });

        this.callParent(arguments);
    }
});