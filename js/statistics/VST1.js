var grid = null;
var store = null;

var Fgrid = null;
var FrowIndex = null;
//var real_end_date = '';
//var real_due_date = '';
var defaultDesign= [
                      '1. Design',
                      'Mold Concept Design',
                      'Mold Detail Design(CAD)',
                      'Process Design'
                      ];

var defaultPurchase= [
                    '2. Purchase',
                    'Mold Base & Main Insert',
                    'General Component & Parts',
                    'Processing OutSourcing'
                    ];
var defaultProcessing= [
                    '3. Processing',
                    'Mold Base',
                    'Heat Treatment',
                    'CNC Programming',
                    'CNC',
                    'Electrode',
                    'EDM',
                    'W/C',
                    'Component'
                    ];
var defaultDelivery= [
                    '4. Test & Delivery',
                    'Assembly',
                    'Test',
                    'Delivery'
                    ];
var defaultTaskArray=[defaultDesign, defaultPurchase, defaultProcessing, defaultDelivery];


var Task_columns = {
		text: 'Task',
        width: 300,
//        locked: true,
        tdCls: 'task',
        sortable: true,
        dataIndex: 'description',
        hideable: false,
//        summaryType: 'count',
//        summaryRenderer: function(value, summaryData, dataIndex) {
//        },
//        },
//            return ((value === 0 || value > 1) ? '(' + value + ' Tasks)' : '(1 Task)');
        field: {
            xtype: 'textfield'
        }
};

var Task_Title = {
		
};

var Project_columns = {
		header: 'TaskTitle',
        width: 180,
        sortable: true,
        dataIndex: 'task_title',
        hideable: false,
        field: {
            xtype: 'textfield'
        }
};

var userStore = Ext.create('Mplm.store.UserStore', {hasNull: false} );

var Schedule_columns = {
		header: 'Schedule',
        columns: [{
        	header: 'Manager',
            width: 80,
            sortable: true,
            dataIndex: 'owner_name',
            field: {
                xtype: 'combo',
                store: userStore,
 	            displayField: 'user_name',
 	            valueField:     'user_name',
 	            listConfig: {
 	                loadingText: 'Searching...',
 	                emptyText: 'No matching posts found.',
 	                // Custom rendering template for each item
 	                getInnerTpl: function() {
 	                    return '<div data-qtip="{dept_code}">{user_name}</div>';
 	                }
 	            }
            }
        },{
            header: 'Planned Date',
            width: 125,
            sortable: true,
            dataIndex: 'due_date_str',
//            summaryType: 'max',
	    	renderer: Ext.util.Format.dateRenderer('Y-m-d'),
//	    	summaryRenderer: Ext.util.Format.dateRenderer('yyyy-MM-dd'),
            field: {
                xtype: 'datefield'
//                listeners: {
//                    select: function(dtpIssueDate, date) {
//                      var bb = dtpIssueDate.rawValue;
//                      var Year = date.getUTCFullYear();
//                      var day = bb.substring(0,5);
//                      real_due_date = Year+'/'+day;
//                    }
//                }
            }
        }, {
            header: 'Finished Date',
            width: 125,
            sortable: true,
            dataIndex: 'end_date_str',
//            summaryType: 'max',
            renderer: Ext.util.Format.dateRenderer('Y-m-d'),
//            summaryRenderer: Ext.util.Format.dateRenderer('yyyy-MM-dd'),
            field: {
                xtype: 'datefield'
//                listeners: {
//                    select: function(dtpIssueDate, date) {
//                      var bb = dtpIssueDate.rawValue;
//                      var Year = date.getUTCFullYear();
//                      var day = bb.substring(0,5);
//                      real_end_date = Year+'/'+day;
//                    }
//                }
            }
        }, {
            header: 'Planned Cost',
            width: 125,
            sortable: true,
            renderer: Ext.util.Format.Money,
            dataIndex: 'resource_plan',
//            summaryType: 'average',
//            summaryRenderer: Ext.util.Format.usMoney,
            field: {
                xtype: 'numberfield'
            }
        }, {
            header: 'Real Cost',
            width: 114,
            sortable: true,
            renderer: Ext.util.Format.Money,
            dataIndex: 'resource_mh',
//            summaryRenderer: Ext.util.Format.usMoney,
//            summaryType: 'average',
            field: {
                xtype: 'numberfield'
            }
        }, {
        	text: 'Task_Title',
    		width: 120,
    		sortable: true,
    		dataIndex: 'task_title',
    		hideable: false,
    		field: {
    			xtype: 'textfield'
    		}
        }, {
        	xtype: 'actioncolumn',
        	width: 55, 
        	sortable: false,
        	header: 'REMOVE',
//        	icon: 'remove',
//    		iconCls: 'save',
        	items: [{
        		itemId: 'removeButton',
        		icon:CONTEXT_PATH +  '/extjs/shared/icons/fam/delete.png',
        		handler: function(grid, rowIndex, colindex) {
        			var record = grid.getStore().getAt(rowIndex);
        			console_log(record);
        			Fgrid = grid;
        			FrowIndex = rowIndex;
        			var position = record.get('position');
//        			if(position%100==0){
//        				Ext.MessageBox.confirm(panelSRO1137, vst1_group_delete, destoryConfirm);
//        			}else{
            			Ext.MessageBox.confirm(panelSRO1137, vst1_delete, destoryConfirm);
//        			}
        		} // eo handler
        	}]
        }, {
        	xtype: 'actioncolumn',
        	width: 40, 
        	sortable: false,
        	header: 'ADD',
//        	icon: 'brick_add',
//    		iconCls: 'save',
        	items: [{
        		itemId: 'createButton',
        		icon: CONTEXT_PATH +  '/extjs/shared/icons/fam/add.png',
        		handler: function(grid, rowIndex, colindex) {
        			Fgrid = grid;
        			FrowIndex = rowIndex;
            		Ext.MessageBox.confirm(panelSRO1136, vst1_add, createConfirm);
            	} // eo handler
        	}]
        	
        }]
};

