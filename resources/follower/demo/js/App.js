Ext.ns('App');


Ext.Loader.setConfig({ 
    enabled: true, 
    disableCaching : true,
    paths : {
        'MyApp' : './js'
    }
});

Ext.require([
    'MyApp.DemoGanttPanel',
    'Gnt.column.StartDate',
    'Gnt.column.EndDate',
    'Gnt.column.Duration',
    'Gnt.column.PercentDone',
    'Gnt.column.ResourceAssignment'    
]);


Ext.onReady(function() {
    Ext.QuickTips.init();

    Ext.define('MyTaskModel', {
        extend : 'Gnt.model.Task',

        clsField : 'TaskType',
        fields : [
            { name : 'TaskType', type : 'string' },
            { name : 'leaf', type: 'bool'},
            {
	        	name: "Resizable",
	        	type: "boolean"
	        },
	        {
	        	name: "Draggable",
	        	type: "boolean"
	        },
	        {
	        	name: "pj_uid"
	        },
	        {
	        	name: "creator"
	        },
	        {
	        	name: "creator_uid"
	        }
        ]
    });

    Ext.define('MyTaskStore', {
        extend: 'Gnt.data.TaskStore',
        autoload: true,
        autoSync: true,
        model: 'MyTaskModel',
        sorters : {
            property : 'Id',
            direction : 'ASC'
        },
        proxy : {
            type : 'ajax',
            method: 'POST',
            reader: {
                type : 'json'
            }, 
            api: {
        	read: CONTEXT_PATH + '/statistics/task.do?method=readGantt',
            create : CONTEXT_PATH + '/statistics/task.do?method=createGantt',
            update: CONTEXT_PATH + '/statistics/task.do?method=updateGantt', //update.action
            destroy: CONTEXT_PATH + '/statistics/task.do?method=deleteGantt'
            },
                    
            extraParams : {
        		ac_uid : '3280003791'
    		},
            writer : {
                type : 'json',
                root: 'data',
                encode: true,
                writeAllFields: true,
                listful : true,
                allowSingle: false              
            }
        }
    });

    var taskStore = Ext.create('MyTaskStore', {});

    var resourceStore = Ext.create("Gnt.data.ResourceStore", {
        model : 'Gnt.model.Resource',
        autoLoad: true,
        proxy : {
            method: 'POST',
            type : 'ajax',
            api: {
                read : 'r-read.php',
                create: 'r-create.php',
                destroy: 'r-destroy.php',
                update: 'r-update.php'                    
            },
            reader : {
                type : 'json'
            },
            writer : {
                type : 'json',
                root: 'data',
                encode: true,
                writeAllFields: true,
                listful : true,
                allowSingle: false              
            }                
        }
    });

    var dependencyStore = Ext.create("Gnt.data.DependencyStore", {
        autoLoad: true,
        autoSync: true,
        proxy: {
            type : 'ajax',
            method: 'POST',
            api: {
                read: 'd-read.php',
                create: 'd-create.php',
                destroy: 'd-destroy.php',
                update: 'd-update.php'
            },
            reader: {
                type : 'json'
            },                
            writer : {
              type : 'json',
              root: 'data',
              encode: true,
              writeAllFields: true,
              allowSingle: false                
            }
        }
    });

    var assignmentStore = Ext.create("Gnt.data.AssignmentStore", {
        model: 'Gnt.model.Assignment',
        autoLoad: true,
        autoSync: true,
        resourceStore: resourceStore,
        proxy : {
            method: 'POST',
            type : 'ajax',
            api: {
                read : 'a-read.php',
                create: 'a-create.php',
                destroy: 'a-destroy.php',
                update: 'a-update.php'                    
            },
            reader : {
                type : 'json'
            },
            writer : {
                type : 'json',
                root: 'data',
                encode: true,
                writeAllFields: true,
                listful : true,
                //thanks to this, we're always getting array on the server side
                allowSingle: false              
            }                
        }
    });        

    var startDate = Sch.util.Date.add(new Date(), Sch.util.Date.WEEK, -2);
        endDate   = Sch.util.Date.add(startDate, Sch.util.Date.MONTH, 4);

    var g = Ext.create("MyApp.DemoGanttPanel", {
        renderTo        : Ext.getBody(),
        width           : 1200,
        height          : 600,
        selModel        : new Ext.selection.TreeModel({ ignoreRightMouseSelection : false, mode     : 'MULTI'}),
        taskStore       : taskStore,
        dependencyStore : dependencyStore,
        assignmentStore : assignmentStore,
        resourceStore   : resourceStore,
        columnLines     : true,
        startDate       : startDate,
        endDate         : endDate,
        viewPreset      : 'weekAndDayLetter',
        leftLabelField : {
            dataIndex : 'Name',
            editor : { xtype : 'textfield' }
        },
        rightLabelField : {
            dataIndex : 'Id',
            renderer : function(value, record) {
                return 'Id: #' + value;
            }
        },
        eventRenderer : function(task) {
            if (assignmentStore.findExact('TaskId', task.data.Id) >= 0) {
                return {
                    ctcls : 'resources-assigned'
                };
            }
        },
        columns : [
            {
                xtype       : 'namecolumn',
                width       : 200,
                renderer    : function(v, meta, r) {
                    if (!r.data.leaf) meta.tdCls = 'sch-gantt-parent-cell';

                    return v;
                }
            },            
            {
                xtype : 'startdatecolumn'
            },
            {
                xtype : 'enddatecolumn'
            },                
            {
                xtype : 'durationcolumn'
            },
            {
                xtype : 'percentdonecolumn',
                width : 50
            },
            {
                text    : 'Assigned Resources',
                width   :150,
                xtype   : 'resourceassignmentcolumn'
            }
        ]           
    });
});