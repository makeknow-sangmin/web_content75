Ext.Loader.setPath('MyApp', CONTEXT_PATH + '/statistics/gantt/app');
Ext.define("MyApp.view.Viewport", {
    extend                  : 'Ext.Viewport',
    layout                  : 'border',
    requires                : [
        'MyApp.view.ResourceSchedule',
        'MyApp.view.Gantt',
        'MyApp.view.ResourceList',
        'MyApp.view.ResourceHistogram',
        'MyApp.model.Resource'
    ],

    
    initComponent : function() {
    	
    	/*
   	Ext.define('MyResourceStore', {
        extend: 'Gnt.data.ResourceStore',
        autoload: true,
        autoSync: true,
        model       : 'MyApp.model.Resource',
            groupField  : 'Type',
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
        	read: CONTEXT_PATH + '/production/schdule.do?method=readMemberGantt' //,
//            create : CONTEXT_PATH + '/production/schdule.do?method=createMemberGantt',
//            update: CONTEXT_PATH + '/production/schdule.do?method=updateMemberGantt', //update.action
//            destroy: CONTEXT_PATH + '/production/schdule.do?method=destroyMemberGantt'
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
    	*/
        var resourceStore = this.resourceStore = new Gnt.data.ResourceStore({
            model       : 'MyApp.model.Resource',
            groupField  : 'Type'
        });
       
        var dependencyStore = new Gnt.data.DependencyStore();
        var assignmentStore = this.assignmentStore = new Gnt.data.AssignmentStore({
            resourceStore : resourceStore
        });


        var taskStore = this.taskStore = new MyApp.store.TaskStore({
            dependencyStore : dependencyStore,
            resourceStore   : resourceStore,
            assignmentStore : assignmentStore
            //,url     : 'data.js'
        });
/*        
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

       var taskStore = this.taskStore = Ext.create('MyTaskStore', {});
*/
        var startDate = Sch.util.Date.add(new Date(GANTT_START), Sch.util.Date.DAY, -1);
        var endDate   = Sch.util.Date.add(new Date(GANTT_END), Sch.util.Date.DAY, 1);

        
        this.gantt = new MyApp.view.Gantt({
            id              : 'ganttchart',
            startDate       : startDate,//new Date(2010, 0, 11),//startDate,
            endDate			: endDate,
            taskStore       : taskStore,
            dependencyStore : dependencyStore,
            assignmentStore : assignmentStore,
            resourceStore   : resourceStore
            //,            viewPreset : 'weekAndDayLetter'
        });
       
	        Ext.apply(this, {
	            items : [
	                {
	                    xtype : 'navigation',
	                    id    : 'navigation'
	                },
	                {
	                    xtype   : 'container',
	                    itemId  : 'maincontainer',
	                    region  : 'center',
	                    layout  : { type : 'vbox', align : 'stretch' },
	                    items   : this.gantt
	                },
	                {
	                    xtype : 'settings'
	                }
	            ]
	        });       	
	        this.callParent(arguments);
	        
	        
    }
});