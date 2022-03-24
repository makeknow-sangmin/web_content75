
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.form.field.Number',
    'Ext.form.field.Date',
    'Ext.tip.QuickTipManager'
//    ,
//    'Ext.ux.DataTip'
]);

Ext.define('Task', {
    extend: 'Ext.data.Model',
    idProperty: 'taskId',
    fields: [
        {name: 'projectId', type: 'int'},
        {name: 'project', type: 'string'},
        {name: 'taskId', type: 'int'},
        {name: 'description', type: 'string'},
        {name: 'estimate', type: 'm/d/Y'},
        {name: 'rate', type: 'float'},
        {name: 'cost', type: 'float'},
        {name: 'due', type: 'date', dateFormat:'m/d/Y'}
    ]
});

var data = [
            {projectId: 100, project: '1. Design', taskId: 100, description: 'Mold Concept Design', estimate: '06/25/2007', rate: 150, cost: 160,  cost: 160, due:'06/24/2007'},
            {projectId: 100, project: '1. Design', taskId: 101, description: 'Mold Detail Design(CAD)', estimate: '06/25/2007', rate: 150,  cost: 160, due:'06/25/2007'},
            {projectId: 100, project: '1. Design', taskId: 102, description: 'Process Design', estimate: '06/25/2007', rate: 150,  cost: 160, due:'06/27/2007'},
            {projectId: 101, project: '2. Purchase', taskId: 103, description: 'Mold Base & Main Insert', estimate: '06/25/2007', rate: 100,  cost: 160, due:'07/01/2007'},
            {projectId: 101, project: '2. Purchase', taskId: 104, description: 'General Component & Parts', estimate: '06/25/2007', rate: 100,  cost: 160, due:'07/03/2007'},
            {projectId: 101, project: '2. Purchase', taskId: 105, description: 'Processing OutSourcing', estimate: '06/25/2007', rate: 100,  cost: 160, due:'07/04/2007'},
            {projectId: 102, project: '3. Processing', taskId: 106, description: 'Mold Base', estimate: '06/25/2007', rate: 125,  cost: 160, due:'07/01/2007'},
            {projectId: 102, project: '3. Processing', taskId: 107, description: 'Heat Treatment', estimate: '06/25/2007', rate: 125,  cost: 160, due:'07/02/2007'},
            {projectId: 102, project: '3. Processing', taskId: 108, description: 'CNC Programming', estimate: '06/25/2007', rate: 125,  cost: 160, due:'07/05/2007'},
            {projectId: 102, project: '3. Processing', taskId: 109, description: 'CNC', estimate: '06/25/2007', rate: 125,  cost: 160, due:'07/05/2007'},
            {projectId: 102, project: '3. Processing', taskId: 110, description: 'Electrode', estimate: '06/25/2007', rate: 125,  cost: 160, due:'07/06/2007'},
            {projectId: 102, project: '3. Processing', taskId: 111, description: 'EDM', estimate: '06/25/2007', rate: 125,  cost: 160, due:'07/11/2007'},
            {projectId: 102, project: '3. Processing', taskId: 112, description: 'W/C', estimate: '06/25/2007', rate: 125,  cost: 160, due:'07/15/2007'},
            {projectId: 102, project: '3. Processing', taskId: 113, description: 'Component', estimate: '06/25/2007', rate: 125,  cost: 160, due:'07/15/2007'},
            {projectId: 103, project: '4. Test & Delivery', taskId: 114, description: 'Assembly', estimate: '06/25/2007', rate: 125,  cost: 160, due:'07/15/2007'},
            {projectId: 103, project: '4. Test & Delivery', taskId: 115, description: 'Test', estimate: '06/25/2007', rate: 125,  cost: 160, due:'07/15/2007'},
            {projectId: 103, project: '4. Test & Delivery', taskId: 116, description: 'Delivery', estimate: '06/25/2007', rate: 125,  cost: 160, due:'07/15/2007'}

        ];