var updown =
{
	text: Position,
    menuDisabled: true,
    sortable: false,
    xtype: 'actioncolumn',
    width: 60,
    items: [{
        icon   : CONTEXT_PATH +  '/extjs/shared/icons/fam/grid_up.png',  // Use a URL in the icon config
        tooltip: 'Up',
        handler: function(agridV, rowIndex, colIndex) {
        	var record = grid.getStore().getAt(rowIndex);
        	console_log(record);
        	var position = record.get('position');
        	var unique_id = record.get('id');
        	var pj_unique = record.get('pj_unique');
        	var task_title = record.get('task_title');
        	var direction = -15;

//        	if(position.substring(2,4)==10){
//        		Ext.MessageBox.alert(error_msg_prompt,vst1_not_move);
//        	}else{
        		Ext.Ajax.request({
         			url: CONTEXT_PATH + '/statistics/task.do?method=movePosition',
         			params:{
         				position:position,
         				unique_id:unique_id,
         				direction:direction,
         				pj_unique:pj_unique,
         				task_title:task_title
         			},
         			success : function(result, request) {  
     					store.load(function() {});
         			}
           	    });
//        	}
        	
		}
    },{
        icon   : CONTEXT_PATH +  '/extjs/shared/icons/fam/grid_down.png',   // Use a URL in the icon config
        tooltip: 'Down',
        handler: function(agridV, rowIndex, colIndex) {

        	var record = grid.getStore().getAt(rowIndex);
        	console_log(record);
        	var position = record.get('position');
        	var unique_id = record.get('id');
        	var pj_unique = record.get('pj_unique');
        	var task_title = record.get('task_title');
        	var direction = 15;

//        	if(position.substring(1,4)==000){
//        		Ext.MessageBox.alert(error_msg_prompt,vst1_not_move);
//        	}else{
        		Ext.Ajax.request({
        			url: CONTEXT_PATH + '/statistics/task.do?method=movePosition',
        			params:{
        				position:position,
        				unique_id:unique_id,
        				direction:direction,
        				pj_unique:pj_unique,
        				task_title:task_title
        			},
        			success : function(result, request) {
        				store.load(function() {});
        			}
        		});	
//        	}
        }
    }]
};



var saveAction = Ext.create('Ext.Action', {
	text: panelSRO1133,
    iconCls: 'save',
    disabled: false,
    handler: function (){
    	for (var i = 0; i <grid.store.data.items.length; i++)
        {
              var record = grid.store.data.items [i];
              if (record.dirty) {
//            	  console_log(real_end_date);
//            	  console_log(real_due_date);
//              	record.set('id',unique_uid);
//              	record.set('end_date',real_end_date);
//              	record.set('due_date',real_due_date);
              	console_log(record);
          		//저장 수정
              	record.save({
              		success : function() {
              			 store.load(function() {});
              		}
              	 });
              }
             
        }
    }
});

