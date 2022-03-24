Ext.ns('App');

Ext.Loader.setConfig({
    enabled        : true,
    disableCaching : true,
    paths          : {
        'Gnt'   : '../../js/Gnt',
        'Sch'   : '../../../ExtScheduler2.x/js/Sch',
        'MyApp' : './js'
    }
});

Ext.require([
    'MyApp.DemoGanttPanel'
]);

Ext.onReady(function () {
    App.Gantt.init();

    Ext.QuickTips.init();
});

App.Gantt = {

    // Initialize application
    init : function (serverCfg) {
        this.gantt = this.createGantt();

        var vp = Ext.create("Ext.Viewport", {
            layout : 'fit',
            items  : this.gantt
        });
    },

    createGantt : function () {

        Ext.define('MyTaskModel', {
            extend   : 'Gnt.model.Task',

            // A field in the dataset that will be added as a CSS class to each rendered task element
            clsField : 'TaskType',

            // Add your own custom fields here
            fields   : [
                { name : 'TaskType', type : 'string' },
                { name : 'Color', type : 'string'}
            ]
        });
        
        Ext.define("MyResourceModel", {
		    extend  : 'Gnt.model.Resource',
		
		    fields : [
		        { name : 'Type', defaultValue: 'Person' }
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
    
    
    
    
       Ext.define('MyResourceStore', {
        extend: 'Gnt.data.ResourceStore',
        autoload: true,
        autoSync: true,
        model       : 'MyResourceModel',
       //     groupField  : 'Type',
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
        	read: CONTEXT_PATH + '/production/schdule.do?method=readMemberGantt',
            create : CONTEXT_PATH + '/production/schdule.do?method=createMemberGantt',
            update: CONTEXT_PATH + '/production/schdule.do?method=updateMemberGantt', //update.action
            destroy: CONTEXT_PATH + '/production/schdule.do?method=destroyMemberGantt'
            },
                    
            extraParams : {
        		ac_uid : '3280003785' //'3280003785' //'3280003791'
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
    	
       var resourceStore = this.resourceStore = Ext.create('MyResourceStore', {});
    
    
	    resourceStore.load(function() {});

    

/*
       var taskStore = Ext.create("Gnt.data.TaskStore", {
            model       : 'MyTaskModel',
            calendar    : new Gnt.data.Calendar({
                name        : 'General',
                calendarId  : 'General'
            }),
            rootVisible : false,
            proxy       : {
                type : 'memory'
            },
            root        : {
                expanded : false
            }
        });
    */
        var dependencyStore = Ext.create("Gnt.data.DependencyStore", {
        });

//        var resourceStore = Ext.create('Gnt.data.ResourceStore', {
//        });

        var assignmentStore = Ext.create('Gnt.data.AssignmentStore', {
            // Must pass a reference to resource store
            resourceStore : resourceStore
        });

//        Ext.Ajax.request({
//            url     : 'data/data.js',
//            success : function (response) {
//                var data = Ext.decode(response.responseText);
//
//                dependencyStore.loadData(data.dependencies);
//                assignmentStore.loadData(data.assignments);
//                resourceStore.loadData(data.resources);
//                taskStore.proxy.data = data.tasks;
//                taskStore.load();
//            }
//        });
//        
        
        var startDate = Sch.util.Date.add(new Date(), Sch.util.Date.WEEK, -2); //new Date(2010, 0, 11);//
        var endDate   = Sch.util.Date.add(startDate, Sch.util.Date.MONTH, 4); //Sch.util.Date.add(new Date(2010, 0, 4), Sch.util.Date.WEEK, 20);//

        var g = Ext.create("MyApp.DemoGanttPanel", {
            allowParentTaskMove : true,

            region          : 'center',
            rowHeight       : 26,
            selModel        : new Ext.selection.TreeModel({
                ignoreRightMouseSelection : false,
                mode                      : 'MULTI'
            }),
            taskStore       : taskStore,
            dependencyStore : dependencyStore,
            assignmentStore : assignmentStore,
            resourceStore   : resourceStore,
            
//            uncomment to enable showing exact drop position for the task 
//            dragDropConfig  : { showExactDropPosition : true },
//            resizeConfig : { showExactResizePosition : true },
//            snapRelativeToEventStartDate : true,

            //snapToIncrement : true,    // Uncomment this line to get snapping behavior for resizing/dragging.
            columnLines     : false,

            startDate : startDate,
            endDate   : endDate,

            viewPreset : 'weekAndDayLetter'
        });

        
        g.on({
            dependencydblclick : function (ga, rec) {
                var from = taskStore.getNodeById(rec.get('From')).get('Name'),
                    to = taskStore.getNodeById(rec.get('To')).get('Name');

                Ext.Msg.alert('Hey', Ext.String.format('You clicked the link between "{0}" and "{1}"', from, to));
            },
            timeheaderdblclick : function (col, start, end) {
                Ext.Msg.alert('Hey', 'You click header cell : ' + Ext.Date.format(start, 'Y-m-d') + ' - ' + Ext.Date.format(end, 'Y-m-d'));
            }
        });

        return g;
    }
};

