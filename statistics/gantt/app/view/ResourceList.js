Ext.Loader.setPath('MyApp', CONTEXT_PATH + '/statistics/gantt/app');
Ext.define("MyApp.view.ResourceList", {
    extend                  : 'Ext.grid.Panel',
    alias                   : 'widget.resourcelist',
    title                   : '자원',
    flex                    : 1,
    hidden                  : true,
    bodyCls                 : 'resourcelist',
    columnLines             : true,

    initComponent : function() {
        Ext.apply(this, {
//            features : [{
//                groupHeaderTpl: '{name}',
//                ftype : 'grouping'
//            }],
            plugins     : [
                new Ext.grid.plugin.CellEditing({ })
            ],
            columns     : [
                { text : 'UID',    width:80, dataIndex : 'Id' },
                { text : '유형',  width:60, tdCls : 'resource-type', dataIndex : 'Type', renderer : function(v, m) { m.tdCls = 'icon-' + v; } },
                { text : '달력',  width:80, dataIndex : 'CalendarId' },
                { text : '이름',  flex:1, dataIndex : 'Name' /*, editor : { xtype : 'textfield' }*/ }
            ]
        });

        this.callParent(arguments);
    }
});