function createConfirm(btn){
	if(btn == 'yes'){
		var record = Fgrid.getStore().getAt(FrowIndex);
		console_log(record);
		var task_title = record.get('task_title');
		var parent = record.get('parent');
		var pj_unique = record.get('pj_unique');
		var position = record.get('position');
		Ext.Ajax.request({
			url: CONTEXT_PATH + '/statistics/task.do?method=createcolumn',
			params:{
				task_title : task_title
				,parent : parent
				,pj_unique : pj_unique
				,position : position
			},
			success : function(result, request) {
				store.load(function() {});
			},
			failure: extjsUtil.failureMessage
		});	
	}
}

function destoryConfirm(btn){
	if(btn == 'yes'){
		var record = Fgrid.getStore().getAt(FrowIndex);
		console_log(record);
		var unique_id = record.get('id');
		var position = record.get('position');
		var task_title = record.get('task_title');
		var pjttsk = Ext.ModelManager.create({
       		unique_id : unique_id,
       		position : position,
       		task_title : task_title
    	 }, 'PjtTsk');
		pjttsk.destroy( {
      		 success: function() {
      			store.load(function() {});
      		 }
      	});
//		grid.store.remove(record);
	}
}
var addGroup = Ext.create('Ext.Action', {
	iconCls:'add',
	disabled: fPERM_DISABLING(),
    text: vst1_addgroup_button,
    handler: function(widget, event) {
    	Ext.MessageBox.confirm(panelSRO1136, vst1_addgroup, addGroupConfirm);
    }
});

function addGroupConfirm(btn){
	if(btn == 'yes'){
		console_log(selectedAssyUid);
		Ext.Ajax.request({
			url: CONTEXT_PATH + '/statistics/task.do?method=createcolumn',
			params:{
				pj_unique : selectedAssyUid,
				arrDefaultDesign : defaultDesign
			},
			success : function(result, request) {
				store.load(function() {});
			},
			failure: extjsUtil.failureMessage
		});	
	}
}

Ext.onReady(function() {  
	    Ext.tip.QuickTipManager.init();
	    
	    var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
	        clicksToEdit: 1
	    });
	    
	    var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
	    
	    var projectToolBar = getProjectToolbar(false/*hasPaste*/, false/*excelPrint*/) ;

	    Ext.define('PjtTsk', {
	        extend: 'Ext.data.Model',
	      	 fields: /*(G)*/vCENTER_FIELDS,
	      	    proxy: {
	    				type: 'ajax',
	    		        api: {
	    		            read: CONTEXT_PATH + '/statistics/task.do?method=read', /*1recoed, search by cond, search */
//	    		            create: CONTEXT_PATH + '/sales/buyer.do?method=create', /*create record, update*/
	    		            update: CONTEXT_PATH + '/statistics/task.do?method=update',
	    		            destroy: CONTEXT_PATH + '/statistics/task.do?method=destroy' /*delete*/
	    		        },
	    				reader: {
	    					type: 'json',
	    					root: 'datas',
	    					totalProperty: 'count',
	    					successProperty: 'success',
	    					excelPath: 'excelPath'
	    				},
	    				writer: {
	    		            type: 'singlepost',
	    		            writeAllFields: false,
	    		            root: 'datas'
	    		        } 
	    			}
	    });
	    
	    var tempColumn = [];
		
	    tempColumn.push(updown);
	    tempColumn.push(Project_columns);
		tempColumn.push(Task_columns);
		tempColumn.push(Schedule_columns);
		
	    store = Ext.create('Ext.data.Store', {
	        model: 'PjtTsk',
	        sorters: [{
	        	property: 'position', 
	        	direction: 'ASC'
    		}],
	        groupField: 'task_title'
	    });
	    
	    store.getProxy().setExtraParam('defaultTaskArray', defaultTaskArray);
	    store.load(function() {
		    grid = Ext.create('Ext.grid.Panel', {
		        frame: true,
		        selModel: selModel,
		        title:getMenuTitle(),
		        iconCls: 'icon-grid',
		        store: store,
		        plugins: [cellEditing],
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
		        dockedItems: [{
		 			            xtype: 'toolbar',
		 			            items: projectToolBar
		        },{
		        	xtype: 'toolbar',
		            items: [saveAction,addGroup]
		        }],
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
		        columns: tempColumn
		    });
	    fLAYOUT_CONTENT(grid);
	    cenerFinishCallback();
	    });
	 });