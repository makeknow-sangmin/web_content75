Ext.ns('App');

//Ext.Loader.setConfig({ enabled : true, disableCaching : true });
//Ext.Loader.setPath('Sch', '../../js/Sch');

//Ext.require([
//    'Sch.panel.SchedulerGrid',
//    'Sch.plugin.SummaryColumn'
//]);



var resourceStore = null;
var gridCartLine = null;
var selectedWork = null;
var eventStore = null;

function getMcResource(code) {
	for(var i=0; i< parent.MACHINE_DATA.length; i++) {

    	var id = 		(parent.MACHINE_DATA[i]).get('id') +'';
    	var mchn_code = (parent.MACHINE_DATA[i]).get('mchn_code');

		if(mchnCode = code) {
			return id;
		}
	}
	
	return -1;
}

function startConfirm(btn){
	
	
	console_log(btn);

	var selections = gridCartLine.getSelectionModel().getSelection();
    if (selections) {
        if(btn=='yes') {
        	var unique_ids = [];
        	for(var i=0; i< selections.length; i++) {
        		var rec = gridCartLine.getSelectionModel().getSelection()[i];
        		var unique_uid = rec.get('id');
        		unique_ids.push(unique_uid);
        	}
        	console_log('unique_ids=' + unique_ids);
        	
        	Ext.Ajax.request({
        		url: CONTEXT_PATH + '/production/pcsstart.do?method=startProcessByUids',
        		params:{
        			unique_id : unique_ids
        		},
        		success : function(result, request){
        			console_log("start Success");
                	gridCartLine.store.remove(selections);
        		}
        	});

        }
    }
};

