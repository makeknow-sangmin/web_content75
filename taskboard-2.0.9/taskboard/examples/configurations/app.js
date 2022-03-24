
Ext.require([
    'Kanban.view.TaskBoard'
]);

Ext.Loader.setConfig({
    enabled        : true,
    disableCaching : true,
    paths          : {
        'Sch'    : CONTEXT_PATH + '/taskboard-2.0.9/taskboard/lib/Sch',
        'Kanban' : CONTEXT_PATH + '/taskboard-2.0.9/taskboard/lib/Kanban'
    }
});



Ext.define('MyTask2', {
    extend : 'Kanban.model.Task',

    states : [
        'NotStarted',
        'InProgress',
        'Testing',
        'TestingDone',
        'Done'
    ],

    // Move tasks freely
    isValidTransition : function (state) {
        return true;
    }
})

Ext.define('MyTask3', {
    extend : 'Kanban.model.Task',

    states            : [
        'Backlog',
        'NoStarted',
        'InProgress',
        'Test',
        'Done'
    ],
    // Move tasks freely
    isValidTransition : function (state) {
        return true;
    }
})

Ext.onReady(function () {

    var resourceStore = new Kanban.data.ResourceStore({
        sorters  : 'Name',
        autoLoad : true,
        proxy    : {
            type : 'ajax',

            api : {
                read    : CONTEXT_PATH + '/taskboard-2.0.9/taskboard/examples/configurations/users.js',
                update  : undefined,
                destroy : undefined,
                create  : undefined
            }
        }
    });


    var taskStore = new Kanban.data.TaskStore({
        sorters  : 'Name',
        autoLoad : true,
        proxy    : {
            type : 'ajax',

            api : {
                read    : CONTEXT_PATH + '/taskboard-2.0.9/taskboard/examples/configurations/tasks.js',
                update  : undefined,
                destroy : undefined,
                create  : undefined
            }
        }
    });

    var taskStore2 = new Kanban.data.TaskStore({
        model    : MyTask2,
        sorters  : 'Name',
        autoLoad : true,
        proxy    : {
            type : 'ajax',

            api : {
                read    : CONTEXT_PATH + '/taskboard-2.0.9/taskboard/examples/configurations/tasks.js',
                update  : undefined,
                destroy : undefined,
                create  : undefined
            }
        }
    });

    var taskStore3 = new Kanban.data.TaskStore({
        model    : MyTask3,
        sorters  : 'Name',
        autoLoad : true,
        proxy    : {
            type : 'ajax',

            api : {
                read    : CONTEXT_PATH + '/taskboard-2.0.9/taskboard/examples/configurations/tasks.js',
                update  : undefined,
                destroy : undefined,
                create  : undefined
            }
        }
    });

    
    var vp = new Ext.Viewport({ //Ext.create('Ext.panel.Panel', {
        layout : 'border',
        items  : [

        {
         //title: '미지정',
           region   : 'east',
           width: "20%",
           xtype     : 'taskboard',
                        layout    : 'border',
                        cls       : 'panel-3',
                        taskStore : taskStore3,
                        columns   : [
                            
                            {
                                region    : 'center',
                                flex      : null,
                                zoomLevel : 'small',
                                state     : '미지정'
                            }

                        ]
        },

            {
                width: "80%",
                region   : 'center',
                border   : false,
    layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch'
    },
    
defaults: {
                    xtype         : 'taskboard',
                    taskStore     : taskStore,
                    resourceStore : resourceStore,
                    userMenu      : {
                        xtype         : 'kanban_usermenu',
                        resourceStore : resourceStore
                    }
    },
items: [
    {
        xtype:'component',
        html:'<div style="padding-left:3px;margin:5px;font-weight:bold;width:30px;text-align:center;">S01</div>'
    },
        {
            //title: 'J01',
            height: 190,
            margin: '0 0 5 0',

            xtype     : 'taskboard',
                        layout    : 'border',
                        cls       : 'panel-3',
                        taskStore : taskStore3,
                        columns   : [
                            {
                                region   : 'center',
                                xtype    : 'container',
                                layout   : {type : 'hbox', align : 'stretch'},
                                defaults : {margin : 10, flex : 1, xtype : 'taskcolumn'},
                                items    : [
                                    {
                                        xtype    : 'panel',
                                        //title    : 'In Progress',
                                        cls      : 'split',
                                        flex     : 2,
                                        margin   : '0 2 0 2',
                                        padding  : 0,
                                        layout   : { type : 'hbox', align : 'stretch' },
                                        //header   : { height : 25, padding : 0, style : 'text-align:center;border-bottom:2px solid #f6f6f6 !important' },
                                        defaults : {
                                            xtype   : 'taskcolumn',
                                            flex    : 1,
                                            iconCls : '',
                                            header  : { height : 25, padding : 0 }
                                        },
                                        items    : [
                                            {
                                                state     : 'InProgress',
                                                title     : 'S01-01',
                                                cls		  : 'stock-rack-panel',
                                                border    : false,
                                                bodyStyle : 'border-right:1px dashed #aaa !important'
                                            },
                                            {
                                                state  : 'Test',
                                                cls		  : 'stock-rack-panel',
                                                title  : 'S01-02',
                                                border : false
                                            }
                                        ]
                                    },
                                    {
                                        xtype    : 'panel',
                                        //title    : 'In Progress',
                                        cls      : 'split',
                                        flex     : 2,
                                        margin   : '0 2 0 2',
                                        padding  : 0,
                                        layout   : { type : 'hbox', align : 'stretch' },
                                        //header   : { height : 25, padding : 0, style : 'text-align:center;border-bottom:2px solid #f6f6f6 !important' },
                                        defaults : {
                                            xtype   : 'taskcolumn',
                                            flex    : 1,
                                            iconCls : '',
                                            header  : { height : 25, padding : 0 }
                                        },
                                        items    : [
                                            {
                                                state     : 'InProgress',
                                                cls		  : 'stock-rack-panel',
                                                title  : 'S01-03',
                                                border    : false,
                                                bodyStyle : 'border-right:1px dashed #aaa !important'
                                            },
                                            {
                                                state  : 'Test',
                                                cls		  : 'stock-rack-panel',
                                                title  : 'S01-04',
                                                border : false
                                            }
                                        ]
                                    },
                                    {
                                        xtype    : 'panel',
                                        //title    : 'In Progress',
                                        cls      : 'split',
                                        flex     : 2,
                                        margin   : '0 2 0 2',
                                        padding  : 0,
                                        layout   : { type : 'hbox', align : 'stretch' },
                                        //header   : { height : 25, padding : 0, style : 'text-align:center;border-bottom:2px solid #f6f6f6 !important' },
                                        defaults : {
                                            xtype   : 'taskcolumn',
                                            flex    : 1,
                                            iconCls : '',
                                            header  : { height : 25, padding : 0 }
                                        },
                                        items    : [
                                            {
                                                state     : 'InProgress',
                                                cls		  : 'stock-rack-panel',
                                                title  : 'S01-05',
                                                border    : false,
                                                bodyStyle : 'border-right:1px dashed #aaa !important'
                                            },
                                            {
                                                state  : 'Test',
                                                cls		  : 'stock-rack-panel',
                                                title  : 'S01-06',
                                                border : false
                                            }
                                        ]
                                    },
                                    {
                                        xtype    : 'panel',
                                        //title    : 'In Progress',
                                        cls      : 'split',
                                        flex     : 2,
                                        margin   : '0 2 0 2',
                                        padding  : 0,
                                        layout   : { type : 'hbox', align : 'stretch' },
                                        //header   : { height : 25, padding : 0, style : 'text-align:center;border-bottom:2px solid #f6f6f6 !important' },
                                        defaults : {
                                            xtype   : 'taskcolumn',
                                            flex    : 1,
                                            iconCls : '',
                                            header  : { height : 25, padding : 0 }
                                        },
                                        items    : [
                                            {
                                                state     : 'InProgress',
                                                cls		  : 'stock-rack-panel',
                                                title  : 'S01-07',
                                                border    : false,
                                                bodyStyle : 'border-right:1px dashed #aaa !important'
                                            },
                                            {
                                                state  : 'Test',
                                                cls		  : 'stock-rack-panel',
                                                title  : 'S01-08',
                                                border : false
                                            }
                                        ]
                                    }
                                ]
                            }
                            
                            
                            

                        ]
        },
        {
            xtype:'component',
            html:'<div style="padding-left:3px;margin:5px;font-weight:bold;width:30px;text-align:center;">S02</div>'
        },
        {
            //title: 'Panel 2',
            height: 190,
            margin: '0 0 10 0',
            xtype     : 'taskboard',
                        layout    : 'border',
                        cls       : 'panel-3',
                        taskStore : taskStore3,
                        columns   : [
                            {
                                region   : 'center',
                                xtype    : 'container',
                                layout   : {type : 'hbox', align : 'stretch'},
                                defaults : {margin : 10, flex : 1, xtype : 'taskcolumn'},
                                items    : [
                                    {
                                        xtype    : 'panel',
                                        //title    : 'In Progress',
                                        cls      : 'split',
                                        flex     : 2,
                                        margin   : '0 2 0 2',
                                        padding  : 0,
                                        layout   : { type : 'hbox', align : 'stretch' },
                                        //header   : { height : 25, padding : 0, style : 'text-align:center;border-bottom:2px solid #f6f6f6 !important' },
                                        defaults : {
                                            xtype   : 'taskcolumn',
                                            flex    : 1,
                                            iconCls : '',
                                            header  : { height : 25, padding : 0 }
                                        },
                                        items    : [
                                            {
                                                state     : 'InProgress',
                                                //title     : 'InProgress',
                                                border    : false,
                                                bodyStyle : 'border-right:1px dashed #aaa !important'
                                            },
                                            {
                                                state  : 'Test',
                                                ///title  : 'Test',
                                                border : false
                                            }
                                        ]
                                    },
                                    {
                                        xtype    : 'panel',
                                        //title    : 'In Progress',
                                        cls      : 'split',
                                        flex     : 2,
                                        margin   : '0 2 0 2',
                                        padding  : 0,
                                        layout   : { type : 'hbox', align : 'stretch' },
                                        //header   : { height : 25, padding : 0, style : 'text-align:center;border-bottom:2px solid #f6f6f6 !important' },
                                        defaults : {
                                            xtype   : 'taskcolumn',
                                            flex    : 1,
                                            iconCls : '',
                                            header  : { height : 25, padding : 0 }
                                        },
                                        items    : [
                                            {
                                                state     : 'InProgress',
                                                //title     : 'InProgress',
                                                border    : false,
                                                bodyStyle : 'border-right:1px dashed #aaa !important'
                                            },
                                            {
                                                state  : 'Test',
                                                ///title  : 'Test',
                                                border : false
                                            }
                                        ]
                                    },
                                    {
                                        xtype    : 'panel',
                                        //title    : 'In Progress',
                                        cls      : 'split',
                                        flex     : 2,
                                        margin   : '0 2 0 2',
                                        padding  : 0,
                                        layout   : { type : 'hbox', align : 'stretch' },
                                        //header   : { height : 25, padding : 0, style : 'text-align:center;border-bottom:2px solid #f6f6f6 !important' },
                                        defaults : {
                                            xtype   : 'taskcolumn',
                                            flex    : 1,
                                            iconCls : '',
                                            header  : { height : 25, padding : 0 }
                                        },
                                        items    : [
                                            {
                                                state     : 'InProgress',
                                                //title     : 'InProgress',
                                                border    : false,
                                                bodyStyle : 'border-right:1px dashed #aaa !important'
                                            },
                                            {
                                                state  : 'Test',
                                                ///title  : 'Test',
                                                border : false
                                            }
                                        ]
                                    },
                                    {
                                        xtype    : 'panel',
                                        //title    : 'In Progress',
                                        cls      : 'split',
                                        flex     : 2,
                                        margin   : '0 2 0 2',
                                        padding  : 0,
                                        layout   : { type : 'hbox', align : 'stretch' },
                                        //header   : { height : 25, padding : 0, style : 'text-align:center;border-bottom:2px solid #f6f6f6 !important' },
                                        defaults : {
                                            xtype   : 'taskcolumn',
                                            flex    : 1,
                                            iconCls : '',
                                            header  : { height : 25, padding : 0 }
                                        },
                                        items    : [
                                            {
                                                state     : 'InProgress',
                                                //title     : 'InProgress',
                                                border    : false,
                                                bodyStyle : 'border-right:1px dashed #aaa !important'
                                            },
                                            {
                                                state  : 'Test',
                                                ///title  : 'Test',
                                                border : false
                                            }
                                        ]
                                    }
                                ]
                            }
                            

                        ]
        }
    ]

            }
        ]
    });
});
