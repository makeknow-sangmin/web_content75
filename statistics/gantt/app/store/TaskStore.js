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
	        },
	        {
	        	name: "fileQty",
	        	type: "int"
	        }
        ]
    });

//var tempExBuf = [];

Ext.define("MyApp.store.TaskStore", {
    extend      : 'Gnt.data.TaskStore',
    rootVisible : false,
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
	            update: CONTEXT_PATH + '/statistics/task.do?method=updateGantt',
	            destroy: CONTEXT_PATH + '/statistics/task.do?method=deleteGantt'
            },
                    
            extraParams : {
        		ac_uid : PJ_UID //'3280003785' //'3280003785' //'3280003791'
    		},
            writer : {
                type : 'json',
                root: 'data',
                encode: true,
                writeAllFields: true,
                listful : true,
                allowSingle: false              
            }
     },
	 listeners: {
	 	'taskdrop': {
            fn: function(gantt, taskRecord, eOpts) {
                //this.taskStore.commit();
                taskRecord.commit();
                //alert('dfd');
            },
            scope: this
        },
		load: function(store, records, successful,operation, options) {
				console_log(records);

		},
	    beforeload: function(){
			//console_log('--------------');
		},
        write : function(proxy, operation, object) {
        	
        	console.log('proxy', proxy);
        	console.log('operation', operation);
        	console.log('object', object);
        	var act_name = operation['action'];
        	console.log('act_name:', act_name);
        	var records = operation['records'];
        	switch(act_name) {
        		case 'create':
        		{
        			this.load();
	        		//for(var i=0; i<records.length; i++) {
	        		//	tempExBuf.push(records[i]);
	        		//}        			
        		}
        		break;
        		case 'update':
        		{
        			//if(tempExBuf.length>0) {
        			//	tempExBuf.splice(0, tempExBuf.length);
        			//	        			
        			//	//for(var i=0; i<records.length; i++) {
        			//	this.changeObject(records[i]);
        				//}
        			//}
        		}
        		break;
        	}
        	
        }   
	},
	changeObject : function (changed) {
		this.load();
		
//		var store = this;
//		var cnt =  store.getCount();
//		console_log(cnt);
//		var root = store.getRootNode();
//		console_log(root);
//		
//		for(var i=0; i< cnt; i++) {
//			var record = root.getAt(i);
//			console_log(record);
//		}
//		console_log(changed);
	},
    constructor : function (config) {
        config.calendar = new Gnt.data.calendar.BusinessTime({
            calendarId : "Default",
            name       : "Default"
        });

        this.callParent(arguments);
    },

    loadDataSet : function () {

        Ext.Ajax.request({
            url      : CONTEXT_PATH + '/statistics/task.do?method=loadGantt',//this.url,
    		params:{
				ac_uid : PJ_UID//'3280003785' //'3280003785' //'3280003791'
			},
            success  : this.populateDataStores,
            callback : function () {
                this.fireEvent('load');
            },
            scope    : this,
			failure: extjsUtil.failureMessage
        });
    },

    saveDataSet : function () {

        var resources = this.resourceStore.getModifiedRecords();
        var assignments = this.assignmentStore.getModifiedRecords();
        var dependencies = this.dependencyStore.getModifiedRecords();
        var tasks = this.getModifiedRecords();

        function extract(records) {
            var result = [];

            Ext.each(records, function(record) {
                result.push(record.data);
            });

            return result;
        }

        var data = {
            resources    : extract(resources),
            assignments  : extract(assignments),
            dependencies : extract(dependencies),
            tasks        : extract(tasks)
        };

        Ext.Ajax.request({
            url      : CONTEXT_PATH + '/statistics/task.do?method=saveGantt',//this.url,
    		params:{
				ac_uid : PJ_UID//'3280003785' //'3280003785' //'3280003791'
				,data : Ext.JSON.encode(data)
			},
            method   : 'POST',
            //jsonData : data,

            callback : function () {
                this.fireEvent('saved');
                this.load();
                //Ext.MessageBox.alert('fired', 'saveDataSet:' + this.url);
            },
            scope    : this
        })
    },

    populateDataStores : function (response, options) {
    	
    	//console.log(response.responseText);
    	 
        var data = '';
        try {
        	data = Ext.decode(response.responseText);
        } catch(e){}
        //console.log(data);

        if (data.calendars && data.calendars["default"]) {
            this.calendar.loadData(data.calendars["default"]);
        }

        if (data.dependencies) {
            this.dependencyStore.loadData(data.dependencies);
        }

        if (data.assignments) {
            this.assignmentStore.loadData(data.assignments);
        }

        if (data.resources) {
            this.resourceStore.loadData(data.resources);
        }

        // Now all is in place, continue with tasks
        this.setRootNode(data);
    }
})
;