var win = null;
var startAction = Ext.create('Ext.Action', {
	itemId: 'startActionId',
    iconCls: 'play',
    text: gm.getMC('CMD_Job_Confirm', '작업지시'),
    disabled: true,
    selectedObj: null,
    handler: function(widget, event) {
    	    	
    	var combo = Ext.getCmp('machineCombo');
    	var selectedMc = combo.getValue();
    	console_log(selectedMc);
    	if(selectedMc!=null && selectedMc.length>0 && selectedWork!=null) {
    		
    		console_log(selectedWork);
    		
    		var cartmapId = selectedWork.get('id');
    		var item_code = selectedWork.get('item_code');
    		var item_name = selectedWork.get('item_name');
    		var pj_code = selectedWork.get('pj_code');

    		var Name = '[' + pj_code + ']<br>' + item_name;
    		
    		
//	    	Ext.MessageBox.show({
//	            title:'작업지시',
//	            msg: '선택한 설비에 할당하겠습니끼?',
//	            buttons: Ext.MessageBox.YESNO,
//	            fn: startConfirm,
//	            icon: Ext.MessageBox.QUESTION
//	        });
    	
    	if (!this.win) {
                        this.win = new Ext.Window({
                            height  : 220,
                            width   : 350,
                            title   : '새 공정할당',
                            layout  : 'fit',
                            modal   : true,
                            items   : [
                                {
                                    xtype     : 'form',
                                    bodyStyle : 'padding:15px',
                                    items     : [
                                    	{
                                         	xtype      : 'textarea',
                                            fieldLabel : '아이템',
                                            rows: 2,
                                            fieldStyle: 'background-color: #F0F0F0; background-image: none;text-align:center;',
                                            value	   : '[' + pj_code + ']\n' + item_name
                                        },
                                        {
                                            xtype      : 'textfield',
                                            fieldLabel : '설비',
                                            name       : 'resource',
                                            readOnly   : true,
                                            fieldStyle: 'background-color: #F0F0F0; background-image: none;',
                                            value	   : selectedMc
                                        },
										{
                                         xtype      : 'hiddenfield',
                                            name       : 'name',
                                            readOnly   : true,
                                            fieldStyle: 'background-color: #F0F0F0; background-image: none;',
                                            value	   : Name
                                        },
										
                                        {
                                            xtype      : 'fieldcontainer',
                                            fieldLabel : '시작시간',
                                            msgTarget  : 'side',
                                            layout     : 'hbox',
                                            defaults   : {
                                                flex      : 1,
                                                hideLabel : true
                                            },
                                            items      : [
                                                {
                                                    xtype      : 'datefield',
                                                    name       : 'startDate',
                                                    margin     : '0 5 0 0',
                                                    format: 'Y/m/d',
													submitFormat: 'Y/m/d',// 'Y/m/d H:i:s',
    			    								dateFormat: 'Y/m/d',// 'Y/m/d H:i:s'
                                                    value      : new Date(),
                                                    allowBlank : false
                                                },
                                                {
                                                    xtype      : 'timefield',
                                                    name       : 'startTime',
                                                    value      : '09:00',
                                                    allowBlank : false
                                                }
                                            ]
                                        },
                                        {
                                            xtype      : 'fieldcontainer',
                                            fieldLabel : '종료시간',
                                            msgTarget  : 'side',
                                            layout     : 'hbox',
                                            defaults   : {
                                                flex      : 1,
                                                hideLabel : true
                                            },
                                            items      : [
                                                {
                                                    xtype      : 'datefield',
                                                    name       : 'endDate',
                                                    margin     : '0 5 0 0',
                                                    format: 'Y/m/d',
													submitFormat: 'Y/m/d',// 'Y/m/d H:i:s',
    			    								dateFormat: 'Y/m/d',// 'Y/m/d H:i:s'
                                                    value      : new Date(),
                                                    allowBlank : false
                                                },
                                                {
                                                    xtype      : 'timefield',
                                                    name       : 'endTime',
                                                    value      : '11:00',
                                                    allowBlank : false
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            buttons : [
                                {
                                    text    : '확인',
                                    scope   : this,
                                    handler : function () {
                                        var values = this.win.down('form').getForm().getValues();
                                        
                                        var name =  values.name;
                                        var resourceId = getMcResource(values.resource);
                                        
                                        console_log(name);
                                        console_log(resourceId);

                                        //sm.selected.each(function (resource) {
                                            eventStore.add(new Sch.model.Event({
                                                StartDate  : Ext.Date.parseDate(values.startDate + values.startTime, 'Y/m/dg:i A'),
                                                EndDate    : Ext.Date.parseDate(values.endDate + values.endTime, 'Y/m/dg:i A'),
                                                Name       : name,
                                                ResourceId : resourceId
                                            })
                                            );
                                        //});

                                        this.win.hide();
                                    }
                                },
                                {
                                    text    : '취소',
                                    scope   : this,
                                    handler : function () {
                                        this.win.hide();
                                    }
                                }
                            ]
                        });
                    }

                    this.win.show();
	        
	        
    	} else {
    		Ext.MessageBox.alert('작업 오류', '설비를 먼저 선택하세요.');
    	}
    }//endofhandler
});


Sch.preset.Manager.registerPreset("dayWeek", {
    timeColumnWidth     : 100,
    rowHeight           : 24,
    resourceColumnWidth : 100,
    displayDateFormat   : 'Y-m-d G:i',
    shiftUnit           : "DAY",
    shiftIncrement      : 1,
    defaultSpan         : 5,
    timeResolution      : {
        unit      : "HOUR",
        increment : 1
    },
    headerConfig        : {
        bottom : {
            unit     : "DAY",
            renderer : null // set in scheduler initialization
        },
        middle : {
            unit       : "DAY",
            align      : 'center',
            dateFormat : 'M d일 (D)'
        },
        top    : {
            unit     : "WEEK",
            align    : 'center',
            renderer : function (start, end, cfg) {
                return Ext.Date.format(start, 'Y년 M W') + '' + '주';// Sch.util.Date.getShortNameOfUnit("WEEK");
            }
        }
    }
});


Ext.onReady(function () {
	
    Ext.define('MchnResource', {
        extend : 'Sch.model.Resource',
        fields : ['mchn_code', 'state']
    });
	resourceStore = Ext.create("Sch.data.ResourceStore", {
		model : 'MchnResource'
    });
	   
	for(var i=0; i< parent.MACHINE_DATA.length; i++) {
       	var o = {};
    	o['Id'] = 		(parent.MACHINE_DATA[i]).get('id') +'';
    	o['Name'] = 	(parent.MACHINE_DATA[i]).get('name_cn');
    	o['mchn_code'] =(parent.MACHINE_DATA[i]).get('mchn_code');
    	o['state'] = 	(parent.MACHINE_DATA[i]).get('state');
    	console_log(o);
		resourceStore.add(o);
	}
	
	Ext.define('CartLine', {
		 extend: 'Ext.data.Model',
		 fields : ['unique_id', 'pj_code', 'item_code', 'item_name'],
		    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/production/pcsstart.do?method=read&has_pcsstd=Y',
		            create: CONTEXT_PATH + '/production/pcsstart.do?method=startSimple',
		            update: CONTEXT_PATH + '/production/pcsstart.do?method=startSimple',
		            destroy: CONTEXT_PATH + '/production/pcsstart.do?method=destroy'
		        },
				reader: {
					type: 'json',
					root: 'datas',
					totalProperty: 'count',
					successProperty: 'success'
				},
				writer: {
		            type: 'singlepost',
		            writeAllFields: false,
		            root: 'datas'
		        }
			}
	});
	
	var storeCartLine = new Ext.data.Store({  
		model: 'CartLine',
		sorters: [{
	       property: 'unique_id',
	       direction: 'DESC'
	   }]
	});
		storeCartLine.load(function() {
		var selModelC = Ext.create('Ext.selection.CheckboxModel', {
		    listeners: {
		        selectionchange: function(sm, selections) {
//		        	gridCartLine.down('#returnButton').setDisabled(selections.length == 0);
		        }
		    }
		});
			
			gridCartLine = Ext.create('Ext.grid.Panel', {
			        store: storeCartLine,
			        collapsible: true,
			        multiSelect: true,
			        stateId: 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
			        selModel: selModelC,
			        autoScroll: true,
			        autoHeight: true,
			        split: true,
	                region: 'west',
	              	width: 250,
	                height: '100%',
	                frame: false,
	    		    dockedItems: [{
	    				xtype: 'toolbar',
	    				items: [{
	    					fieldLabel: '설비',
	    					labelWidth: 30,
	    					id :'machineCombo',
	    			        name : 'machineCombo',
	    			        xtype: 'combo',
	    			        mode : 'local',
	    			        queryMode : 'local',
	    			        editable : false,
	    			        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
	    			        store: resourceStore,
	    			        emptyText:   '선택',
	    			        displayField:   'mchn_code',
	    			        valueField:   'mchn_code',
	    			        typeAhead: false,
	    		            hideLabel: false,
	    			        width: 120,
	    			        listeners: {
	    			        	select: function (combo, record) {
	    			        		
	    			        	}//endofselect
	    			        }//endoflistener
	    				}, '-', startAction]//endofitems
	    		    }],
				    columns            : [
				           { 
				        	header : '프로젝트 코드', 
				        	sortable : true, 
				        	width : 60, 
				        	dataIndex : 'pj_code'
				        },
				           { 
				        	header : '품목코드', 
				        	sortable : true, 
				        	width : 60, 
				        	dataIndex : 'item_code'
				        },
				        { 
				        	header : '품목명', 
				        	sortable : true, 
				        	width : 80, 
				        	dataIndex : 'item_name'
				        }
				    ],
			        viewConfig: {
			            stripeRows: true,
			            enableTextSelection: true,
			            getRowClass: function(record) { 
			            	   if(record.get('standard_flag')=="K"){
			            		   	return 'selected-row';                           
			            		} else if (record.get('standard_flag')=="S"){
			            			   return 'selected-green-row';  
			            		} else if(record.get('standard_flag')=="M") {
			            			   return 'my-row';  
			            		} else {
			            			   return  '';  
			            		}
				            },
			            listeners: {
			            	'afterrender' : function(grid) {
								var elments = Ext.select(".x-column-header",true);//.x-grid3-hd
								elments.each(function(el) {
											}, this);
									
								}
			            		,
			                itemcontextmenu: function(view, rec, node, index, e) {
			                    e.stopEvent();
			                    contextCMenu.showAt(e.getXY());
			                    return false;
			                },
			                itemdblclick: function(){
			                }

			            }
			        },
			        title:'프로젝트/BOM'

			    });
				gridCartLine.getSelectionModel().on({
			        selectionchange: function(sm, selections) {
			            if (selections.length) {
			            	console_log(selections[0]);
			            	startAction.enable();
			            	selectedWork = selections[0];
			            } else{
			            	startAction.disable();
			            	selectedWork = null;
			            }
			        }
			    });
				
				
			    
    			scheduler = App.SchedulerDemo.init(gridCartLine);
			});

    
});


Ext.define('McScheduler', {
    extend             : 'Sch.panel.SchedulerGrid',
    xtype              : 'mcscheduler',
    eventBarTextField  : 'Name',
    viewPreset         : 'dayWeek',
    startDate          : new Date(2014, 11, 1),
    endDate            : new Date(2014, 11, 14),
    rowHeight          : 36,
    //snapToIncrement : true,
    border            : false,
    eventResizeHandles : 'both',

    columns            : [
           { 
        	header : '설비코드', 
        	sortable : true, 
        	width : 60, 
        	dataIndex : 'mchn_code', 
        	locked : true, 
        	align       : 'center'
        },
        { 
        	header : '설비명', 
        	sortable : true, 
        	width : 80, 
        	dataIndex : 'Name', 
        	locked : true, 
        	align       : 'center',
        	renderer : function (v) {
            	return '<font color="#4D83BB">' + v + '</font>';
        	}
        }/*,
        {
            xtype       : 'summarycolumn',
            header      : '가동시간',
            align       : 'right',
            width       : 80,
            showPercent : false
        },

        {
            xtype       : 'summarycolumn',
            header      : '가동률(%)',
            showPercent : true,
            align       : 'right',
            width       : 60
        }*/
    ],

    onEventCreated : function (newEventRecord) {
        newEventRecord.setName('New task...');
    },

    initComponent : function() {
        this.headerTpl = new Ext.XTemplate('<tpl for="."><div class="summary-event" style="left:{left}px;width:{width}px">{text}</div></tpl>');

        Sch.preset.Manager.get('dayWeek').headerConfig.bottom.renderer = Ext.Function.bind(this.frozenHeaderRenderer, this);

        this.callParent(arguments);
    },

    // Render some special 'frozen' header events which are always shown
    frozenHeaderRenderer : function (start, end, cfg, i, eventStore) {
        var me = this;

        if (i === 0) {
            var eventsInSpan = eventStore.queryBy(function (task) {
                return task.getResourceId() === 'frozen' && me.timeAxis.timeSpanInAxis(task.getStartDate(), task.getEndDate());
            });

            var tplData = Ext.Array.map(eventsInSpan.items, function (task) {
                var startX = me.getSchedulingView().getXFromDate(task.getStartDate());
                var endX = me.getSchedulingView().getXFromDate(task.getEndDate());

                return {
                    left  : startX,
                    width : endX - startX,
                    text  : task.getName()
                }
            });

            return me.headerTpl.apply(tplData);
        }
    }
});


App.SchedulerDemo = {

    // Initialize application
    init : function (grid) {

	    eventStore =Ext.create("Sch.data.EventStore", {
            data : [
                {Id : 'e10', ResourceId : '6100001328', Name : 'P069<br>fastT', StartDate : "2014-12-02", EndDate : "2014-12-03"},
                {Id : 'e11', ResourceId : '6100001326', Name : 'P054<br>RFx-P01', StartDate : "2014-12-04", EndDate : "2014-12-07"},
                {Id : 'e21', ResourceId : '6100001324', Name : 'P055<br>Customize', StartDate : "2014-12-01", EndDate : "2014-12-04"},
                {Id : 'e22', ResourceId : 'r4', Name : 'Assignment 4', StartDate : "2014-12-05", EndDate : "2014-12-07"},
                {Id : 'e32', ResourceId : 'r5', Name : 'Assignment 5', StartDate : "2014-12-07", EndDate : "2014-12-11"},
                {Id : 'e33', ResourceId : 'r6', Name : 'Assignment 6', StartDate : "2014-12-09", EndDate : "2014-12-11"}
                ,
                {Id : 'special1', ResourceId : 'frozen', Name : '공장실사', StartDate : "2014-12-02", EndDate : "2014-12-05"},
                {Id : 'special2', ResourceId : 'frozen', Name : '설비점검기간', StartDate : "2014-12-07", EndDate : "2014-12-08"},
                {Id : 'special3', ResourceId : 'frozen', Name : 'S사 방문', StartDate : "2014-12-08", EndDate : "2014-12-09"}
            ]
        });
        
		var items = [];
		
		items.push({
                    xtype           : 'mcscheduler',
                    region    		: 'center',
                    flex			: 1,
                    border          : false,
                    startDate       : new Date(2014, 11, 1),
                    endDate         : new Date(2014, 11, 14),
                    resourceStore   : resourceStore,
                    eventStore      : eventStore
                });
		
        //수정모드이면
        if(G_MODE=='EDIT') {
        	items.push(grid);
        	/*
        	    //we want to setup a model and store instead of using dataUrl
		    Ext.define('Task', {
		        extend: 'Ext.data.Model',
		        fields: [
		            {name: 'task',     type: 'string'},
		            {name: 'user',     type: 'string'},
		            {name: 'duration', type: 'string'}
		        ]
		    });
		
		    var bomStore = Ext.create('Ext.data.TreeStore', {
		        model: 'Task',
		        proxy: {
		            type: 'ajax',
		            //the store will get the content from the .json file
		            url: 'treegrid.json'
		        },
		        folderSort: true
		    });
		
		    //Ext.ux.tree.TreeGrid is no longer a Ux. You can simply use a tree.TreePanel
		    var tree = Ext.create('Ext.tree.Panel', {
		        title: '프로젝트/BOM',
		        width: 250,
		        //height: 300,
		        //renderTo: Ext.getBody(),
		        collapsible: true,
	            animCollapse: true,
		        useArrows: true,
		        rootVisible: false,
		        store: bomStore,
		        multiSelect: true,
		        singleExpand: true,
		        region    		: 'west',
		        //the 'columns' property is now 'headers'
		        columns: [{
		            xtype: 'treecolumn', //this is so we know which column will show the tree
		            text: 'Task',
		            flex: 2,
		            sortable: true,
		            dataIndex: 'task'
		        },{
		            //we must use the templateheader component so we can use a custom tpl
		            xtype: 'templatecolumn',
		            text: 'Duration',
		            flex: 1,
		            sortable: true,
		            dataIndex: 'duration',
		            align: 'center',
		            //add in the custom tpl for the rows
		            tpl: Ext.create('Ext.XTemplate', '{duration:this.formatHours}', {
		                formatHours: function(v) {
		                    if (v < 1) {
		                        return Math.round(v * 60) + ' mins';
		                    } else if (Math.floor(v) !== v) {
		                        var min = v - Math.floor(v);
		                        return Math.floor(v) + 'h ' + Math.round(min * 60) + 'm';
		                    } else {
		                        return v + ' hour' + (v === 1 ? '' : 's');
		                    }
		                }
		            })
		        },{
		            text: 'Assigned To',
		            flex: 1,
		            dataIndex: 'user',
		            sortable: true
		        }]
		    });
		    items.push(tree);
			*/
        }
        
        var vp = new Ext.Viewport({
            layout : 'border',
            items  : items
        });


        
        
        var sched = Ext.ComponentQuery.query('schedulergrid[lockable=true]')[0],
            lockedSection = sched.lockedGrid,
            view = lockedSection.getView();

        lockedSection.el.on('click', function (e, t) {
            var rowNode = view.findItemByChild(t);
            var resource = view.getRecord(rowNode);
            Ext.Msg.alert('Hey', 'You clicked ' + resource.get('Name'));
            e.stopEvent();
        }, null, { delegate : '.mylink' });

        return vp.down('schedulergrid');
    }
};
