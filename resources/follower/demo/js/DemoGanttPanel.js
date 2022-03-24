Ext.define("MyApp.DemoGanttPanel", {
    extend : "Gnt.panel.Gantt",
    requires : [
        'Gnt.plugin.TaskContextMenu',
        'Sch.plugin.TreeCellEditing',
        'Sch.plugin.Pan'
    ],
    rightLabelField : 'Responsible',
    highlightWeekends : true,
    showTodayLine : true,
    loadMask : true,
    enableProgressBarResize : true,

    initComponent : function() {

        Ext.apply(this, {

            lockedGridConfig : {
                width: 300,
                title : 'Tasks',
                collapsible : true
            },

            // Experimental
            schedulerConfig : {
                collapsible : true,
                title : 'Schedule'
            },

            leftLabelField : {
                dataIndex : 'Name',
                editor : { xtype : 'textfield' }
            },

            // Add some extra functionality
            plugins : [
                Ext.create("Gnt.plugin.TaskContextMenu"),
                Ext.create("Sch.plugin.Pan"),
                Ext.create('Sch.plugin.TreeCellEditing', { clicksToEdit: 1 })
            ],

            // Define an HTML template for the tooltip
            tooltipTpl : new Ext.XTemplate(
                '<h4 class="tipHeader">{Name}</h4>',
                '<table class="taskTip">',
                    '<tr><td>Start:</td> <td align="right">{[values._record.getDisplayStartDate("y-m-d")]}</td></tr>',
                    '<tr><td>End:</td> <td align="right">{[values._record.getDisplayEndDate("y-m-d")]}</td></tr>',
                    '<tr><td>Progress:</td><td align="right">{PercentDone}%</td></tr>',
                '</table>'
            ).compile(),

             // Define the buttons that are available for user interaction
            tbar : this.createToolbar()
        });

        this.callParent(arguments);
    },

    createToolbar : function() {
        return [{
            xtype: 'buttongroup',
            title: 'View tools',
            columns: 3,
            items: [
                {
                    iconCls : 'icon-prev',
                    text : 'Previous',
                    scope : this,
                    handler : function() {
                        this.shiftPrevious();
                    }
                },
                {
                    iconCls : 'icon-next',
                    text : 'Next',
                    scope : this,
                    handler : function() {
                        this.shiftNext();
                    }
                },
                {
                    text : 'Collapse all',
                    iconCls : 'icon-collapseall',
                    scope : this,
                    handler : function() {
                        this.collapseAll();
                    }
                },
                {
                    text : 'View full screen',
                    iconCls : 'icon-fullscreen',
                    disabled : !this._fullScreenFn,
                    handler : function() {
                        this.showFullScreen();
                    },
                    scope : this
                },
                {
                    text : 'Zoom to fit',
                    iconCls : 'zoomfit',
                    handler : function() {
                        this.zoomToFit();
                    },
                    scope : this
                },
                {
                    text : 'Expand all',
                    iconCls : 'icon-expandall',
                    scope : this,
                    handler : function() {
                        this.expandAll();
                    }
                }
            ]
        },
        {
            xtype: 'buttongroup',
            title: 'View resolution',
            columns: 2,
            items: [{
                    text: '6 weeks',
                    scope : this,
                    handler : function() {
                        this.switchViewPreset('weekAndMonth');
                    }
                },
                {
                    text: '10 weeks',
                    scope : this,
                    handler : function() {
                        this.switchViewPreset('weekAndDayLetter');
                    }
                }
            ]},
            {
                xtype: 'buttongroup',
                title: 'Set percent complete',
                columns: 5,
                defaults : { scale : "large" },
                items: [{
                        text: '0%<div class="percent percent0"></div>',
                        scope : this,
                        handler : function() {
                            this.applyPercentDone(0);
                        }
                    },
                    {
                        text: '25%<div class="percent percent25"><div></div></div>',
                        scope : this,
                        handler : function() {
                            this.applyPercentDone(25);
                        }
                    },
                    {
                        text: '50%<div class="percent percent50"><div></div></div>',
                        scope : this,
                        handler : function() {
                            this.applyPercentDone(50);
                        }
                    },
                    {
                        text: '75%<div class="percent percent75"><div></div></div>',
                        scope : this,
                        handler : function() {
                            this.applyPercentDone(75);
                        }
                    },
                    {
                        text: '100%<div class="percent percent100"><div></div></div>',
                        scope : this,
                        handler : function() {
                            this.applyPercentDone(100);
                        }
                    }
                ]
            },
            '->',
            {
                xtype: 'buttongroup',
                title: 'Try some features...',
                columns : 3,
                items: [
                {
                    text : 'Highlight critical chain',
                    iconCls : 'togglebutton',
                    scope : this,
                    enableToggle : true,
                    handler : function(btn) {
                        var v = this.getSchedulingView();
                        if (btn.pressed) {
                            v.highlightCriticalPaths(true);
                        } else {
                            v.unhighlightCriticalPaths(true);
                        }
                    }
                },
                {
                    iconCls : 'action',
                    text : 'Highlight tasks longer than 7 days',
                    scope : this,
                    handler : function(btn) {
                        this.taskStore.getRootNode().cascadeBy(function(task) {
                            if (Sch.util.Date.getDurationInDays(task.get('StartDate'), task.get('EndDate')) > 7) {
                                var el = this.getSchedulingView().getElementFromEventRecord(task);
                                el && el.frame('lime');
                            }
                        }, this);
                    }
                },
                {
                    iconCls : 'togglebutton',
                    text : 'Filter: Tasks with progress < 30%',
                    scope : this,
                    enableToggle : true,
                    toggleGroup : 'filter',
                    handler : function(btn) {
                        if (btn.pressed) {
                            this.taskStore.filter(function(task) {
                                return task.get('PercentDone') < 30;
                            });
                        } else {
                            this.taskStore.clearFilter();
                        }
                    }
                },
                {
                    iconCls : 'togglebutton',
                    text : 'Cascade changes',
                    scope : this,
                    enableToggle : true,
                    handler : function(btn) {
                        this.setCascadeChanges(btn.pressed);
                    }
                },
                {
                    iconCls : 'action',
                    text : 'Scroll to last task',
                    scope : this,

                    handler : function(btn) {
                        var latestEndDate = new Date(0),
                            latest;
                        this.taskStore.getRootNode().cascadeBy(function(task) {
                            if (task.get('EndDate') >= latestEndDate) {
                                latestEndDate = task.get('EndDate');
                                latest = task;
                            }
                        });
                        this.getSchedulingView().scrollEventIntoView(latest, true);
                    }
                },
                {
                    xtype : 'textfield',
                    emptyText : 'Search for task...',
                    scope : this,
                    width:150,
                    enableKeyEvents : true,
                    listeners : {
                        keyup : {
                            fn : function(field, e) {
                                var value   = field.getValue();

                                if (value) {
                                    this.taskStore.filter('Name', field.getValue(), true, false);
                                } else {
                                    this.taskStore.clearFilter();
                                }
                            },
                            scope : this
                        },
                        specialkey : {
                            fn : function(field, e) {
                                if (e.getKey() === e.ESC) {
                                    field.reset();
                                }
                                this.taskStore.clearFilter();
                            },
                            scope : this
                        }
                    }
                }]
            }
        ];
    },

    applyPercentDone : function(value) {
        this.getSelectionModel().selected.each(function(task) { task.setPercentDone(value); });
    },

    showFullScreen : function() {
        this.el.down('.x-panel-body').dom[this._fullScreenFn]();
    },

    _fullScreenFn : (function() {
        var docElm = document.documentElement;

        if (docElm.requestFullscreen) {
            return "requestFullscreen";
        }
        else if (docElm.mozRequestFullScreen) {
            return "mozRequestFullScreen";
        }
        else if (docElm.webkitRequestFullScreen) {
            return "webkitRequestFullScreen";
        }
    })()
});