Ext.onReady(function() {  

	   Ext.tip.QuickTipManager.init();
	    
	   var projectToolBar = getProjectToolbar(false/*hasPaste*/, false/*excelPrint*/) ;
	   
	    var store = Ext.create('Ext.data.Store', {
	        model: 'Task',
	        data: data,
	        sorters: {property: 'taskId', direction: 'ASC'},
	        groupField: 'project'
	    });

	    var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
	        clicksToEdit: 1
	    });
	    var showSummary = true;
	    var grid = Ext.create('Ext.grid.Panel', {

	        frame: true,
	        title:getMenuTitle(),
	        iconCls: 'icon-grid',
	        store: store,
	        plugins: [
	            cellEditing
//	            ,
//	            {
//	                ptype: 'datatip',
//	                tpl: 'Click to edit {description}'
//	            }
	        ],
	        listeners: {
	            beforeshowtip: function(grid, tip, data) {
	                var cellNode = tip.triggerEvent.getTarget(tip.view.getCellSelector());
	                if (cellNode) {
	                    data.colName = tip.view.headerCt.getHeaderAtIndex(cellNode.cellIndex).text;
	                }
	            }
	        },
	        selModel: {
	            selType: 'cellmodel'
	        },
	        dockedItems: [
	                      	 			         {
	 			            xtype: 'toolbar',
	 			            items: projectToolBar
	 			            		/*[
	 			                    returnAction,
	 			                    ]*/
	 			        }
//	                      	 			         ,
//	 			      {
//	            dock: 'top',
//	            xtype: 'toolbar',
//	            items: [{
//	                tooltip: 'Toggle the visibility of the summary row',
//	                text: 'Toggle Summary',
//	                enableToggle: true,
//	                pressed: true,
//	                handler: function() {
//	                    showSummary = !showSummary;
//	                    var view = grid.lockedGrid.getView();
//	                    view.getFeature('group').toggleSummaryRow(showSummary);
//	                    view.refresh();
//	                    view = grid.normalGrid.getView();
//	                    view.getFeature('group').toggleSummaryRow(showSummary);
//	                    view.refresh();
//	                }
//	            }]
//	        }
	                 ],
	        features: [{
	            id: 'group',
	            ftype: 'groupingsummary',
	            groupHeaderTpl: '{name}',
	            hideGroupedHeader: true,
	            enableGroupingMenu: false
	        }, {
	            ftype: 'summary',
	            dock: 'bottom'
	        }],
	        columns: [{
	            text: 'Task',
	            width: 300,
	            locked: true,
	            tdCls: 'task',
	            sortable: true,
	            dataIndex: 'description',
	            hideable: false,
	            summaryType: 'count',
	            summaryRenderer: function(value, summaryData, dataIndex) {
	                return ((value === 0 || value > 1) ? '(' + value + ' Tasks)' : '(1 Task)');
	            },
	            field: {
	                xtype: 'textfield'
	            }
	        }, {
	            header: 'Project',
	            width: 180,
	            sortable: true,
	            dataIndex: 'project'
	        }, {
	            header: 'Schedule',
	            columns: [{
	                header: 'Planned Date',
	                width: 125,
	                sortable: true,
	                dataIndex: 'due',
	                summaryType: 'max',
	                renderer: Ext.util.Format.dateRenderer('m/d/Y'),
	                summaryRenderer: Ext.util.Format.dateRenderer('m/d/Y'),
	                field: {
	                    xtype: 'datefield'
	                }
	            }, {
	                header: 'Finished Date',
	                width: 125,
	                sortable: true,
	                dataIndex: 'estimate',
	                summaryType: 'max',
	                renderer: Ext.util.Format.dateRenderer('m/d/Y'),
	                summaryRenderer: Ext.util.Format.dateRenderer('m/d/Y'),
	                field: {
	                    xtype: 'datefield'
	                }
//	                summaryType: 'sum',
//	                renderer: function(value, metaData, record, rowIdx, colIdx, store, view){
//	                    return value + ' hours';
//	                },
//	                summaryRenderer: function(value, summaryData, dataIndex) {
//	                    return value + ' hours';
//	                },
//	                field: {
//	                    xtype: 'numberfield'
//	                }
	            }, {
	                header: 'Planned Cost',
	                width: 125,
	                sortable: true,
	                renderer: Ext.util.Format.usMoney,
	                summaryRenderer: Ext.util.Format.usMoney,
	                dataIndex: 'rate',
	                summaryType: 'average',
	                field: {
	                    xtype: 'numberfield'
	                }
	            }, {
	                header: 'Real Cost',
	                width: 114,
	                sortable: true,
	                renderer: Ext.util.Format.usMoney,
	                summaryRenderer: Ext.util.Format.usMoney,
	                dataIndex: 'cost',
	                summaryType: 'average',
	                field: {
	                    xtype: 'numberfield'
	                }
//	                sortable: false,
//	                groupable: false,
//	                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
//	                    return Ext.util.Format.usMoney(record.get('estimate') * record.get('rate'));
//	                },
//	                summaryType: function(records){
//	                    var i = 0,
//	                        length = records.length,
//	                        total = 0,
//	                        record;
//
//	                    for (; i < length; ++i) {
//	                        record = records[i];
//	                        total += record.get('estimate') * record.get('rate');
//	                    }
//	                    return total;
//	                },
//	                summaryRenderer: Ext.util.Format.usMoney
	            }]
	        }]
	    });
	
	
	    fLAYOUT_CONTENT(grid);
	    cenerFinishCallback();
	
	
	 });