Ext.define("MyApp.Toolbar", {
    extend : "Ext.Toolbar",
    cls    : 'my-toolbar',

    gantt : null,

    initComponent : function () {
        var gantt = this.gantt;

        gantt.taskStore.on({
            'filter-set'   : function () {
                this.down('[iconCls*=icon-collapseall]').disable()
                this.down('[iconCls*=icon-expandall]').disable()
            },
            'filter-clear' : function () {
                this.down('[iconCls*=icon-collapseall]').enable()
                this.down('[iconCls*=icon-expandall]').enable()
            },
            scope          : this
        })

        Ext.apply(this, {
            defaults : { scale : 'medium' },

            items : [
                {
                    tooltip : 'Previous timespan',
                    iconCls : 'icon icon-left',
                    handler : function () {
                        gantt.shiftPrevious();
                    }
                },
                {
                    tooltip : 'Next timespan',
                    iconCls : 'icon icon-right',
                    handler : function () {
                        gantt.shiftNext();
                    }
                },
                {
                    tooltip : 'Collapse all',
                    iconCls : 'icon icon-collapseall',
                    handler : function () {
                        gantt.collapseAll();
                    }
                },

                {
                    tooltip : 'Expand all',
                    iconCls : 'icon icon-expandall',
                    handler : function () {
                        gantt.expandAll();
                    }
                },
                {
                    tooltip : 'Zoom out',
                    iconCls : 'icon icon-zoomout',
                    handler : function () {
                        gantt.zoomOut();
                    }
                },
                {
                    tooltip : 'Zoom in',
                    iconCls : 'icon icon-zoomin',
                    handler : function () {
                        gantt.zoomIn();
                    }
                },
                {
                    tooltip : 'Zoom to fit',
                    iconCls : 'icon icon-zoomfit',
                    handler : function () {
                        gantt.zoomToFit();
                    }
                },
                {
                    tooltip  : 'View full screen',
                    iconCls  : 'icon icon-fullscreen',
                    disabled : !this._fullScreenFn,
                    handler  : function () {
                        this.showFullScreen();
                    },
                    scope    : this
                },
                {
                    tooltip      : 'Highlight critical path',
                    iconCls      : 'icon icon-criticalpath',
                    enableToggle : true,
                    handler      : function (btn) {
                        var v = gantt.getSchedulingView();
                        if (btn.pressed) {
                            v.highlightCriticalPaths(true);
                        } else {
                            v.unhighlightCriticalPaths(true);
                        }
                    }
                },
                {
                    tooltip      : 'Add new task',
                    iconCls      : 'icon icon-add',
                    enableToggle : true,
                    handler      : function (btn) {
                        var task = gantt.taskStore.getRootNode().appendChild({
                            Name      : 'New Task',
                            StartDate : new Date(2010, 0, 13),
                            Duration  : 1,
                            leaf      : true
                        });
                        gantt.editingInterface.startEdit(task, 1);
                    }
                },
                {
                    tooltip      : 'Remove selected task(s)',
                    iconCls      : 'icon icon-delete',
                    enableToggle : true,
                    handler      : function (btn) {
                        gantt.getSelectionModel().selected.each(function (task) {
                            task.remove();
                        })
                    }
                },
                {
                    tooltip      : 'Indent',
                    iconCls      : 'icon icon-indent',
                    enableToggle : true,
                    handler      : function (btn) {
                        gantt.taskStore.indent(gantt.getSelectionModel().getSelection());
                    }
                },
                {
                    tooltip      : 'Outdent',
                    iconCls      : 'icon icon-outdent',
                    enableToggle : true,
                    handler      : function (btn) {
                        gantt.taskStore.outdent(gantt.getSelectionModel().getSelection());
                    }
                },
                '->',
                {
                    text : 'Try more features...',
                    menu : {
                        items : [
                            {
                                text    : 'Toggle rollup tasks',
                                handler : function (btn) {
                                    var showRollup = !gantt.showRollupTasks;
                                    gantt.setShowRollupTasks(showRollup);
                                }
                            },
                            {
                                text    : 'Highlight tasks longer than 8 days',
                                handler : function (btn) {
                                    gantt.taskStore.queryBy(function (task) {
                                        if (task.data.leaf && task.getDuration() > 8) {
                                            var el = gantt.getSchedulingView().getElementFromEventRecord(task);
                                            el && el.frame('lime');
                                        }
                                    }, this);
                                }
                            },
                            {
                                text    : 'Filter: Tasks with progress < 30%',
                                handler : function (btn) {
                                    gantt.taskStore.filterTreeBy(function (task) {
                                        return task.get('PercentDone') < 30;
                                    });
                                }
                            },
                            {
                                text    : 'Clear Filter',
                                handler : function (btn) {
                                    gantt.taskStore.clearTreeFilter();
                                }
                            },
                            {
                                text    : 'Scroll to last task',
                                handler : function (btn) {
                                    var latestEndDate = new Date(0),
                                        latest;
                                    gantt.taskStore.getRootNode().cascadeBy(function (task) {
                                        if (task.get('EndDate') >= latestEndDate) {
                                            latestEndDate = task.get('EndDate');
                                            latest = task;
                                        }
                                    });
                                    gantt.getSchedulingView().scrollEventIntoView(latest, true);
                                }
                            }
                        ]
                    }
                }
            ]
        });

        this.callParent(arguments);
    },

    applyPercentDone : function (value) {
        this.gantt.getSelectionModel().selected.each(function (task) {
            task.setPercentDone(value);
        });
    },

    showFullScreen : function () {
        this.gantt.el.down('.x-panel-body').dom[this._fullScreenFn](Element.ALLOW_KEYBOARD_INPUT);
    },

    // Experimental, not X-browser
    _fullScreenFn  : (function () {
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
        else if (docElm.msRequestFullscreen) {
            return "msRequestFullscreen";
        }
    })()
})
;
